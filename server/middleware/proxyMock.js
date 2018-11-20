const httpProxy = require('http-proxy')
const projectService = require('../service/project')
const apiService = require('../service/api')
const zlib = require('zlib')
const pathToReg = require('path-to-regexp')
const util = require('../utils/util')

const proxy = async function (req, res, proxyConfig) {
  let proxyServer = httpProxy.createProxyServer(proxyConfig)
  console.log('执行代理请求', req.url)
  return new Promise((resolve, reject) => {
    proxyServer.on('proxyRes', function (proxyRes, req, res) { // 代理完成
      let arr = []
      let size = 0
      proxyRes.on('data', function (chunk) {
        arr.push(chunk)
        size += chunk.length
      })
      proxyRes.on('end', function () {
        const data = Buffer.concat(arr, size)
        if (proxyRes.headers['content-encoding'] === 'gzip') { // 解压gzip
          zlib.gunzip(data, function (error, result) {
            if (error) {
              reject(new Error('解压数据失败'))
            } else {
              resolve({
                code: res.statusCode,
                data: result.toString()
              })
            }
          })
        } else {
          resolve({
            code: res.statusCode,
            data: data.toString()
          })
        }
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

const scriptMock = function (req, res, requestParam, mockScript) {
  let result = new Function(
    'params',
    'util',
    'uuid',
    mockScript)(
    requestParam,
    require('../utils/util'),
    require('uuid/v1')
  )
  res.json(result)
}

const handle = async function (req, res, next) {
  // todo 数据做缓存维护，避免高频次操作数据库
  const path = req.url
  const project = await projectService.queryByHost(util.getHost(req))
  if (project) { // 查询是否有匹配项目
    const apiList = await apiService.queryByProjectId(project.id)
    let matchApi = null
    apiList.forEach(api => {
      if (pathToReg(api.path).test(path)) {
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
      if (matchApi.delay) await util.delay(matchApi.delay * 1000)
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
            apiService.set({
              id: matchApi.id,
              mockData: result.data
            })
          }
        }).catch(err => {
          console.error('代理请求失败', req.url, err)
          if (matchApi.runStyle === 'auto' && matchApi.mockData) {
            res.json(JSON.parse(matchApi.mockData))
          } else {
            res.json({
              msg: '接口代理请求失败'
            })
          }
        })
      } else {
        let data = []
        let size = 0
        req.on('data', chunk => {
          data.push(chunk)
          size += chunk.length
        })
        req.on('end', () => {
          let param = Buffer.concat(data, size).toString()
          try {
            param = JSON.parse(param || null)
          } catch (e) {
            if (/[&=]/.test(param)) {
              let p = {}
              param.split('&').forEach(item => {
                let arr = item.split('=')
                p[arr[0]] = arr[1]
              })
              param = p
            }
          }
          console.log('请求参数', param)
          switch (matchApi.runStyle) {
            case 'staticMock':
              res.json(JSON.parse(matchApi.mockData))
              break
            case 'scriptMock':
              console.log('请求参数', param)
              scriptMock(req, res, param, matchApi.mockScript)
              break
          }
        })
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

module.exports = handle
