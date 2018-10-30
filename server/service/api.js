const apiDao = require('../dao/api')
const beautify = require('../utils/beautify')
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
    let apiList = await apiDao.getById(id, userId)
    if (apiList.length) {
      let api = apiList[0]
      api.mockData = beautify.js(api.mockData)
      return api
    } else {
      throw new Error('未查到id为' + id + '的api数据')
    }
  }
}
