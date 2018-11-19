const mimeTypes = require('./mimeTypes')
const proxy = require('./proxyMock')
const util = require('../utils/util')
const constants = require('../router/constants')
const fs = require('fs')
const path = require('path')

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
  /**
   * todo 检查系统有没有完成初始化工作，没有的话跳转到初始引导页
   */
  if (isStatic || /\.js(\.map)?$/.test(path)) { // 静态资源请求
    next()
  } else {
    proxy(req, res, next)
  }
}
