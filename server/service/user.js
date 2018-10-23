const userDao = require('../dao/user')

module.exports = {
  async login (username, password) {
    const list = await userDao.getUser(username, password)
    return list[0]
  }
}
