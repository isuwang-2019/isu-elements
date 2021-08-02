import { html, PolymerElement } from '@polymer/polymer'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import '@polymer/iron-icon/iron-icon'
import '@polymer/iron-icons/iron-icons'
import '@polymer/iron-icons/social-icons'
import { BaseBehavior } from './behaviors/base-behavior'
import './behaviors/isu-elements-shared-styles.js'
import { IsuFetch } from './isu-fetch'
import { CacheSearchUtil } from './utils/cacheSearchUtil'
import { PinyinUtil } from './utils/pinyinUtil'
import './isu-iron-fit'
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js'
import { TipBehavior } from './behaviors/tip-behavior'

/**

 Example:
 ```html
 <isu-picker id="picker" label="单选" value="1" attr-for-value="id" placeholder="请选择" clearable></isu-picker>
 <isu-picker id="picker1" label="多选" value="1,2,3,4" attr-for-value="id" multi placeholder="请选择" picker-meta='[{"field": "label", "label": "选项"}, {"field": "business", "label": "业务范围"}]'></isu-picker>
 <isu-picker id="pickerAll" label="多选" value="1,2,3,4" attr-for-value="id" show-all
 multi placeholder="请选择" picker-meta='[{"field": "label", "label": "选项"}, {"field": "business", "label": "业务范围"}]'></isu-picker>
 <isu-picker id="picker3" label="只读" value="1,2,3" attr-for-value="id" multi readonly></isu-picker>
 <isu-picker id="picker4" label="必填" value="1,2,3" attr-for-value="id" multi required enable-hotkey></isu-picker>
 <isu-picker id="pickerNum" label="限制多选数量"  attr-for-value="id" multi-limit="3" multi required prompt="公司不能为空" enable-hotkey></isu-picker>
 <isu-picker id="picker5" label="修改组件大小" multi="" attr-for-value="id" value="1,2,3,4,5"></isu-picker>
 <isu-picker id="picker6" label="默认" attr-for-value="id"></isu-picker>
 <isu-picker id="picker7" label="自定义搜索字段" attr-for-value="id"></isu-picker>
 <isu-picker id="picker8" query-by-value-url="/init.do" label="自定义初始数据源" attr-for-value="id"></isu-picker>
 <isu-picker id="picker9" label="通过接口搜索数据" query-by-value-url="/init.do" multi="" attr-for-value="id"></isu-picker>
 <isu-picker id="picker10" label="键盘快捷键操作" query-by-value-url="/api/listProduct" attr-for-value="id" keyword-path="request.keyword" result-path="success.result"
 fetch-param='{"request": {"pageRequest": {"limit": 10, "start": 0}}}'></isu-picker>
 ```

 ## Styling

 The following custom properties and mixins are available for styling:

 |Custom property | Description | Default|
 |----------------|-------------|----------|
 |`--isu-picker-width` | The width of the picker | 320px
 |`--isu-ui-font-family` | The font family of the picker | Microsoft YaHei
 |`--isu-ui-font-size` | The font size of the picker | 14px
 |`--isu-ui-bg` | The basic color of the selected tags,collapse tr`s color when hover tr | linear-gradient(315deg, var(--isu-ui-color_lightblue)  0%, var(--isu-ui-color_skyblue) 100%)
 |`--isu-ui-red` | The color of the selected tag`s delete shape when hover the tag | linear-gradient(315deg, #f9a7c3 0%, var(--isu-ui-color_pink) 100%);

 |`--isu-picker-input` | Mixin applied to the keyword input | {}
 |`--isu-picker-tag` | Mixin applied to the chosed tags | {}
 |`--isu-select-tag-deleter` | Mixin applied to the selected tag's delete tag | {}
 |`--isu-picker-dropdown` | Mixin applied to the dropdown table | {}
 |`--collapase-table-cell` | Mixin applied to the dropdown table's cell | {}
 |`--isu-view-text` | Mixin applied to the text when the readonly and is-view is true | {}

 * @customElement
 * @polymer
 * @demo demo/isu-picker/index.html
 */
class IsuPicker extends mixinBehaviors([BaseBehavior, TipBehavior], PolymerElement) {
  static get template () {
    return html`
      <style include="isu-elements-shared-styles">
        :host {
          display: flex;
          height: var(--isu-picker-height, var(--isu-default-line-height, 34px));
          line-height: var(--isu-picker-height,var(--isu-default-line-height, 34px));
          width: var(--isu-picker-width, 320px);
          font-family: var(--isu-ui-font-family), sans-serif;
          font-size: var(--isu-ui-font-size);
          position: relative;
          box-sizing: border-box;
        }
  
        .input-wrap {
          flex: 1;
          position: relative;
          display: flex;
          min-width: 0;
        }
  
        .input-container {
          flex: 1;
          display: flex;
          width: 100%;
        }
  
        #keywordInput {
          flex: 1;
          min-width: 10px;
          height: 22px;
          line-height: 22px;
          padding: 0;
          margin: 2px;
  
          border: none;
          outline: none;
          @apply --isu-picker-input;
        }
  
        /*标签容器*/
        .tags-input {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
  
          background: #FFF;
          padding: 2px;
          overflow-y: auto;
  
          border: 1px solid #CCC;
          border-radius: 4px;
          position: relative;
          @apply --isu-picker-tags-input;
        }
        
        .tags-input::-webkit-scrollbar {
          display: none;
        }
        
        .tag {
          color: #fff;
          background: var(--isu-ui-bg);
          border-radius: 4px;
  
          margin: 2px;
          padding: 0 4px;
          min-height: 22px;
          line-height: 22px;
          /*max-width: calc(var(--isu-picker-width)- 30px);*/
  
          display: flex;
          cursor: default;
          word-break: break-all;
          @apply --isu-picker-tag;
        }
  
        .tag-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          @apply --isu-picker-tag-name;
        }
  
        .tag-deleter {
          margin-left: 6px;
          width: 18px;
          color: #fff;
          cursor: pointer;
          @apply --isu-select-tag-deleter;
        }
  
        .tag-deleter:hover {
          color: var(--isu-ui-red);
        }
  
        #picker-collapse {
          display: flex;
          position: absolute;
          /*min-width: 100%;*/
          margin-top: 1px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 100;
          padding: 0;
          background: white;
          color: black;
  
          visibility: visible;
          opacity: 1;
          /*transition: all 150ms ease-in;*/
          @apply --isu-picker-dropdown;
        }
  
        #picker-collapse[hidden] {
          visibility: hidden;
          height: 0;
          opacity: 0;
        }
  
        /*显示下拉面板*/
        :host .show {
          opacity: 1;
          visibility: visible;
        }
  
        .collapse-content__table {
          width: 100%;
          font-size: 12px;
          border-collapse: separate;
          border-spacing: 0;
          text-align: left;
          border-radius: 4px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        }
  
        .collapse-table__cell {
          white-space: nowrap;
          text-align: center;
          padding: 6px 10px;
          line-height: 1.42857143;
          border-bottom: 1px solid #ddd;
          @apply --collapase-table-cell
        }
  
        th.collapse-table__cell {
          padding-top: 12px;
          font-size: 1.1em;
        }
  
        tbody > tr:hover {
          background: var(--isu-ui-bg);
          color: #fff;
          cursor: pointer;
        }
  
        tr.candidate-item--focus {
          background: var(--isu-ui-bg) !important;
          color: #fff;
        }
  
        .table-hotkey {
          width: 40px;
        }
        
        #placeholder[hidden] {
          display: none;
        }
  
        #placeholder {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          color: #999;
          opacity: 1;
          padding: 0 6px;
          overflow: hidden;
          white-space: nowrap;
        }
  
        :host([required]) .input-wrap::before {
          content: "*";
          color: red;
          position: absolute;
          left: -8px;
          line-height: inherit;
          @apply --isu-required
        }
        
        :host([data-invalid]) .tags-input {
          border-color: var(--isu-ui-color_pink);
        }
        :host([show-all]) {
          height: auto
        }
        
        .clear {
          width: 12px;
          padding: 0 5px;
          z-index: 1;
          position: absolute;
          right: 5px;
          top: -2px;
        }
        .icon-clear {
          width: 12px;
          height: 12px;
          border: 1px solid #ccc;
          border-radius: 50%;
          color: #ccc;
          display: none;
        }
        :host([clearable]) .input-wrap:hover .icon-clear {
          display: inline-block;
        }
        .view-text {
          @apply --isu-view-text
       }
       .module-tip {
         color: rgb(199, 14, 119);
         text-align: center;
         border-bottom: 1px dashed #ddd;
         padding: 6px 20px;
         line-height: 17px;
       }
      </style>
      <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class="isu-label-div"><span class$="isu-label [[fontSize]]">[[label]]</span><span class="isu-label-after-extension"></span></div>
      </template>
      <div class$="input-wrap [[fontSize]]" id="select__container">
        <div class="input-container">
          <div class="tags-input" on-click="__openCollapse" id="tags-input">
            <div id="placeholder" hidden="[[isExistTruthy(value, _userInputKeyword)]]">[[placeholder]]</div>
            <template is="dom-repeat" items="[[ selectedValues ]]" index-as="index">
              <span class="tag" data-args="[[ __calcTagName(item) ]]" on-contextmenu="_contextMenuHandler">
                  <span class="tag-name" title="[[ getValueByKey(item, attrForLabel) ]]">
                    [[ __calcTagName(item) ]]
                  </span>
                  <iron-icon class="tag-deleter" icon="icons:clear" on-click="_deleteTag"></iron-icon>
              </span>
            </template>
            <input id="keywordInput" value="{{ _userInputKeyword::input }}" autocomplete="off" on-focus="__inputFocus">
            <div class="clear">
              <template is="dom-if" if="[[ isExistTruthy(_userInputKeyword) ]]">
                <iron-icon class="icon-clear" icon=icons:clear on-click="clear"></iron-icon>
              </template>
            </div>
          </div> <!-- class=tags-input -->
          <div class="mask"></div>
        </div>
  
        <isu-iron-fit id="picker-collapse" hidden auto-fit-on-attach vertical-align="auto" horizontal-align="auto" class="selected" no-overlap dynamic-align>
          <table class="collapse-content__table">
            <thead>
            <template is="dom-if" if="[[showModuleTip]]">
              <tr>
                  <th class="module-tip" part="module-tip" colspan$="[[ colspanComputed(enableHotkey, pickerMeta)]]">[[moduleTipMsg]]</th>
              </tr>
            </template>
            <tr>
              <template is="dom-repeat" items="[[pickerMeta]]">
                <th class="collapse-table__cell">[[item.label]]</th>
              </template>
              <template is="dom-if" if="[[ enableHotkey ]]">
                <th class="collapse-table__cell table-hotkey">快捷键</th>
              </template>
            </tr>
            </thead>
            <tbody>
            <template is="dom-repeat" items="[[_displayItems]]" as="row">
              <tr id="candidate-item__[[index]]" on-click="_selectCollapseItem">
                <template is="dom-repeat" items="[[pickerMeta]]" as="col">
                  <td class="collapse-table__cell">[[ getValueByPath(row, col.field, '', col.format) ]]</td>
                </template>
                <template is="dom-if" if="[[ enableHotkey ]]">
                  <td class="collapse-table__cell table-hotkey">[[_getHotKey(index)]]</td>
                </template>
              </tr>
            </template>
            </tbody>
          </table>
          <div class="prompt-tip__container" data-prompt$="[[prompt]]">
            <div class="prompt-tip">
              <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
              [[prompt]]
            </div>
          </div>
        </isu-iron-fit>
      </div>
      <template is="dom-if" if="[[_isView(isView, readonly)]]">
        <div class="view-text">
           <span>[[getViewLabels(selectedValues, attrForLabel, joinConnector)]]</span>
        </div>
      </template>
`
  }

  static get properties () {
    return {
      /**
       * Chinese pinyin plugin
       */
      _pinyinUtil: {
        type: Object,
        readOnly: true,
        value: function () {
          return new PinyinUtil()
        }
      },
      /**
       * Cache search plugin
       */
      _cacheSearchUtil: {
        type: Object,
        readOnly: true,
        value: function () {
          return new CacheSearchUtil()
        }
      },
      /**
       * The component that sends the request and simulates the data
       */
      _fetchUtil: {
        type: Object,
        readOnly: true,
        value: function () {
          return new IsuFetch()
        }
      },
      /**
       * The label of the picker.
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the select.
       * @type {String}
       */
      placeholder: {
        type: String
      },
      /**
       *
       * The selected value of this select,  if `multi` is true,
       * the value will join with comma ( `selectedValues.map(selected => selected[this.attrForValue]).join(',')` ).
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * The selected value objects of this select.
       * @type {array}
       */
      selectedValues: {
        type: Array,
        notify: true
      },
      /**
       * The selected item.
       * @type {object}
       */
      selectedItem: {
        type: Object,
        notify: true
      },
      /**
       * A url for searching data with user input keywords, the response data of the request should be json.
       * @type {string}
       */
      queryByKeywordUrl: {
        type: String
      },
      /**
       * A url for fetching data by value, the response data of the request should be json.
       * @type {string}
       */
      queryByValueUrl: {
        type: String
      },
      /**
       * The candidate selection of this picker.
       * @type {array}
       */
      items: {
        type: Array
      },
      /**
       * The data set displayed currently in the drop-down panel（The first 10 of the items are displayed by default）
       * @type {array}
       */
      _displayItems: {
        type: Array
      },
      /**
       * The search keywords input by the user
       * @type {string}
       *
       */
      _userInputKeyword: {
        type: String
      },
      /**
       * Fields to build index for pinyin plugin.
       * @type {array}
       */
      fieldsForIndex: {
        type: Array
      },
      /**
       * The fields shown in the drop-down panel，default: [{"field": "label", "label": "选项"}]
       * @type {array}
       * @default [{"field": "label", "label": "选项"}]
       */
      pickerMeta: {
        type: Array,
        value: function () {
          return [{ field: 'label', label: '选项' }]
        }
      },
      /**
       * Attribute name for value.
       * @type {string}
       * @default 'value'
       */
      attrForValue: {
        type: String,
        value: 'value'
      },
      /**
       * Attribute name for label.
       * @type {object}
       * @default 'label'
       */
      attrForLabel: {
        type: Object,
        value: 'label'
      },
      /**
       * Whether to disable pinyin search or not
       *
       * @type {boolean}
       * @default false
       */
      disablePinyinSearch: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true, if the selection is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Set to true, if the picker is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * If true, multiple selections are allowed.
       * @type {boolean}
       * @default false
       */
      multi: {
        type: Boolean,
        value: false
      },
      /**
       * The current option focus in the dropdown panel.
       */
      __focusIndex: {
        type: Number,
        value: 0
      },
      /**
       * If true, hotkeys for selecting items are allowed.
       * @type {boolean}
       * @default false
       */
      enableHotkey: {
        type: Boolean,
        value: false
      },
      /**
       * The limit number that customers can choose if the selection is multiple.
       *
       * @type {number}
       * @default
       */
      multiLimit: {
        type: Number
      },
      /**
       * url`s params
       * @type {Object}
       * @default
       */
      fetchParam: {
        type: Object
      },

      /**
       * queryByKeywordUrl query params name ,default 'keyword',such as `/queryBykeyword?keyword = `
       */
      keywordPath: {
        type: String,
        value: 'keyword'
      },
      /**
       * queryByValueUrl query params name,default 'ids',such as `/queryByValues?ids = `
       */
      valuePath: {
        type: String,
        value: 'ids'
      },

      resultPath: {
        type: String
      },
      /**
       * shortcut key
       * @type {string}
       * @default 'enter'
       */
      shortcutKey: {
        type: String,
        value: 'Enter'
      },
      inputChinese: Boolean,
      /**
       * The prompt tip to show when input is invalid.
       * @type String
       */
      prompt: {
        type: String
      },
      /**
       * The prompt tip's position. top/bottom
       * @type String
       * @default ''
       */
      promptPosition: {
        type: String,
        value: ''
      },
      /**
       * The mode of the request, eg: POST/GET
       * @type String
       * @default ''
       */
      method: {
        type: String,
        value: 'GET'
      },
      /**
       * The text mode display requires readonly=true to take effect
       * @type {boolean}
       * @default false
       * */
      isView: {
        type: Boolean,
        value: false
      },
      /**
       * The connector to connect labels when the isView=true, eg: "苹果，香蕉，梨"
       * @type {string}
       * @default ','
       * */
      joinConnector: {
        type: String,
        value: ','
      },
      /**
       * If true hides the component， default false
       */
      hidden: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * If you do not have permissions, the component does not display
       * @type Boolean
       * @default true
       */
      permission: {
        type: Boolean,
        value: true,
        observer: '_permissionChange'
      },
      /**
       * Ajax headers
       * @type Object
       * @default
       */
      headers: {
        type: Object
      },
      /**
       * 0 是否为有效value值，默认为否
       */
      zeroIsValue: {
        type: Boolean,
        value: false
      },
      /**
       * 选择选项的长度，默认10
       */
      displayItemsLength: {
        type: Number,
        value: 10
      },
      showModuleTip: {
        type: Boolean,
        value: false
      },
      moduleTipMsg: {
        type: String,
        value: '支持全拼、简拼搜索，空格分词'
      }
    }
  }

  static get is () {
    return 'isu-picker'
  }

  static get observers () {
    return [
      '_queryByKeywordUrlChanged(queryByKeywordUrl)',
      '_itemsChanged(items)',
      '_userInputKeywordChanged(_userInputKeyword)',
      '_selectedValuesChanged(selectedValues.splices)',
      '_valueChanged(value)',
      'getInvalidAttribute(required, value)',
      '__isViewChanged(isView,readonly)'
    ]
  }

  connectedCallback () {
    super.connectedCallback()

    this.$.keywordInput.addEventListener('keydown', this._keyDownHandler.bind(this))
    this.$.keywordInput.addEventListener('compositionstart', () => { this.inputChinese = true })
    this.$.keywordInput.addEventListener('compositionend', () => { this.inputChinese = false })

    this.addEventListener('blur', e => {
      e.stopPropagation()
      setTimeout(() => { // 解决blur事件和click事件冲突的问题
        if (this.shadowRoot.activeElement && this.shadowRoot.activeElement.id === 'keywordInput') return
        this.displayCollapse(false)
        this._userInputKeyword = ''
      }, 200)
    })

    const target = dom(this.$['picker-collapse']).rootTarget
    const myFit = this.$['picker-collapse']
    myFit.positionTarget = target || this.$['tags-input']
  }

  _contextMenuHandler (e) {
    e.preventDefault()
    const text = e.currentTarget.dataArgs
    const oInput = document.createElement('input')
    oInput.value = text
    document.body.appendChild(oInput)
    oInput.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    oInput.style.display = 'none'
    this.isuTip.success('复制成功', 1000)
  }

  getViewLabels (items = [], attrForLabel, connector) {
    const labels = items.map(item => this.__calcTagName(item))
    return labels.join(connector)
  }

  __calcTagName (item) {
    const attrForLabel = this.attrForLabel
    if (this.isFunction(attrForLabel)) {
      return attrForLabel.call(this, item)
    }
    return this.getValueByKey(item, attrForLabel)
  }

  _mkRequest (url, data) {
    if (this.method === 'GET') {
      return {
        url: url,
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          ...this.headers
        },
        credentials: 'include',
        body: JSON.stringify(data)
      }
    }
    return {
      url: url,
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=utf-8',
        'Cache-Control': 'no-cache',
        ...this.headers
      },
      credentials: 'include',
      body: JSON.stringify(data)
    }
  }

  async _queryByKeywordUrlChanged (queryByKeywordUrl) {
    if (!queryByKeywordUrl) return
    this.debounce('__debounceFetchByKeyword', this.fetchByKeyword, 250)
  }

  async _getSelectedForItems (itemsArr) {
    try {
      const selectedValues = await this.fetchSelectedValues()
      const items = itemsArr || []
      // 判断是否有交集
      const flag = items.filter(d => selectedValues.find(i => `${i[this.attrForValue]}` === `${d[this.attrForValue]}`)).length > 0
      const addItems = items.filter(d => !selectedValues.find(i => `${i[this.attrForValue]}` === `${d[this.attrForValue]}`))
      this.items = flag ? selectedValues.concat(addItems) : items
      return selectedValues
    } catch (e) {
      console.error(e)
    }
  }

  async _itemsChanged (items = []) {
    this._displayItems = items.slice(0, this.displayItemsLength || 10)
    // 初始化一次选中项
    if (this.value !== undefined && this.value !== null && this.value !== '') {
      if (!this.zeroIsValue && this.value === 0) return
      await this._valueChanged(this.value)
    }
    // 清空缓存插件的缓存
    this._cacheSearchUtil.resetCache()

    items.forEach(item => this._cacheSearchUtil.addCacheItem(item, this._loadPinyinKeys(item, this.fieldsForIndex)))
  }

  _userInputKeywordChanged (_userInputKeyword) {
    if (this._userInputKeyword.length > 0) {
      this.displayCollapse(true)
    }
    this.debounce('__debounceFetchByKeyword', this.fetchByKeyword, 250)
  }

  /**
   * query by Keyword
   * @return {Promise<void>}
   * @private
   */
  async fetchByKeyword () {
    try {
      if (this.queryByKeywordUrl) {
        const requestObj = this.fetchParam
        const req = this.setValueByPath(this.mkObject(this.keywordPath, requestObj), this.keywordPath, this._userInputKeyword || '')
        const request = this._mkRequest(this.queryByKeywordUrl, req)
        const data = await this._fetchUtil.fetchIt(request).then(res => {
          return res.json().catch(err => {
            console.warn(`'${err}' happened, but no big deal!`)
            return []
          })
        })
        const candidateItems = this.resultPath ? this.getValueByPath(data, this.resultPath, []) : data || []
        const _displayItems = candidateItems
        this._displayItems = _displayItems.slice(0, this.displayItemsLength || 10)
        this.items = candidateItems
      } else {
        const matched = this._cacheSearchUtil.search(this._userInputKeyword, ' ')
        this._displayItems = matched.slice(0, this.displayItemsLength || 10)
        // this._switchFocusItemAt(0)
      }
      setTimeout(this.$['picker-collapse'].fixPosition.bind(this.$['picker-collapse']), 0)
    } catch (err) {
      console.error(err)
    }
  }

  async fetchSelectedValues () {
    const { queryByValueUrl, valuePath, value, resultPath, fetchParam } = this
    if (valuePath && value) {
      const req = this.setValueByPath(this.mkObject(valuePath, fetchParam), valuePath, value ? `${value}` : '')
      const request = this._mkRequest(queryByValueUrl, req)
      const selectedValues = await this._fetchUtil.fetchIt(request).then(res => {
        return res.text().then(text => {
          return text ? JSON.parse(text) : []
        })
      }).then(data => {
        return resultPath ? this.getValueByPath(data, resultPath, []) : data
      })
      return selectedValues
    }
    return []
  }

  _selectedValuesChanged () {
    const { attrForValue } = this
    if (this.selectedValues.length > 0) {
      // value去重
      this.value = Array.from(new Set(this.selectedValues.map(selected => selected[attrForValue]).filter(item => !this.isEmptyObject(item)))).join(',')
      this.selectedItem = this.selectedValues[this.selectedValues.length - 1]
    } else {
      this.value = ''
      this.selectedItem = ''
    }
    this.displayCollapse(false)
  }

  /**
   * value属性变化监听函数
   */
  async _valueChanged (value) {
    const { attrForValue } = this
    // 本地模式，或远程数据已经就位
    if (this.items && this.items.length) {
      const flatValues = [...(new Set(String(value).split(',')))]
      const selectedValues = this.selectedValues || []
      const dirty = selectedValues.map(selected => selected[attrForValue]).join(',')
      if (dirty !== value) {
        // 判断是否有交集
        const addSelectedItemTemp = selectedValues.filter(selectedItem => !this.items.find(item => `${item[attrForValue]}` === `${selectedItem[attrForValue]}`))
        const itemsTemp = Array.from(new Set([...addSelectedItemTemp, ...this.items]))
        const selectedValuesTemp = flatValues.map(val => itemsTemp.find(item => `${item[attrForValue]}` === `${val}`))
          .filter(selected => !!selected)
        if (selectedValuesTemp.length !== flatValues.length) {
          const newSelectedValues = await this._getSelectedForItems([...itemsTemp])
          this.selectedValues = newSelectedValues
        } else {
          this.selectedValues = selectedValuesTemp
        }
      }
    }

    this.getInvalidAttribute(value)
  }

  _selectItemAt (index) {
    if (index >= 0 && index < this._displayItems.length) {
      this._switchFocusItemAt(index)
      this._selectItem(this._displayItems[index])
    }
  }

  /**
   * 选择选项
   * @param item
   */
  _selectItem (item) {
    // not yet selected
    if (!~(this.selectedValues || []).findIndex(selected => `${selected[this.attrForValue]}` === `${item[this.attrForValue]}`)) {
      if (this.multi && this.selectedValues) {
        this.push('selectedValues', item)
      } else {
        this.selectedValues = [item]
      }
    }

    this.displayCollapse(false)
    if (this.multi) this.__focusOnKeywordInput()
    this._userInputKeyword = ''
  }

  /**
   * 切换焦点到第n个元素，从0开始
   * @param index
   * @private
   */
  _switchFocusItemAt (index) {
    // setTimeout(() => {
    //   const maxIndex = (this._displayItems || []).length
    //   const newIndex = (maxIndex + index) % maxIndex
    // this.root.querySelectorAll("tr.candidate-item--focus")
    //   .forEach(e => e.classList.remove('candidate-item--focus'));
    //
    // const newFocusItem = this.root.querySelector(`#candidate-item__${newIndex}`);
    // if (newFocusItem != null) {
    //   newFocusItem.classList.add('candidate-item--focus');
    //   this.__focusIndex = newIndex;
    // }
    // }, 0)
  }

  _isPickerCollapseHidden () {
    return this.$['picker-collapse'].hidden
  }

  __openCollapse ({ target: { classList } }) {
    if (classList.contains('tag-deleter')) return

    this.__focusOnKeywordInput()
  }

  async __inputFocus () {
    if (this.multiLimit && this.selectedValues && this.multiLimit <= this.selectedValues.length) return
    // await this.fetchByKeyword()
    this.displayCollapse(true)
    // this._switchFocusItemAt(0);
  }

  __getElemPos (obj) {
    const { x, y } = obj.getBoundingClientRect()
    return {
      left: x,
      top: y + 2
    }
  }

  __focusOnKeywordInput () {
    this.$.keywordInput.focus()
  }

  _selectCollapseItem (event) {
    event.stopPropagation()
    this._selectItem(event.model.row)
    this.displayCollapse(false)
    this.blur()
  }

  /**
   * 输入框键盘按键事件
   * @param event
   * @private
   */
  _keyDownHandler (event) {
    if (this.inputChinese) return
    if (this.shortcutKey !== event.key && !this.$['picker-collapse'].hidden) event.stopPropagation()

    const key = event.key
    if (event.altKey || key === this.shortcutKey) {
      event.preventDefault()
    }

    const collapseOpend = !this._isPickerCollapseHidden()
    if (collapseOpend && this.enableHotkey && event.altKey) {
      const ind = event.code.replace(/[A-Za-z]*/g, '') - 1
      this._selectItemAt(ind)
    } else {
      switch (key) {
      case 'ArrowUp':
        collapseOpend && this._switchFocusItemAt(this.__focusIndex - 1)
        break

      case 'ArrowDown':
        if (collapseOpend) {
          this._switchFocusItemAt(this.__focusIndex + 1)
        } else {
          this._switchFocusItemAt(0)
          this.displayCollapse(true)
        }
        break

      case this.shortcutKey:
        if (collapseOpend && this._displayItems.length > 0 && this.__focusIndex < this._displayItems.length) {
          this._selectItemAt(this.__focusIndex)
        }
        break

      case 'Backspace':
        if (this._userInputKeyword === undefined || this._userInputKeyword.length === 0) {
          this.deleteLastTag()
        }

        break
      }
    }
  }

  /**
   * 给对象根据fieldsForIndex给对应的字段做拼音缓存（字段值，字段值全拼和拼音首字母）
   */
  _loadPinyinKeys (item, fieldsForIndex = []) {
    let keys = []; let values = fieldsForIndex.map(sf => item[sf])

    values = values.length === 0 ? Object.values(item) : values

    if (this.disablePinyinSearch) {
      keys = values.map(value => String(value))
    } else {
      values.forEach(
        value => {
          keys = keys.concat(
            String(value),
            this._pinyinUtil.convert2CompletePinyin(value),
            this._pinyinUtil.convert2PinyinAbbreviation(value)
          )
        }
      )
    }

    return keys
  }

  /**
   * Delete the last selected tag.
   */
  deleteLastTag () {
    if (this.selectedValues && this.selectedValues.length > 0) {
      this.pop('selectedValues')
    }
  }

  /**
   * 删除Tag项，事件处理函数
   */
  _deleteTag (e) {
    const item = e.model.item
    const value = this.getValueByKey(item, this.attrForValue)
    const ind = this.selectedValues.findIndex(selected => selected[this.attrForValue] === value)
    this.splice('selectedValues', ind, 1)
    if (!this.multi || (this.multi && this.selectedValues.length === 0)) this._userInputKeyword = ''
  }

  _getHotKey (index) {
    return 'Alt+' + (index + 1)
  }

  /**
   * Open or close the collapse
   * @param {boolean} display  true to open the collapse.
   */
  displayCollapse (display) {
    this.$['picker-collapse'].hidden = !display
  }

  /**
   * Toggle collapse. Side effect: the picker input will get a focus.
   */
  toggleCollapse () {
    const hidden = this.$['picker-collapse'].hidden
    this.$['picker-collapse'].hidden = !hidden
    this.__focusOnKeywordInput()
  }

  /**
   * Set focus to picker.
   */
  doFocus () {
    this.__focusOnKeywordInput()
  }

  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @return {boolean}
   */
  validate () {
    return this.required ? !!this.value : true
  }

  __isViewChanged (isView, readonly) {
    this.$.select__container.style.display = (this.readonly && isView) ? 'none' : 'flex'
  }

  _isView (isView, readonly) {
    return isView && readonly
  }

  _permissionChange (permission) {
    this.set('hidden', !permission)
  }

  colspanComputed (enableHotkey, pickerMeta) {
    return enableHotkey ? this.getArrayLength(pickerMeta) + 1 : this.getArrayLength(pickerMeta)
  }

  clear (e) {
    e.stopPropagation()
    this._userInputKeyword = ''
  }
}

window.customElements.define(IsuPicker.is, IsuPicker)
