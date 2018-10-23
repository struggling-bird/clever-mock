const router = require('express').Router()
const userService = require('../service/user')
const constants = require('./constants')

router.post('/login', (req, res) => {
  userService.login(req.body.username, req.body.password).then(user => {
    if (user) {
      req.session.currentUser = user
      res.json({
        code: constants.code.success,
        data: user
      })
    } else {
      res.json({
        code: constants.code.error,
        msg: '用户名或密码错误'
      })
    }
    
  })
})

router.get('/getCurrent', (req, res) => {
  res.json({
    code: constants.code.success,
    data: req.session.currentUser
  })
})

module.exports = router