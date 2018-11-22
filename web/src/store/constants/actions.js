import {util} from '../../util'

const actions = {
  demo: {
    queryData: ''
  },
  user: {
    login: '',
    logout: '',
    getUser: '',
    addUser: ''
  },
  project: {
    query: '',
    getById: '',
    create: '',
    del: '',
    queryProxyServer: ''
  },
  api: {
    queryGroup: '',
    addGroup: '',
    updateGroup: '',
    delGroup: '',
    getById: '',
    update: '',
    add: '',
    del: ''
  }
}

util.initializeConstants(actions, 'action')
export default actions
