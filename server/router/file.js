const router = require('express').Router()
const axios = require('axios')

router.get('/', (req, res) => {
  const url = req.query.url
  if (!url) {
    res.send('缺少url参数')
  } else {
    axios({
      url,
      method: 'get'
    }).then(res_ => {
      // for (let key in res_.headers) {
      //   res.append(key, res_.headers[key])
      // }
      res.append('content-type', res_.headers['content-type'])
      res.send(res_.data)
    }).catch(err => {
      res.send(err.message)
    })
  }
})

module.exports = router
