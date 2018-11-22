const router = require('express').Router()
const user = require('./user')
const project = require('./project')
const apiGroup = require('./apiGroup')
const proxyServer = require('./proxyServer')
const apiService = require('../service/api')
const constant = require('./constants')

router.use(require('../middleware/auth'))

router.use('/user', user)
router.use('/project', project)
router.use('/apiGroup', apiGroup)
router.use('/proxy', proxyServer)

router.post('/add', (req, res) => {
  apiService.add(req.body.api, req.body.projectId, req.session.currentUser.id).then(api => {
    res.json({
      code: constant.code.success,
      data: api
    })
  }).catch(err => {
    res.json({
      code: constant.code.error,
      msg: '添加API失败'
    })
    console.error('添加API失败', err)
  })
})

router.get('/:id', (req, res) => {
  const user = req.session.currentUser
  apiService.getById(req.params.id, user.id).then(api => {
    res.json({
      code: constant.code.success,
      data: api
    })
  }).catch(err => {
    console.error('查询API数据失败', err)
    res.json({
      code: constant.code.error,
      msg: '查询api数据失败'
    })
  })
})

router.post('/update', (req, res) => {
  const user = req.session.currentUser
  apiService.update(user.id, req.body).then(() => {
    res.json({
      code: constant.code.success
    })
  }).catch(err => {
    console.error('更新api失败', err)
    res.json({
      code: constant.code.error,
      msg: '更新api失败'
    })
  })
})
router.delete('/del/:id', (req, res) => {
  const user = req.session.currentUser
  apiService.delById(req.params.id, user.id).then(() => {
    res.json({
      code: constant.code.success
    })
  }).catch(err => {
    res.json({
      code: constant.code.error,
      msg: '删除API失败'
    })
    console.error('删除API失败', err)
  })
})
module.exports = router
