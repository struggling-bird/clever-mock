const db = require('./pool')

module.exports = {
  query (userId) {
    const sql = 'select p.*,u.name as "username" from project as p ' +
      'left join user_project as up on p.id = up.project_id ' +
      'left join user as u on u.id = up.user_id ' +
      'where up.user_id = ?'
    return db.query(sql, [userId])
  },
  add () {
    const sql = {
      addProject: 'INSERT INTO "project" ("name", "proxy_url", "desc") VALUES (?, ?, ?)',
      ref: 'INSERT INTO "user_project" ("user_id", "project_id", "is_admin") VALUES (?, ?, ?)'
    }
  }
}
//
