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
          console.error('执行sql错误', err)
          reject(err)
        } else {
          // todo 把返回结果中的字段名称，都转为驼峰形式
          resolve(results)
        }
      })
    })
  },
  beginTransaction () {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          console.error('获取数据库连接失败', err)
          reject(err)
          return
        }
        connection.beginTransaction(function (error) {
          if (error) {
            console.error('开启事务失败', error)
            reject(error)
          } else {
            resolve(connection)
          }
        })
      })
    })
  },
  queryInTransaction (connect, sql, params = []) {
    return new Promise((resolve, reject) => {
      connect.query(sql, params, function (err, results) {
        if (err) {
          console.error('事务中执行sql失败', err)
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  commit (connection) {
    return new Promise((resolve, reject) => {
      connection.commit(function (err) {
        if (err) {
          console.error('提交事务失败', err)
          reject(err)
        } else {
          connection.release()
          resolve()
        }
      })
    })
  },
  rollback (connection) {
    connection.rollback(function () {
      connection.release()
    })
  }
}
