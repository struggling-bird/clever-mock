const router = require('express').Router()
const proxyService = require('../service/proxyServer')
const constants = require('./constants')

router.get('/:projectId', (req, res) => {
  proxyService.query(req.params.projectId).then(list => {
    res.json({
      code: constants.code.success,
      data: list
    })
  }).catch(err => {
    res.json({
      code: constants.code.error
    })
    console.error('获取代理列表失败', err)
  })
})
module.exports = router
