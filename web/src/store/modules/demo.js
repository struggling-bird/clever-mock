/**
 * Created by yqdong on 2018/3/18.
 * qq: 1013501639
 * @author yqdong
 *
 */
import {mutations, actions, apis, getters} from '../constants'
import {ajax} from '../../util'
import Store from '../Store'

let store = new Store({
  state: {
    dataStore: []
  },
  mutations: {
    [mutations.demo.update] (state, list) {
      state.dataStore = list
    }
  },
  getters: {
    [getters.demo.getFirst] (state) {
      return state.dataStore[0]
    }
  },
  actions: {
    [actions.demo.queryData] (context, param) {
      return new Promise((resolve, reject) => {
        ajax({
          url: apis.demo.queryData,
          data: param
        }).then(res => {
          context.commit(mutations.demo.update, res)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
})
export default store
