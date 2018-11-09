import {util} from '../../util'

const actions = {
  demo: {
    queryData: ''
  },
  user: {
    login: '',
    logout: '',
    getUser: ''
  },
  project: {
    query: '',
    getById: '',
    create: ''
  },
  api: {
    queryGroup: '',
    addGroup: '',
    getById: '',
    update: ''
  }
}

util.initializeConstants(actions, 'action')
export default actions
