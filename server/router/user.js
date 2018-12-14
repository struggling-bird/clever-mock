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

router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.json({
        code: constants.code.error,
        msg: '退出账号失败'
      })
      console.error('退出账号失败', err)
    } else {
      res.json({
        code: constants.code.success
      })
    }
  })
})

router.get('/getCurrent', (req, res) => {
  userService.getById(req.session.currentUser.id).then(user => {
    res.json({
      code: constants.code.success,
      data: user
    })
  }).catch(err => {
    res.json({
      code: constants.code.error,
      msg: '获取用户信息失败'
    })
    console.error('获取用户信息失败', err)
  })
})

router.post('/add', (req, res) => {
  userService.add(req.body).then(user => {
    res.json({
      code: constants.code.success,
      data: user
    })
  }).catch(err => {
    console.error('添加用户失败', err)
    res.json({
      code: constants.code.error,
      msg: '添加用户失败'
    })
  })
})

router.post('/update', (req, res) => {
  userService.update(req.body).then(user => {
    res.json({
      code: constants.code.success,
      data: user
    })
  }).catch(err => {
    res.json({
      code: constants.code.error,
      msg: '更新用户信息失败'
    })
  })
})
module.exports = router
