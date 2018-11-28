const mimeTypes = require('./mimeTypes')
const proxy = require('./proxyMock')
const util = require('../utils/util')

module.exports = function (req, res, next) {
  const methodName = req.method
  const path = req.url
  const host = util.getHost(req)
  console.log('got request: ', host, path, methodName)
  let isStatic = false
  mimeTypes.static.forEach(type => {
    if (new RegExp(type).test(req.headers.accept)) {
      isStatic = true
    }
  })
  if (isStatic || /\.js(\.map)?$/.test(path)) { // 静态资源请求
    console.log('request is static')
    next()
  } else {
    console.log('try to proxy request')
    proxy(req, res, next)
  }
}
