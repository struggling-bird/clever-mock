const fs = require('fs')
const querystring = require('querystring')
const config = require('../config')

var util = {
  type (obj) {
    return Object.prototype.toString.call(obj)
  },
  isObject (obj) {
    return this.type(obj) === '[object Object]'
  },
  isArray (obj) {
    return this.type(obj) === '[object Array]'
  },
  isString (obj) {
    return this.type(obj) === '[object String]'
  },
  isNumber (obj) {
    return this.type(obj) === '[object Number]'
  },
  isDate (obj) {
    return this.type(obj) === '[object Date]'
  },
  isFunction (obj) {
    return this.type(obj) === '[object Function]'
  },
  clone (obj) {
    if (this.isObject(obj)) {
      let result = {}
      for (let key in obj) {
        const prop = obj[key]
        result[key] = this.clone(prop)
      }
      return result
    } else if (this.isArray(obj)) {
      let result = []
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i]
        result.push(this.clone(item))
      }
      return result
    } else {
      return obj
    }
  },
  /**
   * 读取json文件，输出json对象(同步函数)
   * @param fileUrl
   * @returns {object}
   */
  getJsonFromFile (fileUrl) {
    let json = {}
    try {
      json = JSON.parse(fs.readFileSync(fileUrl, 'utf-8'))
    } catch (error) {
      json = {
        msg: '文件找不到 或 JSON格式化错误'
      }
    }
    return json
  }
}

module.exports = util
