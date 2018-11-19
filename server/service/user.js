const userDao = require('../dao/user')

module.exports = {
  async login (username, password) {
    const list = await userDao.getUser(username, password)
    return list[0]
  },
  async add (user) {
    return await userDao.add(user)
  }
}
