const db = require('./pool')
const uuid = require('uuid/v1')
const util = require('../utils/util')

module.exports = {
  queryByProjectId (projectId) {
    let sql = 'select a.* from api as a where a.project_id = ?'
    return db.query(sql, [projectId])
  },
  addLog (param = {
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
    let connection = null
    db.beginTransaction().then(async conn => {
      connection = conn
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
            param.resData,JSON.stringify(util.getStructure(JSON.parse(param.resData))), 'proxy', param.project.proxyUrl, 0, matchGroup ? matchGroup.id : null])
      }
      await db.queryInTransaction(connection, sql.addLog, [apiId, param.callTime, duration, param.path, param.resCode])
      db.commit(connection)
    }).catch(err => {
      console.error('add api call history error', err)
      db.rollback(connection)
    })
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
    return await db.query(sql, params)
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
  }
}
