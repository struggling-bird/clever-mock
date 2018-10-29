const apis = {
  demo: {
    queryData: '/data/queryDemoData'
  },
  user: {
    login: '/api/user/login',
    logout: '/api/user/logout',
    getCurrent: '/api/user/getCurrent'
  },
  project: {
    query: '/api/project/query',
    getById: '/api/project/{id}',
    create: '/api/project/add'
  },
  api: {
    queryGroup: '/api/apiGroup/list',
    getById: '/api/{id}'
  }
}

export default apis
