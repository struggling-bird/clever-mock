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
    desc: ''
  }) {
    const sql = {
      addProject: 'INSERT INTO project (id, name, proxy_url, description, create_time) VALUES (?, ?, ?, ?, ?)',
      addLink: 'INSERT INTO user_project (user_id, project_id, is_admin) VALUES (?, ?, ?)'
    }
    return new Promise((resolve, reject) => {
      let id = uuid()
      let connection = null
      db.beginTransaction().then(conn => {
        connection = conn
        return db.queryInTransaction(connection, sql.addProject,
          [id, project.name, project.proxyUrl, project.desc, new Date().getTime()])
      }).then(() => {
        return db.queryInTransaction(connection, sql.addLink, [userId, id, 1])
      }).then(() => {
        return db.commit(connection)
      }).then(() => {
        resolve(id)
      }).catch(err => {
        db.rollback(connection)
        reject(err)
      })
    })
  }
}
//
