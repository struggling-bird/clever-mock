const config = require('./config')
const app = require('express')()
const bodyParser = require('body-parser')
const session = require('express-session')
require('./dao/pool')

app.use(session({
  name: 'cleverMock',
  secret: 'cleverMock',
  // store:
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  }
}))
app.use(require('./middleware/proxyMock'))
const api = require('./router/api')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // parsing application/x-www-form-urlencoded

// todo 更新查询参数
app.use('/api', api)

app.listen(config.port, () => {
  console.log(`server listening on localhost:${config.port}`)
})
