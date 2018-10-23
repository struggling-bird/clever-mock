/**
 * @description 用户登录状态拦截器
 */
const constants = require('../router/constants')
module.exports = function (req, res, next) {
  if (req.path !== '/user/login') {
    // 检查登录状态
    if (!req.session.currentUser) {
      res.json({
        code: constants.code.notLogin,
        msg: '用户未登录'
      })
      return
    }
  }
  next()
}