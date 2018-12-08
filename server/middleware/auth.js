/**
 * @description 用户登录状态拦截器
 */
const constants = require('../router/constants')
module.exports = function (req, res, next) {
  if (!['/user/login', '/user/add', '/file'].includes(req.path)) {
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
