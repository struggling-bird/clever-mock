const db = require('./pool')
const uuid = require('uuid/v1')
const util = require('../utils/util')

module.exports = {
  async queryByProjectId (projectId) {
    let sql = 'select g.* from apigroup as g where g.project_id = ?'
    let groupList = await db.query(sql, [projectId])
    
    sql = 'select a.id,a.name,a.path,a.method,a.group_id,a.description,a.params,a.res_structure from api as a where a.project_id = ?'
    let apiList = await db.query(sql, [projectId])
    let groupMap = {}
    groupList.forEach(group => {
      group.apiList = []
      groupMap[group.id] = group
    })
    apiList.forEach(api => {
      groupMap[api.groupId].apiList.push(api)
    })
    
    return groupList
  },
  async addGroup (group) {
    const sql = 'insert into apigroup(id, name, reg, project_id, description) values(?, ?, ?, ?, ?)'
    const id = uuid()
    const conn = await db.beginTransaction()
    await db.queryInTransaction(conn, sql, [id, group.name, group.reg, group.projectId, group.description])
    // 添加分组成功后，自动从接口列表中遍历符合条件的api并进行关联
    const apiList = await db.queryInTransaction(conn, 'select * from api where project_id = ?', [group.projectId])
    let matchApi = []
    let code = []
    apiList.forEach(api => {
      if (new RegExp(group.reg).test(api.path)) {
        matchApi.push(api.id)
        code.push('?')
      }
    })
    if (matchApi.length) {
      await db.queryInTransaction(conn, `update api set group_id = ? where id in(${code.join(',')})`, [id, ...matchApi])
    }
    try {
      await db.commit(conn)
      const addedGroup = await db.queryInTransaction(conn, 'select * from apigroup where id = ?', [id])
      return addedGroup[0]
    } catch (e) {
      db.rollback(conn)
      throw e
    }
  },
  async update (group) {
    let props = []
    let vals = []
    for (let key in group) {
      if (key === 'id') continue
      props.push(`${util.toUnderLine(key)}=?`)
      vals.push(group[key])
    }
    vals.push(group.id)
    const sql = `update apigroup set ${props.join(',')} where id=?`
    return await db.query(sql, vals)
  },
  async del (id, projectId) {
    const sql = {
      queryApis: 'select * from api where group_id = ?',
      queryGroups: 'select * from apigroup where project_id = ?',
      updateBind: 'update api set group_id=? where id = ?',
      delGroup: 'delete from apigroup where id = ?'
    }
    const conn = await db.beginTransaction()
    const apiList = await db.queryInTransaction(conn, sql.queryApis, [id])
    const groupList = await db.queryInTransaction(conn, sql.queryGroups, [projectId])
    await Promise.all(apiList.map(api => {
      for (let i = 0; i < groupList.length; i++) {
        const group = groupList[i]
        if (group.id === id) continue
        if (new RegExp(group.reg).test(api.path)) {
          return db.queryInTransaction(conn, sql.updateBind, [group.id, api.id])
        }
      }
    }))
    const res = await db.queryInTransaction(conn, sql.delGroup, [id])
    try {
      await db.commit(conn)
      return res
    } catch (e) {
      db.rollback(conn)
      throw e
    }
  }
}
