const router = require('express').Router()
const user = require('./user')
const project = require('./project')
const apiGroup = require('./apiGroup')

router.use(require('../middleware/auth'))

router.use('/user', user)
router.use('/project', project)
router.use('/apiGroup', apiGroup)

module.exports = router
