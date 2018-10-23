import {util} from '../../util'

const actions = {
  demo: {
    queryData: ''
  },
  user: {
    login: '',
    getUser: ''
  },
  project: {
    query: '',
    getById: ''
  }
}

util.initializeConstants(actions, 'action')
export default actions
