const apis = {
  demo: {
    queryData: '/data/queryDemoData'
  },
  user: {
    login: '/api/user/login',
    logout: '/api/user/logout',
    getCurrent: '/api/user/getCurrent',
    add: '/api/user/add',
    update: '/api/user/update',
    query: '/api/user/query',
    invite: '/api/user/invite',
    removeMember: '/api/user/removeMember'
  },
  project: {
    query: '/api/project/query',
    getById: '/api/project/{id}',
    create: '/api/project/add',
    del: '/api/project/del/{id}',
    queryProxyServer: '/api/proxy/{projectId}',
    update: '/api/project/update'
  },
  api: {
    queryGroup: '/api/apiGroup/list',
    getById: '/api/{id}',
    update: '/api/update',
    addGroup: '/api/apiGroup/add',
    updateGroup: '/api/apiGroup/update',
    deleteGroup: '/api/apiGroup/delete/{id}/{projectId}',
    del: '/api/del/{id}',
    add: '/api/add',
    updateList: '/api/update/list'
  }
}

export default apis
