const webpack = require('webpack')
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
    plugins: [
      new webpack.DefinePlugin((() => {
        if (process.env.NODE_ENV === 'production') {
          return {
            API_BASE_URL: JSON.stringify('http://192.168.131.193:8080/')
          }
        } else {
          return {
            API_BASE_URL: JSON.stringify('http://192.168.131.193:8080/')
          }
        }
      })())
    ]
  }
}
