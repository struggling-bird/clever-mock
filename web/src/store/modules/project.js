import Store from '../Store'
import {actions, mutations, apis} from '../constants'
import {ajax} from '../../util'

let store = new Store({
  state: {
    list: [],
    currentProject: null
  },
  mutations: {
    [mutations.project.setList] (state, list) {
      state.list = list
    },
    [mutations.project.setCurrrent] (state, project) {
      state.currentProject = project
    }
  },
  actions: {
    [actions.project.query] (context) {
      store.setError(context, 'list', false)
      store.setReady(context, 'list', false)
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.project.query
        }).then(res => {
          context.commit(mutations.project.setList, res.data)
          store.setReady(context, 'list', true)
          resolve()
        }).catch(err => {
          store.setReady(context, 'list', true)
          store.setError(context, 'list', true)
          reject(err)
        })
      })
    },
    [actions.project.getById] (context, id) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.project.getById,
          method: 'get',
          data: {
            id: id
          }
        }).then(res => {
          context.commit(mutations.project.setCurrrent, res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
})

export default store
