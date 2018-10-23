const router = require('express').Router()
const user = require('./user')
const project = require('./project')

router.use(require('../middleware/auth'))

router.use('/user', user)
router.use('/project', project)

module.exports = router
