const config = require('./config')
const app = require('express')()
const bodyParser = require('body-parser')
const session = require('express-session')
const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const cors = require('cors')
require('./dao/pool')

app.use(cors())
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
