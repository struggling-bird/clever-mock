const router = require('koa-router')()

const proxy = require('./proxy')

router.use('/*', proxy())

module.exports = router.routes()
