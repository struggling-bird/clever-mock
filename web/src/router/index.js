import Vue from 'vue'
import Router from 'vue-router'
import {router} from './constants'

import index from '../modules/index'

Vue.use(Router)
let output = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: router.index,
      component: index,
      children: [
      ]
    }
  ]
})
output.beforeEach((to, from, next) => {
  next()
})
export default output
