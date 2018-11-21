const db = require('./pool')
const uuid = require('uuid/v1')

module.exports = {
  query (userId) {
    const sql = 'select p.*,u.name as "username",up.role from project as p ' +
      'left join user_project as up on p.id = up.project_id ' +
      'left join user as u on u.id = up.user_id ' +
      'where up.user_id = ?'
    return db.query(sql, [userId])
  },
  add (userId, project = {
    name: '',
    proxyUrl: '',
    serverHost: '',
    desc: ''
  }) {
    const sql = {
      addProject: 'INSERT INTO project (id, name, server_host, proxy_url, description, create_time) VALUES (?, ?, ?, ?, ?, ?)',
      addLink: 'INSERT INTO user_project (user_id, project_id) VALUES (?, ?)',
      addApiGroup: 'insert into apigroup (id, name, project_id, reg) values (?,?,?,?)'
    }
    return new Promise((resolve, reject) => {
      let projectId = uuid()
      let connection = null
      db.beginTransaction().then(conn => {
        connection = conn
        return db.queryInTransaction(connection, sql.addProject,
          [projectId, project.name, project.serverHost, project.proxyUrl, project.desc, new Date().getTime()])
      }).then(() => {
        return db.queryInTransaction(connection, sql.addLink, [userId, projectId])
      }).then(() => {
        return db.queryInTransaction(connection, sql.addApiGroup, [uuid(), '未分组', projectId, '\\S*'])
      }).then(() => {
        return db.commit(connection)
      }).then(() => {
        resolve(projectId)
      }).catch(err => {
        db.rollback(connection)
        reject(err)
      })
    })
  },
  getById (userId, id) {
    const sql = 'select p.* from project as p ' +
      'left join user_project as up ' +
      'on p.id = up.project_id ' +
      'where up.user_id = ? and p.id = ?'
    return db.query(sql, [userId, id])
  },
  queryByHost (host) {
    const sql = 'select * from project where project.server_host = ?'
    return db.query(sql, [host])
  },
  async delById (userId, id) {
    /**
     * 1.删除api调用记录
     * 2.删除api
     * 3.删除apiGroup
     * 4.删除project与user的联系
     * 5.删除project
     */
    // 1. 判断当前用户是否有删除项目的权限
    const conn = await db.beginTransaction()
    const list = await db.queryInTransaction(conn, 'select p.* from project as p ' +
      'left join user_project as up on p.id = up.project_id ' +
      'where p.id = ? and up.user_id = ? and up.role = 0', [id, userId])
    if (!list.length) {
      db.rollback(conn)
      throw new Error('noPermission')
    }
    // 2.查询项目下所有的API
    const apiList = await db.queryInTransaction(conn, 'select * from api where project_id = ?', [id])
    // 3. 删除API关联的所有日志
    let idList = []
    let codeList = []
    await Promise.all(apiList.map(api => {
      idList.push(api.id)
      codeList.push('?')
      return db.queryInTransaction(conn, 'delete from call_history where api_id = ?', [api.id])
    }))
    // 4. 删除项目下所有的API
    if (apiList.length) await db.queryInTransaction(conn, `delete from api where id in(${codeList.join(',')})`, idList)
    // 5. 删除apiGroup
    await db.queryInTransaction(conn, 'delete from apigroup where project_id = ?', [id])
    // 6. 删除project与user的联系
    await db.queryInTransaction(conn, 'delete from user_project where project_id = ?', [id])
    // 7. 删除project
    await db.queryInTransaction(conn, 'delete from project where id = ?', [id])
    try {
      db.commit(conn)
    } catch (e) {
      db.rollback(conn)
      throw e
    }
  }
}
