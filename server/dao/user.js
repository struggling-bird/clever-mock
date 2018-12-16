const db = require('./pool')
const uuid = require('uuid/v1')
const util = require('../utils/util')

module.exports = {
  async getUser (username, password) {
    const sql = 'select u.* from user as u where name=? or email = ? and password=?'
    const res = await db.query(sql, [username, username, password])
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
  },
  async invite (param = {
    email: '',
    projectId: ''
  }) {
    // todo 验证用户是否已存在，已存在的话，直接添加关联就行了
    let userId = uuid()
    let sql = `insert into user(id, email, password) values (?, ?, ?)`
    const conn = await db.beginTransaction()
    // 添加用户
    await db.queryInTransaction(conn, sql, [userId, param.email, '123456'])
    // 添加和project的关联
    sql = 'insert into user_project(user_id, project_id, role) values(?, ?, ?)'
    await db.queryInTransaction(conn, sql, [userId, param.projectId, 1])
    try {
      await db.commit(conn)
      return await this.getById(userId)
    }catch (e) {
      db.rollback(conn)
      throw e
    }
  },
  async update (user) {
    let props = []
    let values = []
    for (let prop in user) {
      props.push(`${util.toUnderLine(prop)}=?`)
      values.push(user[prop])
    }
    values.push(user.id)
    let sql = `update user set ${props.join(',')} where id = ?`
    await db.query(sql, values)
    return await this.getById(user.id)
  },
  async query (adminId, projectId) {
    // todo 校验用户权限
    let sql = 'select distinct u.*,r.id as role_id, r.name as role_name from user as u ' +
      'left join user_project as up ' +
      ' on u.id = up.user_id ' +
      'left join role as r' +
      ' on r.id = up.role ' +
      'where up.project_id = ?'
    let list = await db.query(sql, [projectId, adminId])
    list.forEach(user => {
      delete user.password
    })
    return list
  },
  async removeMember (currentUserId, projectId, id) {
    // 确认当前用户是否有权限删除用户
    let sql = 'select * from user_project where user_id = ? and project_id = ? and role = 0'
    let user = await db.query(sql, [currentUserId, projectId])
    if (user.length) {
      // 删除用户
      sql = 'delete from user_project where user_id = ? and project_id = ?'
      await db.query(sql, [id, projectId])
    } else {
      throw new Error('noPermission')
    }
  }
}
