const apiDao = require('../dao/api')

module.exports = {
  async queryByProjectId (projectId) {
    return await apiDao.queryByProjectId(projectId)
  },
  async addLog (param = {
    api, project, callTime, path, resCode, method
  }) {
    return await apiDao.addLog(param)
  },
  async update (api) {
    return await apiDao.update(api)
  }
}
