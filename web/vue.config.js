// const webpack = require('webpack')
const path = require('path')
let proxy = {}
let routes = ['^/api']
routes.forEach(route => {
  proxy[route] = {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug'
  }
})
module.exports = {
  outputDir: path.resolve(__dirname, '../server/static'),
  devServer: {
    proxy: proxy
  },
  configureWebpack: {
  }
}
