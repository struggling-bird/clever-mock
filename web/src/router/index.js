import Vue from 'vue'
import Router from 'vue-router'
import {router} from './constants'

import index from '../modules/index'
import projectCreate from '../modules/project/create'
import projectDetail from '../modules/project/index'
import projectManage from '../modules/project/manage'
import login from '../modules/login/index'

Vue.use(Router)
let output = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: router.index,
      component: index,
      children: [
        {
          path: 'project/manage',
          name: router.project.manage,
          component: projectManage
        },
        {
          path: 'project/detail/:id',
          name: router.project.detail,
          component: projectDetail
        },
        {
          path: 'project/create',
          name: router.project.create,
          component: projectCreate
        },
        {
          path: 'login',
          name: router.login,
          component: login
        }
      ]
    }
  ]
})
output.beforeEach((to, from, next) => {
  next()
})
export default output
