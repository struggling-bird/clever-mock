const db = require('./pool')
const uuid = require('uuid/v1')
const util = require('../utils/util')

module.exports = {
  async getUser (username, password) {
    const sql = 'select user.* from user where name=? and password=?'
    const res = await db.query(sql, [username, password])
    if (res.length) {
      const user = res[0]
      delete user.password
      return user
    } else {
      throw new Error(`根据用户名密码获取用户信息失败`)
    }
  },
  async getById (id) {
    const sql = 'select * from user where id=?'
    const res = await db.query(sql, [id])
    if (res.length) {
      const user = res[0]
      delete user.password
      return user
    } else {
      throw new Error(`根据id:${id}获取用户信息失败`)
    }
  },
  /**
   * todo 名称和邮箱的重复性校验
   * @param user
   * @returns {Promise<*|void>}
   */
  async add (user) {
    let props = []
    let vals = []
    let code = ['?']
    const id = uuid()
    for (const key in user) {
      props.push(util.toUnderLine(key))
      vals.push(user[key])
      code.push('?')
    }
    props.push('id')
    vals.push(id)
    let sql = `insert into user(${props.join(',')}) values (${code.join(',')})`
    const conn = await db.beginTransaction()
    await db.queryInTransaction(conn, sql, vals)
    try {
      await db.commit(conn)
    } catch (e) {
      db.rollback(conn)
      throw e
    }
    
    return await this.getById(id)
  }
}
