const db = require('./pool')
const uuid = require('uuid/v1')

module.exports = {
  async queryByProjectId (projectId) {
    let sql = 'select g.* from apigroup as g where g.project_id = ?'
    let groupList = await db.query(sql, [projectId])
    
    sql = 'select a.id,a.name,a.path,a.method,a.group_id from api as a where a.project_id = ?'
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
      db.queryInTransaction(conn, `update api set group_id = ? where id in(${code.join(',')})`, [id, ...matchApi])
    }
    db.commit(conn)
    const addedGroup = await db.queryInTransaction(conn, 'select * from apigroup where id = ?', [id])
    return addedGroup[0]
  }
}
