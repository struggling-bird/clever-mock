const config = require('./config')
const bodyParser = require('body-parser')
const session = require('express-session')
const express = require('express')
const app = express()
const path = require('path')
const history = require('connect-history-api-fallback')
const util = require('./utils/util')
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  path: '/socket'
})
const socketClient = require('socket.io-client')
require('./dao/pool')

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', req.method)//设置方法
  if (req.method == 'OPTIONS') {
    console.log('got options request: ', util.getHost(req))
    res.send(204) // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
  } else {
    next()
  }
})
io.on('connection', (socket) => {
  const onevent = socket.onevent
  socket.onevent = function (packet) {
    let args = packet.data || []
    onevent.call(this, packet)
    packet.data = ['*'].concat(args)
    onevent.call(this, packet)
  }
  const client = socketClient('ws://54.222.232.87:3000', {
    path: '/socket',
    forceNew: true,
    query: {
      appKey: '5f8a935cd15a47419df0e07d0547551b',
      role: 'sdk'
    }
  })
  socket.on('*', (event, data) => {
    client.emit(event, data)
  })
})
app.use(session(config.session))
app.use(require('./middleware/sys'))
const api = require('./router/api')

app.use(bodyParser.json({
  limit: '100mb'
})) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // parsing application/x-www-form-urlencoded

app.use('/api', api)
app.use(history({
}))
app.use(express.static(path.resolve(__dirname, 'static')))
http.listen(config.port, () => {
  console.log(`server listening on localhost:${config.port}`)
})
