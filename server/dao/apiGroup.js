const db = require('./pool')

module.exports = {
  queryByProjectId (projectId) {
    const sql = 'select g.* from apigroup as g where g.project_id = ?'
    return db.query(sql, [projectId])
  }
}
