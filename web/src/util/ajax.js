/**
 * Created by yqdong on 2018/2/22.
 * qq: 1013501639
 * @author yqdong
 *
 */
import axios from 'axios'
import util from './util'
const resCode = {
  SUCCESS: 100,
  Error: 101,
  NO_PERMISSION: 103,
  NOT_LOGIN: 102,
  PARAM_NULL: 104
}
let CancelToken = axios.CancelToken
let preQueryOption
let cancel
function resCodeFilter (res) {
  let flag = true
  let status = res.data.code
  if (status) {
    status = parseInt(status)
  }
  switch (status) {
    case resCode.NO_PERMISSION:
      flag = false
      // location.href = '/app/noPermission'
      break
    case resCode.NOT_LOGIN:
      flag = false
      if (!/\/login/.test(window.location.href)) {
        location.href = `/login`
      }
      break
    case resCode.Error:
      flag = false
      break
    case resCode.PARAM_NULL:
      flag = false
      break
    case resCode.SUCCESS:
      break
    default:
      // eslint-disable-next-line
      console.warn('非标准状态码', res.data)
  }
  return flag
}
function checkRequestCode (code) {
  return /^2\d+/.test(code)
}
export default function (option) {
  option = util.mergeObject({
    method: 'post',
    url: '',
    data: null,
    baseURL: '/',
    unique: false, // 请求是否唯一，唯一的话，如果上一个请求的url与本次请求一致，则会取消上一个请求
    withCredentials: true
    // transformRequest (params) {
    //   var arr = []
    //   for (let key in params) {
    //     arr.push(`${key}=${encodeURIComponent(params[key])}`)
    //   }
    //   return arr.join('&')
    // }
  }, option)

  // URL中如果含有{}则将data中的参数替换到url中
  let reg = /\{\S*?\}/g
  if (reg.test(option.url)) {
    let params = option.url.match(reg)
    params.forEach(key => {
      // eslint-disable-next-line
      let prop = key.replace(/[\{\}]/g, '')
      option.url = option.url.replace(key, option.data[prop])
      delete option.data[prop]
    })
  }

  if (!option.cancelToken) {
    if (preQueryOption) delete preQueryOption['cancelToken']
    if (util.isEqual(option, preQueryOption) || (option.unique && preQueryOption && preQueryOption.url === option.url)) {
      cancel()
    }
    option.cancelToken = new CancelToken(function (c) {
      cancel = c
    })
    preQueryOption = option
  }
  return new Promise((resolve, reject) => {
    axios(option).then((res) => {
      if (checkRequestCode(res.status) && resCodeFilter(res)) {
        resolve(res.data)
      } else {
        // if (window.vue) {
        //   window.vue.$message({
        //     type: 'error',
        //     message: res.msg
        //   })
        // }
        reject(new Error(JSON.stringify({
          message: '请求状态或接口状态码错误',
          request: res.request.responseURL,
          response: res.data.data
        })))
      }
    }).catch((error) => {
      if (axios.isCancel(error)) return
      if (window.vue) {
        window.vue.$message({
          type: 'error',
          message: '系统或网络错误'
        })
      }
      reject(error)
    })
  })
}
