const router = require('express').Router()
const constants = require('./constants')
const projectService = require('../service/project')

router.post('/query', (req, res) => {
  projectService.query(req.session.currentUser.id).then(list => {
    res.json({
      code: constants.code.success,
      data: list
    })
  }).catch(err => {
    console.error('查询项目列表失败', err)
    res.json({
      code: constants.code.error,
      msg: '查询项目列表失败'
    })
  })
})

router.post('/add', (req, res) => {
  let userId = req.session.currentUser.id
  projectService.add(userId, req.body).then(id => {
    res.json({
      code: constants.code.success,
      data: {
        id
      }
    })
  }).catch(err => {
    console.error('创建项目失败', err)
    res.json({
      code: constants.code.error,
      msg: '新建项目失败'
    })
  })
})

router.get('/:id', (req, res) => {
  let userId = req.session.currentUser.id
  projectService.getById(userId, req.params.id).then(project => {
    res.json({
      code: constants.code.success,
      data: project
    })
  }).catch(err => {
    console.error('获取项目信息失败', err)
    res.json({
      code: constants.code.error,
      msg: '获取项目信息失败'
    })
  })
})

router.delete('/del/:id', (req, res) => {
  projectService.delById(req.session.currentUser.id, req.params.id).then(() => {
    res.json({
      code: constants.code.success
    })
  }).catch(err => {
    if (err.message === 'noPermission') {
      res.json({
        code: constants.code.noPermission,
        msg: '权限不足'
      })
    } else {
      res.json({
        code: constants.code.error,
        msg: '删除项目失败'
      })
    }
    console.error('删除项目失败', err)
  })
})

router.post('/update', (req, res) => {
  let project = req.body
  if (!project.id) {
    res.json({
      code: constants.code.error,
      msg: 'project id is null'
    })
  } else {
    projectService.update(project, req.session.currentUser.id).then(project => {
      res.json({
        code: constants.code.success,
        data: project
      })
    }).catch(err => {
      res.json({
        code: constants.code.error,
        msg: '更新项目失败'
      })
      console.error('更新项目失败', err)
    })
  }
})
module.exports = router
