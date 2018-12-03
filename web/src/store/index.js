import Vue from 'vue'
import Vuex from 'vuex'

import demo from './modules/demo'
import user from './modules/user'
import project from './modules/project'
import api from './modules/api'
import common from './modules/common'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    demo,
    user,
    project,
    api,
    common
  }
})
