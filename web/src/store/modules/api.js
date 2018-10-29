import Store from '../Store'
import {actions, mutations, apis} from '../constants'
import {ajax} from '../../util'

let store = new Store({
  state: {
    groupList: []
  },
  mutations: {
    [mutations.api.setGroupList] (state, list) {
      state.groupList = list
    }
  },
  actions: {
    [actions.api.queryGroup] (context, param = {
      projectId: ''
    }) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.queryGroup,
          data: param
        }).then(res => {
          context.commit(mutations.api.setGroupList, res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
})

export default store
