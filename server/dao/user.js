const db = require('./pool')

module.exports = {
  getUser (username, password) {
    return new Promise((resolve, reject) => {
      const sql = 'select user.id,user.name,user.email,user.group from user where name=? and password=?'
      db.query(sql, [username, password]).then((res, fields) => {
        resolve(res[0])
      }).catch(err => {
        reject(err)
      })
    })
  }
}