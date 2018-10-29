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
  },
  async getById (id, userId) {
    let list = await apiDao.getById(id, userId)
    if (list.length) {
      return list[0]
    } else {
      throw new Error('未查到id为' + id + '的api数据')
    }
  }
}
