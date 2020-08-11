/*
提供公共的格式化方法
*/
/**
 * @polymerBehavior
 */
export const FormatBehavior = {
  properties: {},
  /**
   * 格式化日期
   * @param date 时间戳（毫秒）
   * @param fmt 显示格式，默认为'YYYY-MM-DD hh:mm:ss'
   * @param emptyReturn 默认空值返回数据
   */
  formatDate: function (date, fmt, emptyReturn) {
    if (!date && emptyReturn) {
      return emptyReturn
    }
    date = date || new Date().getTime()
    fmt = fmt || 'YYYY-MM-DD hh:mm:ss'
    date = new Date(Number(date))
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'D+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      z: date.getMilliseconds() // 毫秒
    }
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  _reMatch: function (str) {
    let smarr = []
    let maStr = ''
    const parti = /(^\w{4}|\w{2}\B)/g
    if (isFinite(str)) {
      maStr = str.replace(parti, '$1-')
    } else {
      maStr = /^[A-Za-z]+$/.test(str) ? str.replace(parti, '$1-') : str
    }
    smarr = this._each(maStr)
    return smarr
  },
  _each: function (maStr) {
    return maStr.match(/\w+|d+/g).map(val => {
      return isFinite(val) ? parseInt(val) : val
    })
  },
  /**
   * 将日期转化成时间戳
   * @param date 日期
   * @return emptyReturn 默认空值返回数据
   */
  dateToTimestamp: function (date) {
    const arrs = this._reMatch(date)
    return arrs.length > 0 ? +new Date(arrs[0], arrs[1] - 1 || 1, arrs[2] || 1, arrs[3] || 0, arrs[4] || 0, arrs[5] || 0) : ''
  }
}
