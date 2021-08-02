import '../isu-loading.js'

/**
 * @polymerBehavior
 */
export const BaseBehavior = {
  properties: {
    /**
     * font size of a component, eg: x-small(10px),small(12px),medium(14px),large(16px),larger(18px)
     * @attribute type
     * @type {string}
     * @default 'medium'
     */
    fontSize: {
      type: String,
      default: 'medium'
    }
  },
  /**
   * 判断第一个参数是否与后面的某个参数相等， 使用Object.is() 进行判断
   * @param {...*} args
   * @return {boolean}
   */
  isOneOf (...args) {
    if (Array.isArray(args) && args.length > 0) {
      const target = args[0]
      return args.slice(1).some(arg => Object.is(arg, target))
    }

    return false
  },

  /**
   * 判断两个值是否相等，使用 `Object.is` 判断。
   * @param {*} left
   * @param {*} right
   * @return {boolean}
   */
  isEqual (left, right) {
    return Object.is(left, right)
  },

  /**
   * 判断传入参数两两是否全部相等
   * @param args
   * @return {boolean}
   */
  allEqual (...args) {
    for (let i = 0, len = args.length; i < len; i = i + 2) {
      if (i + 1 >= len || !Object.is(args[i], args[i + 1])) return false
    }
    return true
  },

  /**
   * 判断传入参数两两是否存在一对相等
   * @param args
   * @return {boolean}
   */
  someEqual (...args) {
    for (let i = 0, len = args.length - 1; i < len; i = i + 2) {
      if (Object.is(args[i], args[i + 1])) return true
    }
    return false
  },
  /**
   * 函数判断
   * @param {*} fn
   * @return {boolean}
   */
  isFunction (fn) {
    return Function.prototype.isPrototypeOf(fn)
  },

  /**
   * Return the first giving arg which is not ``undefined``, ``null``, ``NaN`` , ``false`` ,``0`` or ``''``.
   *
   * eg.
   * ```
   * orElse(undefined, null, "foo")  // "foo"
   * orElse(0, 1)  // 1
   * orElse("bar", "foo")  // "bar"
   * ```
   * @param {...*} args
   * @return {*}
   */
  orElse (...args) {
    const [first, ...rest] = args
    return rest.length === 0 ? first : (first || this.orElse(...rest))
  },

  /**
   * 通过key查询对象中的值
   * @param {Object} model
   * @param {string} key
   * @param {string} defVal  支持任何符合json格式的字符串
   * @return {*}
   */
  getValueByKey (model, key, defVal = '') {
    return (model && (key in model)) ? model[key] : defVal
  },

  /**
   * 等价于 model[key1 || key2 || ...]
   * @param {Object} model
   * @param {...string} keys
   * @return {*}
   */
  getValueOrElse (model, ...keys) {
    const key = this.orElse(...keys)
    return this.getValueByKey(model, key)
  },
  /**
   * 等价于 model[key1 || key2 || ...] 如果找不到值，返回null
   * @param {Object} model
   * @param {...string} keys
   * @return {*}
   */
  getValueOrElseNull (model, ...keys) {
    const key = this.orElse(...keys)
    return this.getValueByKey(model, key, null)
  },
  /**
   * 等价于 model[key1 || key2 || ...] 如果找不到值，返回 undefined
   * @param {Object} model
   * @param {...string} keys
   * @return {*}
   */
  getValueOrElseUndefined (model, ...keys) {
    const key = this.orElse(...keys)
    return (model && (key in model)) ? model[key] : undefined
  },
  /**
   * 解析json串，如果传入参数不符合json标准，则原样返回
   * @param val
   * @return {*}
   */
  resolveJsonValue (val) {
    try {
      if (typeof val === 'string') {
        return JSON.parse(val)
      }
    } catch (e) {
      console.log(e)
    }

    return val
  },
  /**
   * 通过路径获取对象字段值
   * @param {Object} model eg. { foo: { bar: 1} }
   * @param {string} path  eg. "foo.bar"
   * @param {*} defVal  如果传入的是符合json格式的字符串，会返回JSON.parse处理的结果
   * @param {function} format  添加格式化函数支持
   * @return {*}
   */
  getValueByPath (model, path = '', defVal, format) {
    if (!model) return this.resolveJsonValue(defVal)
    if (format) {
      return format(model)
    }
    const splits = path.toString().split('.')
    let copy = model
    for (const key of splits) {
      if (this.isEmptyObject(copy[key])) return copy[key] || this.resolveJsonValue(defVal)
      copy = copy[key]
    }
    return copy
  },

  /**
   * 通过路径设置对象字段值， 如果路径不存在，会抛出异常
   * @param model
   * @param path
   * @param value
   * @return {*}
   */
  setValueByPath (model, path, value) {
    const paths = String(path).split('.')
    let tmp = model; let ctx; let key
    for (key of paths) {
      if (key in tmp) {
        ctx = tmp
        tmp = tmp[key]
      } else {
        throw new Error(`path ${key} not found in the giving object`)
      }
    }
    ctx[key] = value

    return model
  },

  /**
   * 根据路径生成对象，如 path='a.b' 返回 {a: {b: {}}}, 如果指定了target, 会在target上生成不存在的key
   * @param path
   * @param target
   */
  mkObject (path = '', target = {}) {
    const paths = String(path).split('.')

    if (String(path).length > 0) {
      paths.reduce((res, p) => {
        if (!(p in res && typeof res[p] === 'object')) res[p] = {}
        return res[p]
      }, target)
    }

    return target
  },

  /**
   * To boolean.
   * @param {*} val
   */
  toBoolean (val) {
    return !!val
  },

  isAllTrue (...args) {
    const [first, ...rest] = args
    return rest.length === 0 ? this.toBoolean(first) : (this.toBoolean(first) && this.isAllTrue(...rest))
  },

  isAllFalse (...args) {
    const [first, ...rest] = args
    return rest.length === 0 ? !this.toBoolean(first) : (!this.toBoolean(first) && this.isAllFalse(...rest))
  },

  /**
   * check if there's a truthy in the giving args
   * @param {*} val
   */
  isExistTruthy (...args) {
    return args.some(arg => !!arg)
  },
  /**
   * 移除字符串中所有的空格
   * @param str
   * @return {*}
   */
  trimStr: function (str = '') {
    if (str === null || str === undefined) {
      return ''
    }
    return str.replace(/\s/g, '')
  },
  /**
   * Check if an array is empty.
   * @param arr
   * @return {boolean}
   */
  isArrayEmpty (arr = []) {
    return !arr || (arr && arr.length === 0)
  },
  /**
   * 判断是否空对象, []、{}、null、undefined、'' 皆为空对象，特殊的，function和0、'0'不属于空对象
   * @param entity
   * @return {boolean}
   */
  isEmptyObject (entity) {
    if (Array.isArray(entity)) {
      return entity.length === 0
    } else if (Function.prototype.isPrototypeOf(entity)) {
      return false
    } else if (Object.prototype.isPrototypeOf(entity)) {
      return Object.keys(entity).length === 0
    } else if (Number.isFinite(entity)) {
      return false
    } else {
      return entity === null || entity === undefined || this.trimStr(entity) === ''
    }
  },
  /**
   * 简单数学运算
   * @param first
   * @param op
   * @param nums
   * @return {*}
   */
  calc (first, op, ...nums) {
    switch (op) {
    case '+':
      return nums.reduce((res, num) => res + num, first)
    case '-':
      return nums.reduce((res, num) => res - num, first)
    case '*':
      return nums.reduce((res, num) => res * num, first)
    case '/':
      return nums.reduce((res, num) => res / num, first)
    case '%':
      return nums.reduce((res, num) => res % num, first)
    default:
      return ''
    }
  },

  toggleClass (target, className) {
    if (target instanceof Element) {
      if (target.classList.contains(className)) {
        target.classList.remove(className)
      } else {
        target.classList.add(className)
      }
    }
  },

  /**
   * 添加loading
   */
  showLoading (ele) {
    let loadingDiv = (ele || document.body).querySelector('#isu-loading')
    if (!loadingDiv) {
      loadingDiv = document.createElement('isu-loading')
      loadingDiv.setAttribute('id', 'isu-loading')
      loadingDiv.noCancelOnOutsideClick = true
      loadingDiv.noCancelOnEscKey = true;
      // loadingDiv.withBackdrop = true;
      (ele || document.body).appendChild(loadingDiv)
    }
    this.async(() => {
      loadingDiv.opened = true
      loadingDiv.style.position = 'fixed'
    }, 0)
  },
  /**
   * 消除loading
   */
  hideLoading (ele) {
    this.async(() => {
      const loadingDiv = (ele || document.body).querySelector('#isu-loading')
      if (loadingDiv) {
        this.debounce('_hideLoading', this._hideLoading.bind(this, loadingDiv), 400)
      }
    }, 0)
  },
  _hideLoading (loadingDiv) {
    loadingDiv.opened = false
  },

  /**
   * 添加Nprogress， loading的另一种表现形式
   */
  showNprogress () {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/nprogress@0.2.0/nprogress.css'
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/nprogress@0.2.0/nprogress.js'
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(script)
    head.appendChild(link)
    this.async(this.startNprogress, 0)
  },
  startNprogress () {
    NProgress.start()
  },
  /**
   * 消除Nprogress
   */
  hideNprogress () {
    NProgress.done()
  },

  throwNotFoundError (string) {
    throw new TypeError(string + ' should not be undefined.')
  },

  deepClone (data) {
    const type = this._judgeType(data)
    let obj = null
    if (type === 'array') {
      obj = []
      data.forEach(item => {
        obj.push(this.deepClone(item))
      })
    } else if (type === 'object') {
      obj = {}
      Object.keys(data).forEach(key => {
        if (data.hasOwnProperty(key)) {
          obj[key] = this.deepClone(data[key])
        }
      })
    } else {
      return data
    }
    return obj
  },

  _judgeType (obj) {
    // tostring会返回对应不同的标签的构造函数
    const toString = Object.prototype.toString
    const map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    }
    if (obj instanceof Element) {
      return 'element'
    }
    return map[toString.call(obj)]
  },
  optional (bool, trueReturn, falseReturn = '') {
    return bool ? trueReturn : falseReturn
  },

  /**
   * 用法：
   * this.groupBy(array, 'a', 'nogroup');
   * this.groupBy(array, (item) => item.a || 'nogroup');
   *
   * 对数组进行分组，如给定[{a: 'group1', b: 2}, {a: 'group1', b: 4}, {a: 'group2', b: 5}] 返回 { 'group1': [{a: 'group1', b: 2}, {a: 'group1', b: 4}], 'group2': [ {a: 'group2', b: 5}] }
   * @param array
   * @param iteratee， The iteratee to transform keys.，如 'bar'， 或 'foo.bar' 或 Function
   * @param defaultGroup, 当指定的分组字段不存在时，归类到的默认分组
   * @return Object
   */
  groupBy (array, iteratee, defaultGroup = 'wilding') {
    let valueResolver, args
    if (this.isFunction(iteratee)) {
      valueResolver = iteratee
      args = []
    } else {
      valueResolver = this.getValueByPath
      args = [iteratee, defaultGroup]
    }
    return array.reduce((res, item) => {
      const val = valueResolver.call(this, item, ...args)
      const group = res[val] || []
      group.push(item)
      res[val] = group
      return res
    }, {})
  },

  /**
   * this.partition([1,2,3], item => item > 2);  返回 [[3], [1, 2]]
   * this.partition([{a: 1}, {a: 2}],  {a: 1});  返回 [[{a: 1}], [{a: 2}]]
   *this.partition([{a: 1}, {a: 2}],  'a');  返回 [[{a: 1}, {a: 2}], []]
   *
   * Creates an array of elements split into two groups, the first of which contains elements predicate returns truthy for, the second of which contains elements predicate returns falsey for.
   * @param array
   * @param predicate
   * @return
   */
  partition (array, predicate) {
    let _predicate
    if (this.isFunction(predicate)) {
      _predicate = predicate
    } else if (Object.prototype.isPrototypeOf(predicate)) {
      _predicate = (item) => Object.entries(predicate).every(([key, value]) => item[key] === value)
    } else if (typeof predicate === 'string') {
      _predicate = (item) => item[predicate]
    } else {
      throw new TypeError(`Unsupported predicate type ${typeof predicate}`)
    }

    return array.reduce((res, item) => {
      if (_predicate.call(this, item)) {
        res[0].push(item)
      } else {
        res[1].push(item)
      }
      return res
    }, [[], []])
  },

  /**
   * get date-invalid attribute
   *
   * @param
   * @return
   */
  getInvalidAttribute () {
    !this.validate() ? this.setAttribute('data-invalid', '') : this.removeAttribute('data-invalid')
  },

  /**
   * set value to storage(sessionStorage or localStorage)
   * @param key
   * @param value
   * @param sessionOnly, default true, if true ? sessionStorage, else localStorage
   */
  setStorageValue (key, value, sessionOnly = true) {
    const storage = sessionOnly ? window.sessionStorage : window.localStorage
    if (typeof value === 'undefined') { value = null }
    storage.setItem(key, JSON.stringify(value))
  },

  /**
   * get value from storage(sessionStorage or localStorage)
   * @param key
   * @param {boolean} sessionOnly, default true, if true ? sessionStorage, else localStorage
   * @return {*}
   */
  getStorageValue (key, sessionOnly = true) {
    const storage = sessionOnly ? window.sessionStorage : window.localStorage
    const str = storage.getItem(key)
    return this.resolveJsonValue(str)
  },

  /**
   *
   * @param arr
   * @return {number}
   */
  getArrayLength (arr = []) {
    return this.isArrayEmpty(arr) ? 0 : arr.length
  },

  /**
   * check the validate, override by the child component
   *
   * @param
   * @return
   */
  validate () {
  }
}
