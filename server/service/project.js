const project = require('../dao/project')

module.exports = {
  async query (userId) {
    return await project.query(userId)
  }
}
