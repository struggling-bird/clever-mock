const router = require('express').Router()
const user = require('./user')

router.use(require('../middleware/auth'))

router.use('/user', user)

module.exports = router