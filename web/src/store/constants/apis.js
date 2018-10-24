const aips = {
  demo: {
    queryData: '/data/queryDemoData'
  },
  user: {
    login: '/api/user/login',
    getCurrent: '/api/user/getCurrent'
  },
  project: {
    query: '/api/project/query',
    getById: '/api/project/{id}',
    create: '/api/project/add'
  }
}

export default aips
