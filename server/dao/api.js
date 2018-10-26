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
      addApi: 'insert into ' +
        'api(id, path, method, create_time, ' +
        'last_call_time, project_id, mock_data, ' +
        'run_style, proxy_url, auto_update) values(?,?,?,?,?,?,?,?,?,?)',
      addLog: 'insert into call_history(api_id, call_time, duration, url, res_code) values(?,?,?,?,?)'
    }
    let connection = null
    db.beginTransaction().then(async conn => {
      connection = conn
      if (!param.api) {
        await db.queryInTransaction(connection, sql.addApi,
          [apiId, param.path, param.method, currentTime, param.callTime, param.project.id,
            param.resData, 'proxy', param.project.proxyUrl, 0])
      }
      await db.queryInTransaction(connection, sql.addLog, [apiId, param.callTime, duration, param.path, param.resCode])
      db.commit(connection)
    }).catch(err => {
      console.error('add api call history error', err)
      db.rollback(connection)
    })
  },
  update (api) {
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
    db.query(sql, params)
  }
}
