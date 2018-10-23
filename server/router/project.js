const router = require('express').Router()
const constants = require('./constants')
const projectService = require('../service/project')

router.post('/query', (req, res) => {
  projectService.query(req.session.currentUser.id).then(list => {
    res.json({
      code: constants.code.success,
      data: list
    })
  }).catch(() => {
    res.json({
      code: constants.code.error,
      msg: '查询项目列表失败'
    })
  })
})
module.exports = router
