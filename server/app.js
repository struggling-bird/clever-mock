const config = require('./config')
const app = require('express')()
const bodyParser = require('body-parser')
const session = require('express-session')
const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
require('./dao/pool')

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', req.method)//设置方法
  if (req.method == 'OPTIONS') {
    res.send(200) // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
  } else {
    next()
  }
})
app.use(session(config.session))
app.use(require('./middleware/sys'))
const api = require('./router/api')

app.use(bodyParser.json({
  limit: '100mb'
})) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // parsing application/x-www-form-urlencoded

// todo 更新查询参数
app.use('/api', api)
app.use(history({
}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.listen(config.port, () => {
  console.log(`server listening on localhost:${config.port}`)
})
