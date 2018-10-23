const userDao = require('../dao/user')

module.exports = {
  async login (username, password) {
    return await userDao.getUser(username, password)
  }
}