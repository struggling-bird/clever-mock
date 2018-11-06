const mysql = require('mysql')
const config = require('../config')
const util = require('../utils/util')

const pool = mysql.createPool({
  ...config.db
})
const printSql = function (sql, values) {
  let str = sql
  values.forEach(val => {
    str = str.replace('?', util.isString(val) ? `'${val}'` : val)
  })
  console.log('执行sql', str)
}

const formatRes = function (sql, res) {
  if (/^select/.test(sql)) {
    let list = []
    res.forEach(item => {
      list.push(util.toCamelObj(item))
    })
    return list
  } else {
    return res
  }
}
module.exports = {
  query (sql, params = []) {
    return new Promise((resolve, reject) => {
      printSql(sql, params)
      pool.query(sql, params, function (err, results) {
        if (err) {
          console.error('执行sql错误', err)
          reject(err)
        } else {
          resolve(formatRes(sql, results))
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
      printSql(sql, params)
      connect.query(sql, params, function (err, results) {
        if (err) {
          console.error('事务中执行sql失败', err)
          reject(err)
        } else {
          resolve(formatRes(sql, results))
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
