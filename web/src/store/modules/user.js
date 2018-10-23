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
          method: 'get',
          data: param
        }).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
})

export default store
