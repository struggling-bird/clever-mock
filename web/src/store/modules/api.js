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
    },
    [mutations.api.addGroup] (state, group) {
      state.groupList.push(group)
    }
  },
  actions: {
    [actions.api.queryGroup] (context, projectId) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.queryGroup,
          data: {
            projectId
          }
        }).then(res => {
          context.commit(mutations.api.setGroupList, res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.api.getById] (context, id) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.getById,
          method: 'get',
          data: {
            id
          }
        }).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.api.update] (context, api) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.update,
          data: api
        }).then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.api.addGroup] (context, group) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.addGroup,
          data: group
        }).then(res => {
          context.commit(mutations.api.addGroup, res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
})

export default store
