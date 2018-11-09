const groupDao = require('../dao/apiGroup')

module.exports = {
  async queryByProjectId (projectId) {
    return await groupDao.queryByProjectId(projectId)
  },
  async addGroup (group) {
    return await groupDao.addGroup(group)
  }
}
