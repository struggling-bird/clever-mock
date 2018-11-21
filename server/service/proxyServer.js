const proxyDao = require('../dao/proxyServer')

module.exports = {
  async query (projectId) {
    return await proxyDao.queryByProjectId(projectId)
  }
}
