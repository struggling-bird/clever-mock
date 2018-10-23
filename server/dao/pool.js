const mysql = require('mysql')
const config = require('../config')

const pool = mysql.createPool({
  ...config.db
})

module.exports = {
  query (sql, params = []) {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results, fields)
        }
      })
    })
  }
}