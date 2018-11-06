const router = require('express').Router()
const user = require('./user')
const project = require('./project')
const apiGroup = require('./apiGroup')
const apiService = require('../service/api')
const constant = require('./constants')

router.use(require('../middleware/auth'))

router.use('/user', user)
router.use('/project', project)
router.use('/apiGroup', apiGroup)

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
module.exports = router
