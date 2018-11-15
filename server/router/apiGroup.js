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

router.post('/update', (req, res) => {
  groupService.update(req.body).then(() => {
    res.json({
      code: constants.code.success
    })
  }).catch(err => {
    console.error('更新分组失败', err)
    res.json({
      code: constants.code.error,
      msg: '更新分组失败'
    })
  })
})

router.delete('/delete/:groupId/:projectId', (req, res) => {
  groupService.del(req.params.groupId, req.params.projectId).then(() => {
    res.json({
      code: constants.code.success
    })
  }).catch(err => {
    console.error('删除分组失败', err)
    res.json({
      code: constants.code.error,
      msg: '删除分组失败'
    })
  })
})

module.exports = router
