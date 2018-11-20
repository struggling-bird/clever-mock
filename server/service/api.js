const apiDao = require('../dao/api')
const beautify = require('../utils/beautify')
const util = require('../utils/util')
module.exports = {
  async queryByProjectId (projectId) {
    return await apiDao.queryByProjectId(projectId)
  },
  async addLog (param = {
    api, project, callTime, path, resCode, method
  }) {
    return await apiDao.addLog(param)
  },
  async update (userId, api) {
    if (api.params &&  !util.isString(api.params)) api.params = JSON.stringify(api.params)
    return await apiDao.update(userId, api)
  },
  async set (api) {
    if (api.params && !util.isString(api.params)) api.params = JSON.stringify(api.params)
    return await apiDao.set(api)
  },
  async getById (id, userId) {
    let apiList = await apiDao.getById(id, userId)
    if (apiList.length) {
      let api = apiList[0]
      api.mockData = beautify.js(api.mockData)
      api.resStructure = beautify.js(api.resStructure)
      api.params = JSON.parse(api.params)
      api.autoUpdate = Boolean(api.autoUpdate)
      return api
    } else {
      throw new Error('未查到id为' + id + '的api数据')
    }
  }
}
