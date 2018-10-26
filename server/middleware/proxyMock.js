const httpProxy = require('http-proxy')
const projectService = require('../service/project')
const apiService = require('../service/api')

const proxy = async function (req, res, proxyConfig) {
  let proxyServer = httpProxy.createProxyServer(proxyConfig)
  console.log(proxyConfig)
  return new Promise((resolve, reject) => {
    proxyServer.on('proxyRes', function (proxyRes, req, res) { // 代理完成
      // todo 解决乱码问题
      let arr = []
      let size = 0
      proxyRes.on('data', function (chunk) {
        arr.push(chunk)
        size += chunk.length
      })
      proxyRes.on('end', function () {
        const data = Buffer.concat(arr, size)
        resolve({
          code: res.statusCode,
          data: data.toString()
        })
      })
    })
    proxyServer.on('error', e => {
      reject(e)
    })
    proxyServer.web(req, res, e => {
      reject(e)
    })
  })
}

const handle = async function (req, res, next) {
  // todo 数据做缓存维护，避免高频次操作数据库
  const path = req.url
  const project = await projectService.queryByHost(req.headers.origin)
  if (project) { // 查询是否有匹配项目
    const apiList = await apiService.queryByProjectId(project.id)
    let matchApi = null
    apiList.forEach(api => {
      if (new RegExp(api.path).test(path)) {
        matchApi = api
      }
    })
    let proxyConfig = {
      target: project.proxyUrl,
      changeOrigin: true,
      secure: false,
      autoRewrite: true,
      proxyTimeout: 30 * 60 * 1000,
      timeout: 30 * 60 * 1000
    }
    const callTime = new Date().getTime()
    if (matchApi) { // 如果有匹配的api配置项，则按该配置项代理或mock数据
      if (['proxy', 'auto', 'test'].includes(matchApi.runStyle)) { // 代理请求
        proxyConfig.target = matchApi.proxyUrl
        proxy(req, res, proxyConfig).then(result => {
          // 代理结束 记录请求日志
          apiService.addLog({
            api: matchApi,
            method: req.method,
            project,
            callTime,
            path,
            resCode: result.code,
            resData: result.data
          })
          // 如果api配置为自动更新mock数据
          if (matchApi.autoUpdate) {
            apiService.update({
              id: matchApi.id,
              mockData: result.data
            })
          }
        })
      } else {
        switch (matchApi.runStyle) {
          case 'staticMock':
            res.json(JSON.parse(matchApi.mockData))
            break
          case 'scriptMock':
            // todo scriptMock
            break
        }
      }
    } else { // 没有匹配的api配置项，则直接开始代理
      proxy(req, res, proxyConfig).then(result => {
        apiService.addLog({
          method: req.method,
          project,
          callTime,
          path,
          resCode: result.code,
          resData: result.data
        })
      })
    }
  } else {
    next()
  }
}

module.exports = function (req, res, next) {
  const methodName = req.method
  const path = req.url
  const host = req.headers.origin
  console.log('got request: ', host, path, methodName)
  if (/api/.test(path)) { // 如果不是平台内部请求
    next()
  } else {
    handle(req, res, next)
  }
}
