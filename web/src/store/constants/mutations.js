import {util} from '../../util'

const mutations = {
  demo: {
    update: ''
  },
  user: {
    setUser: '',
    update: '',
    setList: '',
    addMember: '',
    removeMember: ''
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
