import Store from '../Store'
import {actions, mutations, apis} from '../constants'
import {ajax} from '../../util'

let store = new Store({
  state: {
    user: null
  },
  mutations: {
    [mutations.user.setUser] (state, user) {
      state.user = user
    }
  },
  actions: {
    [actions.user.login] (context, param = {
      username: '',
      password: ''
    }) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.user.login,
          data: param
        }).then(res => {
          context.commit(mutations.user.setUser, res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    [actions.user.logout] (context) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.user.logout,
          method: 'get'
        }).then(() => {
          context.commit(mutations.user.setUser, null)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.user.getUser] (context) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.user.getCurrent,
          method: 'get'
        }).then(res => {
          context.commit(mutations.user.setUser, res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
})

export default store
