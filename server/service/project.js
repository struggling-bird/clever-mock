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
  }
}
