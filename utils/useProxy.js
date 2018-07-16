const HttpProxy = require('http-proxy')
const bodyParser = require('koa-bodyparser')
const config = require('../config')

const proxy = HttpProxy.createProxyServer({
  target: config.target,
  changeOrigin: true,
  secure: false,
  autoRewrite: true,
  ws: true,
  mockConf: {
    autoMockCodes: config.onlyProxy ? [] : config.autoMockCodes
  }
})

proxy.on('open', e => {
  // nothing
})
proxy.on('proxyRes', (proxyRes, req, res) => {
  console.log('start proxy', req.url)
  if (proxyRes && proxyRes.statusCode) {
    if (proxyRes.statusCode < 200 || proxyRes.statusCode >= 300) {
      console.log('!!!!!!!!!!!!!!!:', req.url, '代理错误 >> ERROR CODE:', proxyRes.statusCode)
    }
  }
})

module.exports = (flag = true) => {
  if (config.onlyMock || !flag) {
    return async (ctx, next) => {
      await bodyParser()(ctx, next)
    }
  }
  return async (ctx, next) => {
    var mockFlag = false
    await new Promise((resolve, reject) => {
      proxy.web(ctx.req, ctx.res, e => {
        if (e && e.mockFlag) {
          mockFlag = true
          ctx.request.body =  e.data || {}
        } else {
          console.log('!!!!!!!!!! proxy error >> ', e)
        }
        resolve()
      })
    })
    if (mockFlag) {
      await next()
    }
  }
}
