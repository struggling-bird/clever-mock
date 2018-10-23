const db = require('./pool')

module.exports = {
  getUser (username, password) {
    const sql = 'select user.id,user.name,user.email,user.group from user where name=? and password=?'
    return db.query(sql, [username, password])
  }
}
