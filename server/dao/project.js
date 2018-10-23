const db = require('./pool')

module.exports = {
  query (userId) {
    const sql = 'select * from project'
    return db.query(sql, [userId])
  }
}
