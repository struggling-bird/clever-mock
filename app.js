const app = new(require('koa'))
const router = require('koa-router')()
const routes = require('./routes/index')

const {port, target} = require('./config')

router.use(routes)

app
  .use(router.routes())
  .use(router.allowedMethods())

//启动端口监听
app.listen(port, () => {
  console.log('mock server start at port: http://localhost:' + port)
  console.log('mock server proxy to >> ' + target)
})
