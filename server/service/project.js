const projectDao = require('../dao/project')

module.exports = {
  async query (userId) {
    return await projectDao.query(userId)
  },
  async add (userId, project = {
    name: '',
    proxyUrl: '',
    desc: ''
  }) {
    return await projectDao.add(userId, project)
  },
  async getById (userId, id) {
    let project = await projectDao.getById(userId, id)
    return project[0]
  }
}
