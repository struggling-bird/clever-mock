const router = require('express').Router()
const groupService = require('../service/apiGroup')
const constants = require('./constants')

router.post('/list', (req, res) => {
  groupService.queryByProjectId(req.body.projectId).then(list => {
    res.json({
      code: constants.code.success,
      data: list
    })
  }).catch(err => {
    console.error('查询api分组失败', err)
    res.json({
      code: constants.code.error,
      msg: '查询api分组失败'
    })
  })
})

router.post('/add', (req, res) => {
  groupService.addGroup(req.body).then(group => {
    res.json({
      code: constants.code.success,
      data: group
    })
  }).catch(err => {
    console.error('添加分组失败', err)
    res.json({
      code: constants.code.error,
      msg: '添加分组失败'
    })
  })
})

module.exports = router
