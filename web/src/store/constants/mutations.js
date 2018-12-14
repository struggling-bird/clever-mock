import {util} from '../../util'

const mutations = {
  demo: {
    update: ''
  },
  user: {
    setUser: '',
    update: ''
  },
  project: {
    setList: '',
    setCurrent: '',
    del: '',
    setProxyServerList: ''
  },
  api: {
    setGroupList: '',
    addGroup: '',
    updateGroup: '',
    del: ''
  }
}

util.initializeConstants(mutations, 'mutation')
export default mutations
