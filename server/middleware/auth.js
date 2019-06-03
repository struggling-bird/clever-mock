/**
 * @description 用户登录状态拦截器
 */
const constants = require('../router/constants')
module.exports = function (req, res, next) {
  if (!['/user/login', '/user/add', '/file'].includes(req.path)) {
    // 检查登录状态
    // todo 接口文档开放完成后，去掉该规则
    if (/(api\/project)|(apiGroup\/list)/.test(req.path)) {
      next()
      return
    }
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
