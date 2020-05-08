import {BaseBehavior} from "./base-behavior";
import {TipBehavior} from "./tip-behavior"
/**
 *  @polymerBehavior
 */
const AjaxBehaviorImpl = {
  /**
   * GET 请求
   *
   * 例子：
   *```javascript
   * 1. 直接传递一个Request 实例
   *  const req = new Request('/test?foo=1&bar=2', {method: 'GET'});
   *  this.query(req).then(() => console.log());
   *
   * 2. 直接传递一个url
   *  this.query('/test').then(() => console.log());
   *
   * 3. 直接传递一个包含url、data内容的对象
   *  this.query({
   *       url: '/test',
   *       data: { foo:1, bar:2 },
   *       handleAs: 'json'
   *   }).then(() => console.log());
   * ```
   * ******************************************************
   *
   * @param {string|Request|Object} input -
   *      支持3种类型： String|Request|Object
   *      1. Request实例
   *      2. string：请求url
   *      3: Object： 对象结构要求 { url , data, handleAs}
   *          url：必填项
   *          data：可选
   *          handleAs：string, 可选，默认值是"json"， 取值范围: text|json|blob|formData|arrayBuffers
   *
   *
   * @param input
   * @param loadConfig => default: { showLoading: true, type: 'loading' }
   * @returns {*}
   */
  query(input, loadConfig = { showLoading: true, type: 'loading'}) {
    let url,
      data = {},
      handleAs = 'json';

    if (Request.prototype.isPrototypeOf(input)) {

      return this.__fetch(handleAs, input, loadConfig);

    } else if (Object.prototype.isPrototypeOf(input)) {

      ({
        url = this.throwNotFoundError("url"),
        data = {},
        handleAs = "json"
      } = input);

    } else {
      url = String(input);
    }

    return this.__get(handleAs, {url, data}, loadConfig);

  },

  /**
   * POST 请求
   *
   * ```javascript
   * 1. 直接传递一个Request 实例
   *  const req = new Request('/test?foo=1&bar=2', {method: 'POST'});
   *  this.post(req).then(() => console.log());
   *
   * 2. 直接传递一个url
   *  this.post('/test').then(() => console.log());
   *
   * 3. 直接传递一个包含url、data内容的对象
   *  this.post({
   *       url: '/test',
   *       data: { foo:1, bar:2 }
   *   }).then(() => console.log());
   *
   *  4. 上传文件
   *  const formData = new FormData();
   *  formData.append('file1', new File([], 'filename'));
   *  this.post({
   *      url: '/upload',
   *      data: formData
   *  }).then(() => console.log());
   *
   *  5. 发送json格式的数据
   *  this.post({
   *      url: '/upload',
   *      data: {foo:1,bar:2},
   *      sendAsJson: true
   *  }).then(() => console.log());
   * ```
   * ******************************************************
   *
   * @param {string|Request|Object} input -
   *      支持3种类型： String|Request|Object
   *      1. Request实例
   *      2. string：请求url
   *      3: Object： 对象结构要求 { url , data, handleAs, sendAsJson}
   *          url：必填项
   *          data：可选
   *          handleAs：string, 可选，默认值是"json"， 取值范围: text|json|blob|formData|arrayBuffer
   *          sendAsJson：boolean 可选，默认值是false
   *
   * @param loadConfig
   * @return {*}
   */
  post(input, loadConfig = { showLoading: true, type: 'loading'}) {

    let url,
      data = {},
      handleAs = 'json',
      sendAsJson = false;

    if (Request.prototype.isPrototypeOf(input)) {

      return this.__fetch(handleAs, input, loadConfig);

    } else if (Object.prototype.isPrototypeOf(input)) {

      ({
        url = this.throwNotFoundError("url"),
        data = {},
        handleAs = "json",
        sendAsJson = false,
      } = input);

    } else {
      url = String(input);
    }

    return this.__post(handleAs, {url, data, sendAsJson}, loadConfig);
  },

  /**
   * DELETE 请求
   *
   * 例子：
   *```javascript
   * 1. 直接传递一个Request 实例
   *  const req = new Request('/test?foo=1&bar=2', {method: 'GET'});
   *  this.delete(req).then(() => console.log());
   *
   * 2. 直接传递一个url
   *  this.delete('/test').then(() => console.log());
   *
   * 3. 直接传递一个包含url、data内容的对象
   *  this.delete({
   *       url: '/test',
   *       data: { foo:1, bar:2 },
   *       handleAs: 'json'
   *   }).then(() => console.log());
   * ```
   * ******************************************************
   *
   * @param {string|Request|Object} input -
   *      支持3种类型： String|Request|Object
   *      1. Request实例
   *      2. string：请求url
   *      3: Object： 对象结构要求 { url , data, handleAs}
   *          url：必填项
   *          data：可选
   *          handleAs：string, 可选，默认值是"json"， 取值范围: text|json|blob|formData|arrayBuffers
   *
   * @param loadConfig => default: { showLoading: true, type: 'loading' }
   * @return
   */
  delete(input, loadConfig = { showLoading: true, type: 'loading'}) {
    let url,
      data = {},
      handleAs = 'json';

    if (Request.prototype.isPrototypeOf(input)) {

      return this.__fetch(handleAs, input, loadConfig);

    } else if (Object.prototype.isPrototypeOf(input)) {

      ({
        url = this.throwNotFoundError("url"),
        data = {},
        handleAs = "json"
      } = input);

    } else {
      url = String(input);
    }

    return this.__delete(handleAs, {url, data}, loadConfig);

  },


  __get(handleAs, {url, data}, loadConfig) {

    const reqUrl = new URL(window.location.origin + url);
    Object.keys(data).filter(key => data[key] != undefined).forEach((key) => reqUrl.searchParams.append(key, data[key]));

    const req = new Request(reqUrl, {
      method: "GET",
      credentials: "include"
    });

    return this.__fetch(handleAs, req, loadConfig);
  },

  __post(handleAs, {url, data, sendAsJson}, loadConfig) {
    let body, headers;
    if (sendAsJson) {
      headers = {
        'content-type': 'application/json;charset=utf-8'
      };
      body = JSON.stringify(data);
    } else if (data instanceof FormData) {
      body = data;
    } else {
      const searchParams = new URLSearchParams();
      Object.keys(data).forEach((key) => searchParams.append(key, data[key]));
      body = searchParams;
    }

    const req = new Request(url, {
      method: "POST",
      credentials: "include",
      headers,
      body
    });

    return this.__fetch(handleAs, req, loadConfig);
  },

  __delete(handleAs, {url, data}, loadConfig) {

    const reqUrl = new URL(window.location.origin + url);
    Object.keys(data).filter(key => data[key] != undefined).forEach((key) => reqUrl.searchParams.append(key, data[key]));

    const req = new Request(reqUrl, {
      method: "DELETE",
      credentials: "include"
    });

    return this.__fetch(handleAs, req, loadConfig);
  },

  /**
   *
   * loadConfig = { showLoading: true, type: 'nprogress' }
   * 参数介绍： showLoading @type {boolean} @default false
   *           type @type string @default `loading` , value: `loading`|`nprogress`, if value !== `nprogress`, value === `loading`
   *
   * @param handleAs
   * @param request
   * @param loadConfig => default: { showLoading: true, type: 'loading' }
   * @private
   */
  async __fetch(handleAs, request, loadConfig = {showLoading: true, type: 'loading'}) {
    try {
      this.showLoadingByStatus(loadConfig);
      const response = await window.fetch(request)
      this.hideLoadingByStatus(loadConfig);
      if(response.ok) {
        if (response.headers.has('Content-length')
          && Number(response.headers.get('Content-length')) === 0) {
          return Promise.resolve()
        } else {
          return response[handleAs]();
        }
      } else {
        const err = await response.text()
        this.isuTip.error(err)
        throw err;
      }
    }catch (e) {
      this.hideLoadingByStatus(loadConfig);
      this.isuTip.error(e)
      return await Promise.reject(e)
    }

  },

  /**
   * 根据参数设置隐藏loading的方式
   */
  hideLoadingByStatus: function({showLoading, type}) {
    if(!showLoading) return
    switch (type) {
      case 'loading':
        this.hideLoading();
        break;
      case 'nprogress':
        this.hideNprogress();
        break;
      default:
        this.hideLoading();
        break;
    }
  },

  /**
   * 根据参数设置显示loading的方式
   */
  showLoadingByStatus: function({showLoading, type}) {
    if(!showLoading) return
    switch (type) {
      case 'loading':
        this.showLoading();
        break;
      case 'nprogress':
        this.showNprogress()
        break;
      default:
        this.showLoading();
        break;
    }
  }
};

export const AjaxBehavior = [BaseBehavior, TipBehavior, AjaxBehaviorImpl];
