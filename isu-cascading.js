import { html, PolymerElement } from '@polymer/polymer'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@polymer/iron-icon'
import '@polymer/iron-icons'
import '@polymer/paper-dialog'
import { IsuFetch } from './isu-fetch'

import { BaseBehavior } from './behaviors/base-behavior'
import './behaviors/isu-elements-shared-styles.js'

/**
 * `isu-cascading`
 *
 * ```html
 *  <isu-cascading class="isu-cascading" label="地址" id="cascading" attr-for-label="label" attr-for-value="value" separator=">" required show-all-levels></isu-cascading>
 *
 * ```
 *
 * @customElement
 * @polymer
 * @demo demo/isu-cascading/index.html
 */
class IsuCascading extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
      <style include="isu-elements-shared-styles">
        :host {
          font-family: var(--isu-ui-font-family), sans-serif;
          font-size: var(--isu-ui-font-size);
          display: flex;
          height: var(--isu-cascading-height, var(--isu-default-line-height, 34px));
          line-height: var(--isu-cascading-height, var(--isu-default-line-height, 34px));
          width: var(--isu-cascading-width, 320px);
          min-width: 200px;
        }
        
        :host .cascade {
          position: relative;
        }
        
        .cascading__container {
          flex: 1;
          display: flex;
          align-items: center;
          line-height: inherit;
          min-width: 200px;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 2px 5px;
          position: relative;
          cursor: pointer;
        }
        
        :host([readonly]) .cascading__container {
          pointer-events: none;
          opacity: 0.5;
          z-index: 10;
          cursor: no-drop;
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
        
        #targetDialog {
          position: absolute;
          bottom: -5px;
          left: 0;
          width: inherit;
        }
        
        :host([opened]) .caret {
          transform: rotate(180deg);
          transition: transform .2s ease-in-out;
        }
        
        .caret {
          transition: transform .2s ease-in-out;
          color: var(--isu-ui-color_skyblue);
          position: absolute;
          right: 0;
          top: 0;
          height: 34px;
          line-height: 34px;
        }
        
        #boxDialog {
          position: absolute!important;
          height: 206px;
          margin: 0;
          max-width: initial!important;
        }
        
        .dialog-container {
          margin: 0;
          padding: 0;
          display: flex;
        }
        
        .view-container {
          flex: 1;
          height: 206px;
          min-width: 160px;
          margin: 0;
          padding: 8px 0;
          box-sizing: border-box;
          border-right: 1px solid #ccc;
          background: #fff;
          @apply --isu-view-container;
        }
        
        .view-container:last-of-type {
          border-right: none;
        }
        
        .view-list {
          height: 190px;
          overflow-y: auto;
        }
        .view-item {
          position: relative;
          padding: 0 12px;
          height: 30px;
          line-height: 30px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .view-item:hover, .view-item-active {
          color: var(--isu-ui-color_skyblue);
          font-weight: bold;
        }
        .chevron-iron {
          position: absolute;
          right: 0;
          height: 30px;
          line-height: 30px;
        }
        :host([required]) .cascading__container::before {
          content: "*";
          color: red;
          position: absolute;
          left: -8px;
          line-height: inherit;
          @apply --isu-required
        }
        
        :host([data-invalid]) .cascading__container {
          border-color: var(--isu-ui-color_pink);
        }
        
        .icon-clear {
          position: absolute;
          right: 5px;
          width: 12px;
          height: 12px;
          line-height: 34px;
          border: 1px solid #ccc;
          border-radius: 50%;
          color: #ccc;
          display: none;
        }
        
        .cascading__container:hover .icon-clear {
          display: inline-block;
        }
        .cascading__container:hover .caret {
          display: none;
        }
        :host([data-invalid]) #innerInput {
          border-color: var(--isu-ui-color_pink);
        }
      </style>
      
      <template is="dom-if" if="[[ toBoolean(label) ]]">
         <div class="isu-label-div"><span class$="isu-label [[fontSize]]">[[label]]</span><span class="isu-label-after-extension"></span></div>
      </template>
      <div class$="cascading__container [[fontSize]]" on-click="__onInputClick">
        <div id="placeholder">[[placeholder]]</div>
        <div class="box-value">[[showLabel]]</div>
        <iron-icon class="caret" icon="icons:expand-more"></iron-icon>
        <iron-icon class="icon-clear" icon=icons:clear on-click="clear"></iron-icon>
        <div id="targetDialog">
        </div>
      </div>
      
      <div class$="cascade [[fontSize]]">
        <paper-dialog id="boxDialog" no-overlap horizontal-align="auto" vertical-align="auto" on-iron-overlay-closed="__cancelClick">
        <div class="dialog-container">
          <template is="dom-repeat" items="{{treeItems}}" as="tree" index-as="treeIndex">
            <div class="view-container">
              <div class="view-list">
                <template is="dom-repeat" items="[[tree]]">
                  <template is="dom-if" if="[[__isHover(expandTrigger)]]">
                    <div class$="view-item [[__setViewClass(item.__select)]]" on-mouseover="__viewItemClick">
                      [[getValueByKey(item, attrForLabel)]]
                      <template is="dom-if" if="[[item.children]]">
                        <iron-icon class="chevron-iron" icon="icons:chevron-right"></iron-icon>
                      </template>
                    </div>
                  </template>
                  <template is="dom-if" if="[[!__isHover(expandTrigger)]]">
                    <div class$="view-item [[__setViewClass(item.__select)]]" on-click="__viewItemClick">
                      [[getValueByKey(item, attrForLabel)]]
                      <template is="dom-if" if="[[item.children]]">
                        <iron-icon class="chevron-iron" icon="icons:chevron-right"></iron-icon>
                      </template>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </template>
        </div>
      </paper-dialog>
        <div class="prompt-tip__container" data-prompt$="[[prompt]]">
          <div class="prompt-tip">
            <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
            [[prompt]]
          </div>
         </div>
      </div>
    `
  }

  static get properties () {
    return {
      /**
       * Label of the cascading element
       *
       * @type String
       * @default
       */
      label: {
        type: String
      },
      /**
       * Placeholder of the cascading container
       *
       * @type String
       * @default 请选择
       */
      placeholder: {
        type: String,
        value: '请选择'
      },
      /**
       * if is true, the collapse cascading will open.
       *
       * @type Boolean
       * @default false
       */
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * The items of the cascading, is passed in by the customer.
       *
       * @type Array
       * @default []
       */
      items: {
        type: Array,
        value: []
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
       * The items of the cascading, equals to items. If 'lazy' is true, can also be passed in by the customer.
       *
       * @type Array
       * @default []
       */
      treeItems: {
        type: Array,
        notify: true,
        value: []
      },
      /**
       * The attrForValue array selected from the selectedValues. eg: ["zhinan", "shejiyuanze", "fankui"]
       *
       * @type Array
       * @default []
       */
      value: {
        type: Array,
        notify: true,
        value: []
      },
      /**
       * The array selected from the treeItems.
       *
       * @type Array
       * @default []
       */
      selectedValues: {
        type: Array,
        notify: true,
        value: []
      },
      /**
       * The value showed in the cascading container input. eg: 指南>设计原则>反馈
       *
       * @type Array
       * @default []
       */
      valueLabel: {
        type: String,
        notify: true
      },
      lazy: Boolean,
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
       * The prompt tip to show when input is invalid.
       * @type {String}
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
       *
       * Attribute name for label.
       *
       * @type {string}
       * @default 'label'
       */
      attrForLabel: {
        type: String,
        value: 'label'
      },
      /**
       *
       * Separator for the valueLabel
       *
       * @type String
       * @default /
       */
      separator: {
        type: String,
        value: '/'
      },
      /**
       *
       * Is required
       *
       * @type Boolean
       * @default false
       */
      required: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       *
       * Is readonly
       *
       * @type Boolean
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       *
       * The way the secondary menu is expanded(click/hover)
       *
       * @type String
       * @default click
       */
      expandTrigger: {
        type: String,
        value: 'click'
      },
      /**
       * Show the whole path of the selected value in the input box. Show the last path if it is false.
       *
       * @type Boolean
       * @default false
       * */
      showAllLevels: {
        type: Boolean,
        value: false
      },
      /**
       * Values displayed in the input box
       * @type String
       * @default
       * */
      showLabel: {
        type: String,
        notify: true
      },
      src: {
        type: String
      },
      fetchParam: {
        type: Object,
        notify: true
      },
      keywordPath: {
        type: String,
        value: 'keyword'
      },
      /**
       * Whether to get data dynamically internally
       * @type {boolean}
       * @default false
       * */
      isInnnerDynamicAppendData: {
        type: Boolean,
        value: false
      },
      /**
       * Whether to get data dynamically outside
       * @type {boolean}
       * @default false
       * */
      isDynamicAppendData: {
        type: Boolean,
        value: false
      },
      /**
       * The parent element of the currently clicked option
       * @type {object}
       * @default
       * */
      currentClickViewElement: {
        type: Object,
        notify: true
      }
    }
  }

  static get observers () {
    return [
      '__itemsChanged(items)',
      '__valueChanged(value)',
      '__treeItemsChanged(treeItems)',
      '__srcChanged(src)'
    ]
  }

  __itemsChanged () {
    if (this.items.length) this.set('treeItems', [this.items])
  }

  __valueChanged (value) {
    this.getInvalidAttribute()

    if (this.treeItems && this.treeItems.length && !this.lazy && value) {
      const treeItems = [].concat(this.treeItems); const selectedValues = []
      value.forEach((item, index) => {
        const findIndex = treeItems[index].findIndex(itm => itm[this.attrForValue] === item)
        treeItems[index][findIndex].__select = true
        selectedValues.push(treeItems[index][findIndex])
        if (treeItems[index][findIndex].children) treeItems.push(treeItems[index][findIndex].children)
      })
      this.set('selectedValues', selectedValues)
      this.set('valueLabel', selectedValues.map(itm => itm[this.attrForLabel]).join(this.separator))
      this.set('treeItems', treeItems)
      const lastLevelValue = (selectedValues.length > 0 && selectedValues[selectedValues.length - 1][this.attrForLabel]) || ''
      this.showLabel = this.showAllLevels ? this.valueLabel : lastLevelValue
      this.$.placeholder.hidden = lastLevelValue
    }
  }

  __treeItemsChanged (treeItems) {
    if (treeItems && treeItems.length && this.lazy && this.value) {
      const selectedValues = []
      this.value.forEach((item, index) => {
        const findIndex = treeItems[index].findIndex(itm => itm[this.attrForValue] === item)
        if (treeItems[index] && treeItems[index].length && findIndex >= 0) {
          treeItems[index][findIndex].__select = true
          selectedValues.push(treeItems[index][findIndex])
        }
      })
      this.set('selectedValues', selectedValues)
      this.set('valueLabel', selectedValues.map(itm => itm[this.attrForLabel]).join(this.separator))
      this.set('treeItems', treeItems)
      const lastLevelValue = selectedValues.length && selectedValues[selectedValues.length - 1][this.attrForLabel]
      this.$.placeholder.hidden = lastLevelValue
      this.showLabel = this.showAllLevels ? this.valueLabel : lastLevelValue
    }
  }

  _mkRequest (data, src) {
    return {
      url: src,
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=utf-8',
        'Cache-Control': 'no-cache'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    }
  }

  __srcChanged (src) {
    if (!src) return
    const request = this._mkRequest(this.fetchParam, src)
    this._fetchUtil.fetchIt(request)
      .then(res => res.json())
      .then(data => {
        let items
        if (this.resultPath) {
          items = this.getValueByPath(data, this.resultPath, [])
        } else {
          items = data || []
        }
        const findIndex = items.findIndex(item => item[this.attrForValue] == this.value)
        if (findIndex >= 0) {
          items = [items[findIndex]].concat(items)
          items.splice(findIndex + 1, 1)
        }
        this.items = items
      })
      .catch(console.error)
  }

  __setViewClass (select) {
    return select ? 'view-item-active' : ''
  }

  __onInputClick () {
    this.opened = !this.opened
    this.$.boxDialog.positionTarget = this.$.targetDialog
    this.opened ? this.$.boxDialog.open() : this.$.boxDialog.close()
  }

  __cancelClick () {
    this.opened = !this.opened
  }

  __viewItemClick (e) {
    // 解决外部动态插入数据时loading的显示问题
    if (this.isDynamicAppendData) {
      this.showLoading(parentElement)
    }

    const { model } = e
    const { index, item, parentModel } = model
    const treeItems = this.treeItems.slice(0, parentModel.treeIndex + 1)
    const treeItem = parentModel.tree.map((itm, idx) => Object.assign({}, itm, { __select: idx === index }))
    treeItems[parentModel.treeIndex] = treeItem
    if (item.children) {
      parentModel.treeIndex + 1 >= this.treeItems.length ? treeItems.push(item.children) : treeItems.splice(parentModel.treeIndex + 1, 1, item.children)
    }
    const selectedValues = this.selectedValues.slice(0, parentModel.treeIndex + 1)
    selectedValues[parentModel.treeIndex] = item
    this.set('selectedValues', selectedValues)
    if (!item.children) {
      this.set('valueLabel', selectedValues.map(itm => itm[this.attrForLabel]).join(this.separator))
      this.set('value', selectedValues.map(itm => itm[this.attrForValue]))
    }
    this.set('treeItems', treeItems)
    const lastLevelValue = selectedValues.length && selectedValues[selectedValues.length - 1][this.attrForLabel]
    this.$.placeholder.hidden = lastLevelValue
    this.showLabel = this.showAllLevels ? this.valueLabel : lastLevelValue
    // 解决外部动态插入数据时loading的隐藏问题
    const parentElement = e.currentTarget.parentElement
    this.currentClickViewElement = parentElement
    // 内部动态获取数据
    if (this.isInnnerDynamicAppendData) {
      this.__getInnerDynamicAppendData(parentElement)
    }
  }

  /**
   * 内部动态获取数据
   * */
  __getInnerDynamicAppendData (element) {
    const self = this
    self.showLoading(element)
    const requestObj = self.fetchParam
    const req = self.setValueByPath(self.mkObject(self.keywordPath, requestObj), self.keywordPath, self.value[self.value.length - 1] + '')
    // 拼接url，参数名从外界传入，参数值为当前value数组中的最后一个值
    const src = `${self.src}?${self.keywordPath}=${self.value[self.value.length - 1]}`
    const request = self._mkRequest(req, src)
    self._fetchUtil.fetchIt(request)
      .then(res => res.json())
      .then(data => {
        const treeItems = [].concat(self.treeItems)
        if (self.value.length && data && data.length > 0) {
          treeItems.push(data)
          self.treeItems = treeItems
        }
        self.hideLoading(element)
      })
      .catch(e => {
        console.error
        self.hideLoading(element)
      })
  }

  close () {
    this.$.boxDialog.close()
  }

  clear (e) {
    e.stopPropagation()
    const treeItems = [].concat(this.treeItems)
    const chosedStrs = this.valueLabel.split(this.separator)
    if (chosedStrs) {
      chosedStrs.forEach((str, index) => {
        const findIndex = treeItems[index].findIndex(item => item[this.attrForLabel] === str)
        delete treeItems[index][findIndex].__select
      })
    }
    // 解决清空选项之后层级表里面还有选中的选项的样式的问题
    Array.prototype.forEach.call(this.root.querySelectorAll('.view-item'), function (item) {
      item.classList.remove('view-item-active')
    })
    this.set('value', [])
    this.set('valueLabel', null)
    this.set('treeItems', treeItems)
  }

  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @return {boolean}
   */
  validate () {
    super.validate()
    return this.required ? !!(this.value && this.value.length) : true
  }

  __isHover (expandTrigger) {
    return expandTrigger === 'hover'
  }

  static get is () {
    return 'isu-cascading'
  }
}

window.customElements.define(IsuCascading.is, IsuCascading)
