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
    setGroupList: ''
  }
}

util.initializeConstants(mutations, 'mutation')
export default mutations
