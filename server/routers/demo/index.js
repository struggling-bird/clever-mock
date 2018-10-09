const router = require('koa-router')()

const paths = ['/a', '/b']
paths.forEach(path => {
  router.get(path, (ctx, next) => {
    ctx.body = 'this is ' + path
  })
})

module.exports = router.routes()