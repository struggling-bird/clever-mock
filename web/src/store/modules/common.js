import Store from '../Store'
// import {actions, mutations, apis} from '../constants'
// import {ajax} from '../../util'

let store = new Store({
  state: {
    methodList: ['GET', 'POST', 'DELETE', 'PUT'].map(name => {
      return {name: name}
    }),
    runTypeList: ['staticMock', 'scriptMock', 'proxy', 'auto', 'test'].map(type => {
      return {name: type}
    }),
    fieldType: ['String', 'Number', 'Boolean', 'Object', 'Array'].map(type => {
      return {name: type}
    })
  },
  mutations: {
  },
  actions: {
  }
})

export default store
