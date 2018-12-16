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
  async add (userId, project = {
    name: '',
    proxyUrl: '',
    desc: ''
  }) {
    const sql = {
      addProject: 'INSERT INTO project (id, name, proxy_url, description, create_time, secret_key) VALUES (?, ?, ?, ?, ?, ?)',
      addLink: 'INSERT INTO user_project (user_id, project_id) VALUES (?, ?)',
      addApiGroup: 'insert into apigroup (id, name, project_id, reg) values (?,?,?,?)',
      proxy: 'insert into proxy_server (id, url, project_id) values(?,?,?)'
    }
    const conn = await db.beginTransaction()
    let projectId = uuid()
    let key = uuid()
    // 添加project
    await db.queryInTransaction(conn, sql.addProject,
      [projectId, project.name, project.proxyUrl, project.desc, new Date().getTime(), key])
    // 添加与用户的关联
    await db.queryInTransaction(conn, sql.addLink, [userId, projectId])
    // 添加默认分组
    await db.queryInTransaction(conn, sql.addApiGroup, [uuid(), '未分组', projectId, '\\S*'])
    // 提取proxyUrl
    await db.queryInTransaction(conn, sql.proxy, [uuid(), project.proxyUrl, projectId])
    try {
      await db.commit(conn)
      return projectId
    } catch (e) {
      db.rollback(conn)
      throw e
    }
  },
  getById (userId, id) {
    const sql = 'select p.*,up.role from project as p ' +
      'left join user_project as up ' +
      'on p.id = up.project_id ' +
      'where up.user_id = ? and p.id = ?'
    return db.query(sql, [userId, id])
  },
  queryByKey (key) {
    const sql = 'select * from project where project.secret_key = ?'
    return db.query(sql, [key])
  },
  async delById (userId, id) {
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
    // 7. 删除proxyServer记录
    await db.queryInTransaction(conn, 'delete from proxy_server where project_id = ?', [id])
    // 7. 删除project
    await db.queryInTransaction(conn, 'delete from project where id = ?', [id])
    try {
      db.commit(conn)
    } catch (e) {
      db.rollback(conn)
      throw e
    }
  },
  async update (project, userId) {
    const conn = await db.beginTransaction()
    // step1.检查当前用户是否有权限修改工程
    let sql = 'select p.* from project as p ' +
      'left join user_project as up ' +
      ' on p.id = up.project_id ' +
      'where up.user_id = ? and up.project_id = ?'
    const projectList = await db.queryInTransaction(conn, sql, [userId, project.id])
    if (!projectList.length) throw new Error('no permission')
    // step2.修改项目基本信息
    sql = `update project set name=?,proxy_url=?,description=? where id = ?`
    await db.queryInTransaction(conn, sql, [project.name, project.proxyUrl, project.description, project.id])
    // step3.查询代理地址，如果要修改的代理地址为新地址，则保存代理地址
    sql = 'select * from proxy_server where project_id = ? and url = ?'
    const proxyServers = await db.queryInTransaction(conn, sql, [project.id, project.proxyUrl])
    if (!proxyServers.length) {
      sql = 'insert into proxy_server(id,url, project_id) values(?,?,?)'
      await db.queryInTransaction(conn, sql, [uuid(), project.proxyUrl, project.id])
    }
    // step4.批量修改代理
    if (project.global) {
      sql = 'update api set proxy_url = ? where project_id = ?'
      await db.queryInTransaction(conn, sql, [project.proxyUrl, project.id])
    }
    // step5.查询项目详情
    sql = 'select * from project where id = ?'
    const res = await db.queryInTransaction(conn, sql, [project.id])
    try {
      await db.commit(conn)
    } catch (e) {
      db.rollback(conn)
      throw e
    }
    return res[0]
  }
}
