/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html, PolymerElement } from '@polymer/polymer/polymer-element'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import './behaviors/isu-elements-shared-styles.js'
import '@polymer/iron-icons'
import '@polymer/iron-icon'
import './isu-button'
import { IsuFetch } from './isu-fetch'
import './isu-tip'
import { TipBehavior } from './behaviors/tip-behavior'
import { BaseBehavior } from './behaviors/base-behavior'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import { AjaxBehavior } from './behaviors/ajax-behavior'

/**
 *
 * `isu-upload`
 *
 * Example:
 * ```html
 *  <isu-upload accept="" multiple src="src" id="upload"></isu-upload>
 * ```
 *
 * * ### Styling
 *
 * `<isu-upload>` provides the following custom properties and mixins
 * for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--isu-upload-toolbar` | Mixin applied to the isu-upload component | {}
 * `--isu-upload-choose-button` | Mixin applied to the choose file button | {}
 * `--isu-upload-upload-button` | Mixin applied to the choose file button| {}
 * `--isu-ui-orange` | The color of the upload button | `#fdb03d`
 *
 * @customElement
 * @polymer
 * @demo demo/isu-upload/index.html
 */
export class IsuUpload extends mixinBehaviors([BaseBehavior, TipBehavior, AjaxBehavior], PolymerElement) {
  static get template () {
    return html`
<style include="isu-elements-shared-styles">
  :host {
    display: inline-block;
    min-width: 380px;
    --isu-ui-bg: var(--isu-ui-orange);
    @apply --isu-upload-toolbar
  }
  .toolbar {
    display: flex;
    align-items: center;
    display: flex;
    height: inherit;
    justify-content: space-evenly;
    align-items: center;
    
  }
  .choose-file {
    --isu-button-height: 34px;
    margin-right: 20px;
    @apply --isu-upload-choose-button
  }
  .upload-file {
    flex-grow: 1;
    background: var(--isu-ui-bg);
    @apply --isu-upload-upload-button
  }
  #file-chooser {
    display: none;
  }
  .content {
    margin-top: 10px;
    font-size: 14px;
    color: #666666;
    @apply --isu-upload-content
  }
  .file {
    margin-left: var(--isu-label-width, 120px);
    padding-left: 13px;
    position: relative;
    cursor: pointer;
  }
  iron-icon[icon='clear'] {
    display: none;
  }
  .file:hover {
    background-color: #f5f7fa;
  }
  .file:hover iron-icon[icon='check'] {
    display: none;
  }
  .file:hover iron-icon[icon='clear'] {
    display: inline-block;
    color: #fdb03d;
  }
  iron-icon {
    width: 18px;
  }
  .rightIcon {
    position: absolute;
    right: 10px;
  }
</style>
  <div class$="toolbar [[fontSize]]">
    <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class="isu-label">[[label]]</div>
    </template>
    <isu-button class$="choose-file [[fontSize]]" title="点击选择文件" on-click="_triggerChooseFile">选择文件</isu-button>
    <template is="dom-if" if="{{isUpload}}">
      <isu-button class$="upload-file [[fontSize]]" type="warning" on-click="upload" disabled="[[uploadReadonly]]">上传文件</isu-button>
    </template>
    
    <input type="file" on-change="_chooseFile" id="file-chooser" accept$="[[accept]]" multiple$="[[multiple]]">
  </div>
  <div class$="content [[fontSize]]">
    <template is="dom-repeat" items="[[files]]">
      <div class="file">
        <iron-icon icon="description"></iron-icon>
          [[item.name]]
        <iron-icon class="rightIcon" icon="clear" on-click="delete"></iron-icon>
        <iron-icon class="rightIcon" icon="check"></iron-icon>
      </div>
    </template>
    <slot name="list"></slot>
  </div>
        `
  }

  static get properties () {
    return {
      /**
       * Specifies a filter for what file types the user can pick from the file input dialog box
       *
       * @type {string}
       * */
      accept: {
        type: String
      },
      /**
       * Specifies that a user can enter more than one value in an <input> element
       *
       * @type {boolean}
       * @default false
       * */
      multiple: {
        type: Boolean,
        value: false
      },
      /**
       * The files that customer choose
       *
       * @type {array}
       * @default []
       * */
      files: {
        type: Array,
        value: [],
        notify: true
      },
      src: String,
      request: Object,
      response: {
        type: Object,
        notify: true
      },
      /**
       * The callback function after uploading
       *
       * @type {array}
       * @default []
       * */
      uploadCallback: {
        type: Function
      },
      /**
       * Whether to show the upload button or not
       *
       * @type {boolean}
       * @default true
       * */
      isUpload: {
        type: Boolean,
        value: true
      },
      /**
       * Whether upload button is readonly or not
       *
       * @type {boolean}
       * @default false
       * */
      uploadReadonly: {
        type: Boolean,
        value: false
      },
      /**
       * The label of the uploader.
       */
      label: {
        type: String
      },
      handleAs: {
        type: String
      }
    }
  }

  static get observers () {
    return []
  }

  ready () {
    super.ready()
  }

  _triggerChooseFile () {
    const fileChooser = this.$['file-chooser']
    fileChooser && fileChooser.click()
  }

  _chooseFile (e) {
    if (!this.multiple) {
      this.set('files', [e.target.files[0]])
    } else {
      this.files = Array.prototype.slice.call(e.target.files).concat(this.files)
    }
    this.set('response', null)
  }

  delete ({ model: { index } }) {
    this.$['file-chooser'].value = ''
    this.splice('files', index, 1)
  }

  upload () {
    const form = new FormData()
    if (!this.multiple) {
      form.append('file', this.files[0])
    } else {
      form.append('file', this.files)
    }
    if (this.request) {
      for (const key in this.request) {
        form.append(key, this.request[key])
      }
    }
    this.post({ url: this.src, data: form, handleAs: this.handleAs }, { loading: true }).then(res => {
      this.set('files', [])
      this.$['file-chooser'].value = ''
      this.set('response', res)
      this.isuTip.success('导入成功', 2500)
      this.uploadCallback && this.uploadCallback.call(this.domHost, res)
    }).catch(err => {
      this.isuTip.error(err, 2500)
    })
  }

  static get is () {
    return 'isu-upload'
  }
}

window.customElements.define(IsuUpload.is, IsuUpload)
