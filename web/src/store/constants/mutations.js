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
    setCurrrent: ''
  },
  api: {
    setGroupList: '',
    addGroup: ''
  }
}

util.initializeConstants(mutations, 'mutation')
export default mutations
