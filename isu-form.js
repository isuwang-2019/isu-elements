
import { html, PolymerElement } from '@polymer/polymer'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js'

import { BaseBehavior } from './behaviors/base-behavior'
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js'
import './isu-fetch.js'
/**
 * `isu-form`
 *
 * Example:
 * ```html
 * <isu-form title="demo" action="/test.do">
 * <isu-input class="form-input" label="公司名称" name="company"></isu-input>
 * <isu-input class="form-input" label="电话" name="tel" type="tel" maxlength="11"></isu-input>
 * <isu-input class="form-input" label="地址" name="address"></isu-input>
 * <isu-input class="form-input" label="姓名" name="name"></isu-input>
 * <isu-input class="form-input" label="年龄" name="age" type="number"></isu-input>
 * <isu-button slot="form-btn" form-submit>提交</isu-button>
 * </isu-form>
 * ```
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * |Custom property | Description | Default|
 * |----------------|-------------|----------|
 * |`--isu-form-title` | Mixin applied to the head title of form | {}
 * |`--isu-form` | Mixin applied to form | {}
 * |`--isu-form-button` | Mixin applied to submit button of the form | {}
 * @customElement
 * @polymer
 * @demo demo/isu-form/index.html
 */
class IsuForm extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
      <style>
        :host {
          display: block;
          font-family: var(--isu-ui-font-family), sans-serif;
          font-size: var(--isu-ui-font-size);
        }
  
        #title {
          @apply --isu-form-title;
        }
  
        .container {
          display: grid;
          grid-template-columns: 45% 45%;
          grid-column-gap: 10px;
          grid-row-gap: 30px;
          @apply --isu-form;
        }
  
        .btns {
          margin: 20px;
          display: flex;
          justify-content: flex-end;
          @apply --isu-form-button;
        }
      </style>
      <h2 id="title">[[title]]</h2>
  
      <div class="container">
        <slot id="form-fields"></slot>
      </div>
      <div class="btns">
        <slot name="form-btn"></slot>
      </div>
      <isu-fetch id="fetch" handle-response-as="[[handleResponseAs]]"></isu-fetch>
  `
  }

  static get properties () {
    return {
      /**
       * Head title of the form
       */
      title: {
        type: String
      },

      /**
       * Request method,GRT or POST,default POST
       * @default 'POST'
       */
      method: {
        type: String,
        value: 'POST'
      },

      /**
       * The URI of a program that processes the form information
       */
      action: {
        type: String
      },

      /**
       * Enctype is the MIME type of content that is used to submit the form to the server.
       * @type {string}
       * @default 'application/json;charset=utf-8'
       */
      enctype: {
        type: String,
        value: 'application/json;charset=utf-8'
      },
      /**
       * Set to true to indicate that the form is not to be validated when submitted
       * @type {boolean}
       * @default false
       */
      novalidate: {
        type: Boolean,
        value: false
      }
    }
  }

  static get is () {
    return 'isu-form'
  }

  connectedCallback () {
    super.connectedCallback()
    Gestures.addListener(this, 'tap', e => {
      const path = dom(e).path
      const submit = path.find(target => target.hasAttribute && (target.hasAttribute('form-submit')))
      submit && this.submit()
    })
  }

  /**
   * Summit the form to server.
   */
  submit () {
    const namedFieldNode = this.$['form-fields'].assignedNodes()
      .filter(node => node.hasAttribute && node.hasAttribute('name'))

    const allValid = this.novalidate || namedFieldNode.every(node => node.validate ? node.validate() : true)

    if (allValid) {
      const reqData = namedFieldNode.reduce((result, node) => {
        const key = node.getAttribute('name')
        const value = node.value
        result[key] = value
        return result
      }, {})
      const method = (this.method || '').toUpperCase()
      if (method === 'GET') {
        this._get(reqData)
      } else if (method === 'POST') {
        this._post(reqData)
      } else {
        throw new TypeError(`Unsupported method: ${this.method}`)
      }
    }
  }

  _get (reqData) {
    const reqUrl = new URL(this.action, window.location.href)
    Object.keys(reqData)
      .forEach((key) => reqUrl.searchParams.append(key, reqData[key] || ''))

    this.$.fetch.fetchIt({
      url: reqUrl,
      method: this.method,
      credentials: 'include'
    }).then(this._successHandler.bind(this))
      .catch(this._errorHandler.bind(this))
  }

  _post (reqData) {
    const enctype = (this.enctype || '').toLowerCase()
    const headers = {}
    let body

    if (~enctype.indexOf('application/json')) {
      headers['content-type'] = this.enctype
      body = JSON.stringify(reqData)
    } else if (~enctype.indexOf('application/x-www-form-urlencoded')) {
      const searchParams = new URLSearchParams()
      Object.keys(reqData).forEach((key) => searchParams.append(key, reqData[key]))
      body = searchParams
    } else if (~enctype.indexOf('multipart/form-data')) {
      const formData = new FormData()
      Object.keys(reqData).forEach((key) => formData.append(key, reqData[key]))
      body = formData
    } else {
      throw new TypeError(`Unsupported enctype: ${this.enctype}`)
    }

    this.$.fetch.fetchIt({
      url: this.action,
      method: this.method,
      credentials: 'include',
      headers,
      body
    }).then(this._successHandler.bind(this))
      .catch(this._errorHandler.bind(this))
  }

  _successHandler (response) {
    if (response.ok) {
      this.dispatchEvent(new CustomEvent('submitted', {
        bubbles: true,
        composed: true
      }))
    } else {
      this._errorHandler()
    }
  }

  _errorHandler () {
    this.dispatchEvent(new CustomEvent('error', {
      bubbles: true,
      composed: true
    }))
  }
}

window.customElements.define(IsuForm.is, IsuForm)
