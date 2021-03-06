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
    },
    [mutations.api.updateGroup] (state, group) {
      state.groupList.forEach(item => {
        if (item.id === group.id) {
          item = group
        }
      })
    },
    [mutations.api.del] (state, id) {
      state.groupList.forEach(group => {
        group.apiList.forEach((api, i) => {
          if (api.id === id) {
            group.apiList.splice(i, 1)
          }
        })
      })
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
    },
    [actions.api.updateGroup] (context, group) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.updateGroup,
          data: group
        }).then(() => {
          context.commit(mutations.api.updateGroup, group)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.api.delGroup] (context, param = {
      id: '',
      projectId: ''
    }) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.deleteGroup,
          data: param,
          method: 'delete'
        }).then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.api.del] (context, id) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.del,
          method: 'delete',
          data: {
            id
          }
        }).then(() => {
          context.commit(mutations.api.del, id)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.api.add] (context, param) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.add,
          data: param
        }).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.api.updateList] (context, api) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.api.updateList,
          data: api
        }).then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
})

export default store
