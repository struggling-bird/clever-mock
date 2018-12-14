import {util} from '../../util'

const actions = {
  demo: {
    queryData: ''
  },
  user: {
    login: '',
    logout: '',
    getUser: '',
    addUser: '',
    update: ''
  },
  project: {
    query: '',
    getById: '',
    create: '',
    del: '',
    queryProxyServer: '',
    update: ''
  },
  api: {
    queryGroup: '',
    addGroup: '',
    updateGroup: '',
    delGroup: '',
    getById: '',
    update: '',
    add: '',
    del: '',
    updateList: ''
  }
}

util.initializeConstants(actions, 'action')
export default actions
