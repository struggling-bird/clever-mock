const httpProxy = require('http-proxy')
const projectService = require('../service/project')
const apiService = require('../service/api')
const apiGroupService = require('../service/apiGroup')

const proxy = async function (req, res, proxyConfig) {
  let proxyServer = httpProxy.createProxyServer(proxyConfig)
  
  return new Promise((resolve, reject) => {
    proxyServer.on('proxyRes', function (proxyRes, req, res) { // 代理完成
      let data = ''
      proxyRes.on('data', function (chunck) {
        data += chunck
      })
      proxyRes.on('end', function () {
        console.log(data)
      })
      resolve({
        code: res.statusCode,
        data
      })
    })
    // proxyServer.on('open', e => {
    //   console.log('>>>>open proxy')
    // })
    proxyServer.on('error', e => {
      reject(e)
    })
    // proxyServer.on('close', e => {
    //   console.log('>>>>proxy closed')
    // })
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
        proxy(req, res, proxyConfig).then(resCode => {
          // 代理结束 记录请求日志
          apiService.addLog({
            api: matchApi,
            project,
            callTime,
            path,
            resCode
          })
        })
        if (proxyConfig.autoUpdate) {
          apiService.update({
            id: matchApi.id,
            params: JSON.stringify({
            
            }),
            mockData: JSON.stringify({
            
            })
          })
        }
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
