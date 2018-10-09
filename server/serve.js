const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const session = require('koa-session')
const routes = require('./routers')
const path = require('path')
const config = require('./config')

app.use(require('koa-static')(path.resolve(__dirname, '../web/dist'), {
  // 配置
}))

app.use(session(config.session, app))

app.use(routes)

app.use(router.routes())
  .use(router.allowedMethods())

app.listen(config.port, () => {
  console.log('server start at : http://localhost:' + config.port)
})