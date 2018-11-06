const db = require('./pool')

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
  }
}
