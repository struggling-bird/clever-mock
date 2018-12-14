import Store from '../Store'
import {actions, mutations, apis} from '../constants'
import {ajax} from '../../util'

let store = new Store({
  state: {
    user: null,
    memberList: []
  },
  mutations: {
    [mutations.user.setUser] (state, user) {
      state.user = user
    },
    [mutations.user.update] (state, user) {
      state.user = user
    },
    [mutations.user.setList] (state, list) {
      state.memberList = list
    },
    [mutations.user.addMember] (state, user) {
      state.memberList.push(user)
    },
    [mutations.user.removeMember] (state, userId) {
      state.memberList.forEach((member, i) => {
        if (member.id === userId) {
          state.memberList.splice(i, 1)
        }
      })
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
    },
    [actions.user.addUser] (context, user) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.user.add,
          data: user
        }).then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.user.update] (context, user) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.user.update,
          data: user
        }).then(res => {
          context.commit(mutations.user.update, res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.user.query] (context, projectId) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.user.query,
          data: {
            projectId
          }
        }).then(res => {
          context.commit(mutations.user.setList, res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.user.invite] (context, param) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.user.invite,
          data: param
        }).then(res => {
          context.commit(mutations.user.addMember, res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    [actions.user.removeMember] (context, param) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.user.removeMember,
          data: param
        }).then(res => {
          context.commit(mutations.user.removeMember, param.userId)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
})

export default store
