import {util} from '../../util'

const mutations = {
  demo: {
    update: ''
  },
  user: {
    setUser: ''
  },
  project: {
    setList: '',
    setCurrrent: '',
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
