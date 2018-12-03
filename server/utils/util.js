module.exports = {
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
  /**
   *
   */
  isEmpty (obj) {
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        return false
      }
    }
    return true
  },
  /**
   * 判断对象是否是null或undefined
   * @param obj
   * @returns {boolean}
   */
  isValid (obj) {
    return obj === null || obj === undefined
  },
  /**
   * 判断两个对象是否相同
   * @param a
   * @param b
   * @returns {boolean}
   */
  isEqual (a = {}, b = {}) {
    return JSON.stringify(a) === JSON.stringify(b)
  },
  /**
   * 合并对象
   * @param defaults
   * @param extend
   * @returns {*}
   */
  mergeObject (defaults = {}, extend = {}) {
    for (let key in defaults) {
      let defaultsProp = defaults[key]
      let extendProp = extend[key]
      if (this.isObject(defaultsProp)) {
        this.mergeObject(defaultsProp, extendProp)
      } else if (this.isArray(defaultsProp)) {
        if (this.isArray(extendProp)) {
          for (let i = 0; i < defaultsProp.length && i < extendProp.length; i++) {
            extendProp[i] = this.mergeObject(defaultsProp[i], extendProp[i])
          }
        } else {
          extend[key] = defaultsProp
        }
      } else {
        extend[key] = this.isValid(extendProp) ? defaultsProp : extendProp
      }
    }
    return extend
  },
  /**
   * 字符串占位符替换
   * @param str
   * @param obj
   * @returns {*}
   */
  strReplace (str, obj) {
    const matchList = str.match(/\{\S*?\}/g) || []
    matchList.forEach((item) => {
      const key = item.replace(/\{|\}/g, '')
      str = str.replace(item, obj[key] || '')
    })
    return str
  },
  /**
   * 从中间拆分字符串,长度超出的话，解析为xxx...xxx
   * @param str
   * @param config
   * @returns {*}
   */
  strMiddleSplit (str, config = {
    maxLength: 20,
    begenLength: 8,
    endLength: 8,
    replaceStr: '...'
  }) {
    str += ''
    let reg = {
      fullCharReg: /[^\x00-\xff]/,
      fullCharsReg: /[^\x00-\xff]/g,
      anyChars: /[\S\s]{1}/g
    }
    
    let fullCharLength = (str.match(reg.fullCharsReg) || []).length
    let fullLength = str.length + fullCharLength
    let beginArr = []
    let beginLength = 0
    let endArr = []
    let endLength = 0
    
    if (fullLength > config.maxLength) {
      let strArr = str.match(reg.anyChars)
      
      strArr.forEach(char => {
        if (beginLength >= config.begenLength) return
        let len = reg.fullCharReg.test(char) ? 2 : 1
        beginLength += len
        beginArr.push(char)
      })
      
      strArr.reverse().forEach(char => {
        if (endLength >= config.endLength) return
        let len = reg.fullCharReg.test(char) ? 2 : 1
        endLength += len
        endArr.push(char)
      })
      
      return beginArr.join('') + config.replaceStr + endArr.reverse().join('')
    }
    
    return str
  },
  /**
   * 获取字符串长度，区分中英文
   * @param str
   * @returns {number}
   */
  getStrFullLength (str) {
    let reg = {
      fullCharReg: /[^\x00-\xff]/,
      fullCharsReg: /[^\x00-\xff]/g,
      anyChars: /[\S\s]{1}/g
    }
    
    let fullCharLength = (str.match(reg.fullCharsReg) || []).length
    let fullLength = str.length + fullCharLength
    return fullLength
  },
  /**
   * 为单数前补0
   * @param num
   * @returns {string}
   */
  toDoubleNumber (num) {
    num += ''
    return num > 9 ? num : ('0' + num)
  },
  /**
   * 日期格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  dateFormat (date = new Date(), formatter = 'yyyy-mm-dd') {
    return formatter.replace('yyyy', date.getFullYear())
      .replace('mm', this.toDoubleNumber(date.getMonth() + 1))
      .replace('dd', this.toDoubleNumber(date.getDate()))
  },
  /**
   * 日期格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  timeFormat (date = new Date(), formatter = 'hh:mm:ss') {
    if (this.isDate(date)) {
      return formatter.replace('hh', this.toDoubleNumber(date.getHours()))
        .replace('mm', this.toDoubleNumber(date.getMinutes()))
        .replace('ss', this.toDoubleNumber(date.getSeconds()))
    } else if (this.isNumber(date)) {
      // formatter 格式化规则 如:{s:'秒', h:'小时', m: '分钟'}
      formatter = this.isObject(formatter) ? formatter : {}
      let s = parseInt((parseFloat(date) / 1000).toFixed(0))
      let m = parseInt(s / 60)
      let h = parseInt(m / 60)
      s = s - m * 60
      m = m - h * 60
      let format = {
        s: 's',
        m: 'm',
        h: 'h'
      }
      format = this.mergeObject(format, formatter || {})
      let text = s + format.s
      text = (m ? (m + format.m) : '') + text
      text = (h ? (h + format.h) : '') + text
      return text
    }
  },
  /**
   * 日期时间格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  dateTimeFormat (date = new Date(), formatter = 'yyyy-mm-dd hh:mm:ss') {
    formatter = formatter.split('hh')
    return this.dateFormat(date, formatter[0]) + this.timeFormat(date, 'hh' + formatter[1])
  },
  /**
   * 格式化字符串为时间（例"2017-01-01" 或"20170101"）
   * @param {string} str
   * @returns {string}
   */
  getDate (str) {
    let timeArr = str.match(/(\d{4})[^0-9]*(\d{2})[^0-9]*(\d{2})/) || []
    return new Date(timeArr.slice(1, 4).join('/'))
  },
  /**
   * xss注入处理
   */
  xssEncode (str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  },
  /**
   * 字符串转为驼峰格式, eg: a_b ==> aB
   * @param str
   * @returns {string}
   */
  toCamel (str = '') {
    let matchArr = str.match(/_\S/g) || []
    matchArr.forEach((item) => {
      str = str.replace(item, item.replace('_', '').toUpperCase())
    })
    return str
  },
  /**
   * 将驼峰格式字符串转化为下划线格式，eg：aB ===> a_b
   * @param str
   * @returns {string}
   */
  toUnderLine (str = '') {
    let matchArr = str.match(/[A-Z]/g) || []
    matchArr.forEach((item) => {
      str = str.replace(item, '_' + item.toLowerCase())
    })
    return str
  },
  /**
   * 转为驼峰命名规范对象
   * @param obj
   * @returns {{}}
   */
  toCamelObj (obj = {}) {
    let result = {}
    for (let key in obj) {
      if (this.isFunction(obj[key])) continue
      result[this.toCamel(key)] = obj[key]
    }
    return result
  },
  /**
   * 转为下划线命名规范对象
   * @param obj
   * @returns {{}}
   */
  toUnderLineObj (obj = {}) {
    let result = {}
    for (let key in obj) {
      if (this.isFunction(obj[key])) continue
      result[this.toUnderLine(key)] = obj[key]
    }
    return result
  },
  /**
   * 根据指定url和参数对象，转成url格式字符串
   * @param url
   * @param param
   * @returns {string}
   */
  toUrl (url = '', param = {}) {
    let params = []
    let prefix = /\?/.test(url) ? '&' : '?'
    for (let key in param) {
      params.push(`${key}=${param[key]}`)
    }
    return `${url}${prefix}${params.join('&')}`
  },
  /**
   * 将数字转为千分位分割格式
   * @param num
   * @returns {string}
   */
  toThousands (num = 0) {
    let source = String(num).split('.')// 按小数点分成2部分
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,')
    return source.join('.')// 再将小数部分合并进来
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
  isEmptyObj (obj) {
    return JSON.stringify(obj) === '{}'
  },
  /**
   * 除法计算
   * @param {number} numerator 分子
   * @param {number} denominator 分母
   * @param {number} precision 小数精度
   * @returns {string}
   */
  divisionCalculation (numerator, denominator, precision = 2) {
    let data = 0
    if (numerator && denominator) {
      precision = Math.pow(10, precision)
      numerator = numerator * precision
      data = Math.floor(numerator / denominator) / precision
    }
    return data
  },
  /**
   * 计算百分比值
   * @param {number} numerator 分子
   * @param {number} denominator 分母
   * @param {number} precision 小数精度
   * @returns {string}
   */
  percentCalculate (numerator, denominator, precision = 2) {
    let data = 0
    if (numerator && denominator) {
      precision = Math.pow(10, precision)
      numerator = numerator * precision * 100
      data = Math.floor(numerator / denominator) / precision
    }
    return data + '%'
  },
  guid () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  },
  /**
   * 格式化store中常量的值：actions、getters、mutations
   * @param constant
   * @param prefix
   */
  initializeConstants (constant, prefix) {
    for (let prop in constant) {
      let val = constant[prop]
      if (util.isObject(val)) {
        this.initializeConstants(val, `${prefix}-${prop}`)
      } else {
        constant[prop] = `${prefix}-${prop}`
      }
    }
  },
  getDomain (url) {
    let arr = url.match(/https?:\/\/\S*?\//)
    if (arr && arr.length) {
      return arr[0].replace(/\//g, '')
    }
    return ''
  },
  getStructure (data) {
    let output = {}
    if (this.isObject(data)) {
      for (let key in data) {
        const value = data[key]
        if (this.isArray(value)) {
          output[key] = [this.getStructure(value[0])]
        } else if (this.isObject(value)) {
          output[key] = this.getStructure(value)
        } else {
          output[key] = value
        }
      }
    } else if (this.isArray(data)) {
      output = data.length ? [this.getStructure(data[0])] : []
    } else {
      output = data
    }
    return output
  },
  getHost (req) {
    return req.headers.origin || `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
  },
  delay (time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }
}
