const groupDao = require('../dao/apiGroup')

module.exports = {
  async queryByProjectId (projectId) {
    return await groupDao.queryByProjectId(projectId)
  },
  async addGroup (group) {
    return await groupDao.addGroup(group)
  },
  async update (group) {
    return await groupDao.update(group)
  },
  async del (groupId, projectId) {
    return await groupDao.del(groupId, projectId)
  }
}
