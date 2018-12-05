const db = require('./dao/pool')
const util = require('./utils/util')
const beautify = require('./utils/beautify')

let loop = function (inpu) {
  let objectType = util.getType(inpu)
  let res = {
    name: null,
    type: objectType,
    value: null,
    required: false,
    desc: '',
    children: []
  }
  if (objectType === 'Object') {
    for (let prop in inpu) {
      let val = inpu[prop]
      let config = loop(val)
      config.name = prop
      if (['Number', 'String', 'Boolean'].includes(util.getType(val))) {
        config.value = val
      }
      res.children.push(config)
    }
  } else if (objectType === 'Array') {
    res.children.push(loop(inpu[0]))
  } else {
    res.value = inpu
  }
  return res
}
/**
 * {
 *   name: 'propA',
 *   type: 'String',
 *   value: 'aaa',
 *   required: false,
 *   desc: 'this is propA',
 *   children: []
 * }
 */
db.query('select * from api').then(async apiList => {
  const conn = await db.beginTransaction()
  let list = apiList.map(api => {
    const newStructure = JSON.stringify(loop(JSON.parse(api.resStructure)))
    let sql = 'update api set res_structure = ? where id = ?'
    return db.queryInTransaction(conn, sql, [newStructure, api.id])
  })
  Promise.all(list).then(async () => {
    await db.commit(conn)
  }).catch(async err => {
    await db.rollback(conn)
  })
})
