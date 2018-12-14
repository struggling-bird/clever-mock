const userDao = require('../dao/user')

module.exports = {
  async login (username, password) {
    const user = await userDao.getUser(username, password)
    return user
  },
  async add (user) {
    return await userDao.add(user)
  },
  async getById (userId) {
    return await userDao.getById(userId)
  },
  async update (user) {
    return await userDao.update(user)
  },
  async query (adminId, projectId) {
    return await userDao.query(adminId, projectId)
  },
  async invite (param) {
    return await userDao.invite(param)
  },
  async removeMember (currentUserId, projectId, id) {
    return await userDao.removeMember(currentUserId, projectId, id)
  }
}
