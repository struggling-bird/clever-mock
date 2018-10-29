const db = require('./pool')
const uuid = require('uuid/v1')

module.exports = {
  query (userId) {
    const sql = 'select p.*,u.name as "username" from project as p ' +
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
      addLink: 'INSERT INTO user_project (user_id, project_id, is_admin) VALUES (?, ?, ?)',
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
        return db.queryInTransaction(connection, sql.addLink, [userId, projectId, 1])
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
  }
}
