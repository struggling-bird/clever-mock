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
    del: ''
  },
  api: {
    setGroupList: '',
    addGroup: '',
    updateGroup: ''
  }
}

util.initializeConstants(mutations, 'mutation')
export default mutations
