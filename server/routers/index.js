const router = require('koa-router')()
const demo = require('./demo')

router.use('/demo', demo)

module.exports = router.routes()