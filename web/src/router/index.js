import Vue from 'vue'
import Router from 'vue-router'
import {router} from './constants'

import index from '../modules/index'
import projectCreate from '../modules/project/create'
import projectManage from '../modules/project/manage'
import login from '../modules/login/index'
import console from '../modules/console'
import devView from '../modules/console/devView'
import docView from '../modules/console/docView'

Vue.use(Router)
let output = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: router.index,
      component: index,
      redirect: {
        name: router.project.manage
      },
      children: [
        {
          path: 'login',
          name: router.login,
          component: login
        },
        {
          path: 'project/manage',
          name: router.project.manage,
          component: projectManage
        },
        {
          path: 'project/create',
          name: router.project.create,
          component: projectCreate
        },
        {
          path: 'console/:id',
          name: router.console.index,
          component: console,
          redirect: {
            name: router.console.devView
          },
          children: [
            {
              path: 'dev',
              name: router.console.devView,
              component: devView
            },
            {
              path: 'doc',
              name: router.console.docView,
              component: docView
            }
          ]
        }
      ]
    }
  ]
})
output.beforeEach((to, from, next) => {
  next()
})
export default output
