const db = require('./pool')
const uuid = require('uuid/v1')
const util = require('../utils/util')

module.exports = {
  queryByProjectId (projectId) {
    let sql = 'select a.* from api as a where a.project_id = ?'
    return db.query(sql, [projectId])
  },
  async add (api, projectId, userId) {
    const conn = await db.beginTransaction()
    
    // 1. 查询所有的API分组
    let sql = 'select * from apigroup where project_id = ?'
    const groupList = await db.queryInTransaction(conn, sql, [projectId])
    // 2. 为api关联分组
    let matchGroup = null
    for (let i = 0; i < groupList.length; i++) {
      const group = groupList[i]
      if (new RegExp(group.reg).test(api.path)) {
        matchGroup = group
      }
    }
    // 3. 添加api
    let props = []
    let codes = []
    let values = []
    let apiId = uuid()
    api.id = apiId
    api.projectId = projectId
    api.createTime = new Date().getTime()
    api.groupId = matchGroup.id
    for (const prop in api) {
      props.push(util.toUnderLine(prop))
      codes.push('?')
      values.push(api[prop])
    }
    sql = `insert into api(${props.join(',')}) values(${codes.join(',')})`
    await db.queryInTransaction(conn, sql, values)
    try {
      await db.commit(conn)
    } catch (e) {
      db.rollback(conn)
      throw e
    }
    return await db.query('select * from api where id = ?', [apiId])
  },
  async addLog (param = {
    api, project, callTime, path, resCode, method
  }) {
    const currentTime = new Date().getTime()
    const duration = currentTime - param.callTime
    let apiId = param.api ? param.api.id : uuid()
    const sql = {
      queryGroup: 'select * from apigroup where project_id = ?',
      addApi: 'insert into ' +
        'api(id, path, method, create_time, ' +
        'last_call_time, project_id, mock_data, res_structure, ' +
        'run_style, proxy_url, auto_update, group_id) values(?,?,?,?,?,?,?,?,?,?,?,?)',
      addLog: 'insert into call_history(api_id, call_time, duration, url, res_code) values(?,?,?,?,?)'
    }
    let connection = await db.beginTransaction()
    if (!param.api) {
      let groupList = await db.queryInTransaction(connection, sql.queryGroup, [param.project.id])
      let matchGroup = null
      groupList.forEach(group => {
        if (new RegExp(group.reg).test(param.path)) {
          matchGroup = group
        }
      })
      await db.queryInTransaction(connection, sql.addApi,
        [apiId, param.path, param.method, currentTime, param.callTime, param.project.id,
          param.resData,JSON.stringify(util.getStructure(util.getSimpleData(JSON.parse(param.resData)))), 'proxy', param.project.proxyUrl, 0, matchGroup ? matchGroup.id : null])
    }
    await db.queryInTransaction(connection, sql.addLog, [apiId, param.callTime, duration, param.path, param.resCode])
    try {
      await db.commit(connection)
    } catch (e) {
      db.rollback(connection)
      throw e
    }
  },
  async update (userId, api) {
    const haveProject = await db.query('select count(*) as count from user_project as up where up.user_id = ? and up.project_id = ?', [userId, api.projectId])
    if (haveProject[0].count > 0) {
      return await this.set(api)
    } else {
      throw new Error('要修改的接口不存在或权限不足')
    }
  },
  async set (api) {
    let props = []
    let params = []
    for (let prop in api) {
      if (prop !== 'id') {
        props.push(`${util.toUnderLine(prop)} = ?`)
        params.push(api[prop])
      }
    }
    params.push(api.id)
    const sql = `update api set ${props.join(',')} where api.id = ?`
    const res = await db.query(sql, params)
    // 如果更新内容有proxyUrl，则要检查该代理地址是否被保存，没被保存的话进行存储
    if (api.proxyUrl) {
      let _ = await db.query('select * from api where id = ?', [api.id])
      const projectId = _[0].projectId
      let proxy = await db.query('select * from proxy_server where project_id = ? and url = ?', [projectId, api.proxyUrl])
      if (!proxy.length) {
        db.query('insert into proxy_server(id,url, project_id) values(?,?,?)', [uuid(), api.proxyUrl, projectId])
      }
    }
    return res
  },
  async getById (id, userId) {
    const sql = 'select a.* from api as a ' +
      'left join user_project as up on up.project_id = a.project_id ' +
      'where a.id = ? and up.user_id = ?'
    return await db.query(sql, [id, userId])
  },
  async delById (id, userId) {
    /**
     * 1.todo 检查当前用户是否拥有API的删除权限
     * 1.删除日志
     * 2.删除API
     */
    const sql = {
      clearLog: 'delete from call_history where api_id = ?',
      delApi: 'delete from api where id = ?'
    }
    const conn = await db.beginTransaction()
    await db.queryInTransaction(conn, sql.clearLog, [id])
    await db.queryInTransaction(conn, sql.delApi, [id])
    try {
      return await db.commit(conn)
    } catch (e) {
      db.rollback(conn)
      throw e
    }
  },
  async updateList (api, userId) {
    // step1.检查是否有更新权限
    let sql = 'select a.* from api as a ' +
      'left join user_project as up ' +
      ' on a.project_id = up.project_id ' +
      'where up.user_id = ? and up.project_id = ?'
    const res = await db.query(sql, [userId, api.projectId])
    if (!res.length) {
      throw new Error('no permission')
    }
    // step2.更新API
    let props = []
    let vals = []
    for (let prop in api) {
      if (['projectId'].includes(prop)) continue
      props.push(`${util.toUnderLine(prop)}=?`)
      vals.push(api[prop])
    }
    vals.push(api.projectId)
    sql = `update api set ${props.join(',')} where project_id=?`
    return await db.query(sql, vals)
  }
}
