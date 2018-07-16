/**
 * Created by yqdong on 2018/6/8.
 * @author yqdong
 *
 */
const koaRouter = require('koa-router')
const {useProxy} = require('../utils')

module.exports = function () {
  let router = koaRouter()
  router.all('/***', useProxy(), async(ctx) => {
    ctx.body = 'empty'
  })
  return router.routes()
}
