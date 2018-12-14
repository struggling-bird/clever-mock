const router = require('express').Router()
const userService = require('../service/user')
const constants = require('./constants')

router.post('/login', (req, res) => {
  userService.login(req.body.username, req.body.password).then(user => {
    req.session.currentUser = user
    res.json({
      code: constants.code.success,
      data: user
    })
  }).catch(err => {
    res.json({
      code: constants.code.error,
      msg: '用户名或密码错误'
    })
    console.error('登录失败', err)
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

router.post('/query', (req, res) => {
  userService.query(req.session.currentUser.id, req.body.projectId).then(list => {
    res.json({
      code: constants.code.success,
      data: list
    })
  }).catch(err => {
    res.json({
      code: constants.code.error,
      msg: '获取用户列表失败'
    })
    console.log('获取用户列表失败', err)
  })
})

router.post('/invite', (req, res) => {
  userService.invite(req.body).then(user => {
    res.json({
      code: constants.code.success,
      data: user
    })
  }).catch(err => {
    res.json({
      code: constants.code.error,
      msg: '邀请失败'
    })
    console.error('邀请成员失败', err)
  })
})

router.post('/removeMember', (req, res) => {
  userService.removeMember(req.session.currentUser.id, req.body.projectId, req.body.userId).then(() => {
    res.json({
      code: constants.code.success
    })
  }).catch(err => {
    res.json({
      code: constants.code.error,
      msg: '删除成员失败'
    })
    console.error('删除成员失败', err)
  })
})
module.exports = router
