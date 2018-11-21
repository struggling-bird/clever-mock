const db = require('./pool')

module.exports = {
  async queryByProjectId (projectId) {
    return await db.query('select * from proxy_server where project_id = ?', [projectId])
  }
}
