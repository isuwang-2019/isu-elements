import { html, PolymerElement } from '@polymer/polymer'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import '@polymer/iron-icon/iron-icon'
import '@polymer/iron-icons/iron-icons'
import '@polymer/iron-icons/social-icons'
import { BaseBehavior } from './behaviors/base-behavior'
import { AjaxBehavior } from './behaviors/ajax-behavior'
import './behaviors/isu-elements-shared-styles.js'
import './isu-tree.js'
import './isu-iron-fit.js'
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom'

/**

 Example:
 ```html
 ```

 ## Styling

 The following custom properties and mixins are available for styling:

 |Custom property | Description | Default|
 |----------------|-------------|----------|
 |`--isu-ui-font-family` | The font family of the picker | Microsoft YaHei
 |`--isu-ui-font-size` | The font size of the picker | 14px

 |`--isu-select-tree-new-collapse` | Mixin applied to the collapse tree | {}
 |`--isu-select-tree-new-input` | Mixin applied to the input div | {}
 |`--isu-label` | Mixin applied to the label | {}

 * @customElement
 * @polymer
 * @demo demo/isu-select-tree/index.html
 */
class IsuSelectTreeNew extends mixinBehaviors([BaseBehavior, AjaxBehavior], PolymerElement) {
  static get template () {
    return html`
      <style include="isu-elements-shared-styles">
          :host {
            display: flex;
            line-height: var(--isu-select-tree-new-height, var(--isu-default-line-height, 34px));
            font-family: var(--isu-ui-font-family), sans-serif;
            font-size: var(--isu-ui-font-size);
            position: relative;
            box-sizing: border-box;
            width: var(--isu-select-tree-new-width, 320px);
          }
          #newtree-collapse {
            position: absolute;
            z-index: 999;
            min-width: 225px;
            background: white;
            border: 1px solid lightgray;
            border-radius: 5px;
            height: 420px;
            overflow-y: auto;
            @apply --isu-select-tree-new-collapse
          }
          #newtree-collapse[hidden] {
            visibility: hidden;
            height: 0;
            opacity: 0;
          }
          #select__container {
            flex: 1;
            position: relative;
            display: flex;
            min-width: 0px;
          }
          #select__container[hidden] {
            display: none;
          }

          .input-div {
            line-height: calc(var(--isu-select-tree-new-height, var(--isu-default-line-height, 34px)) - 2px - 4px);
            height: 24px;
            flex: 1;
            font-family: 'Microsoft Yahei', sans-serif;
            font-size: inherit;
            padding: 2px 8px;
            min-width: inherit;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            @apply --isu-select-tree-new-input
          }
          .placeholder {
            color: #999;
          }
          
          #tag-content {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            overflow-y: auto;
          }
          
          #tag-content::-webkit-scrollbar, #select-collapse::-webkit-scrollbar {
            display: none;
          }
    
          .tag {
            max-width: calc(100% - 14px);
            color: #fff;
            background: var(--isu-ui-bg);
            border-radius: 4px;
    
            margin: 3px 2px;
            padding: 0 4px;
            min-height: 22px;
            line-height: 22px;
            /*max-width: 200px;*/
    
            display: flex;
            word-break: break-all;
            cursor: default;
            @apply --isu-select-tree-new-tag;
          }
    
          .tag-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            @apply --isu-select-tag-name;
          }
          :host([show-all]) #tag-content {
            height: auto;
            min-height: 24px
            @apply --isu-select-tag-content;
          }
          .view-text {
             @apply --isu-view-text
          }
      </style>
      <template is="dom-if" if="[[ toBoolean(label) ]]">
         <div class="isu-label-div"><span class$="isu-label [[fontSize]]">[[label]]</span><span class="isu-label-after-extension"></span></div>
      </template>
      
      <div id="select__container" hidden="[[isAllTrue(isView, readonly)]]" class$="[[fontSize]]">
        <div id="tag-content" tabindex="0" on-focus="_inputFocus" class="input-div">
            <template is="dom-if" if="[[isArrayEmpty(filterSelectedItems)]]">
                <span class="placeholder">[[placeholder]]</span>
            </template>
            <template is="dom-if" if="[[!isArrayEmpty(filterSelectedItems)]]">
                <template is="dom-repeat" items="[[ filterSelectedItems ]]">
                  <div class="tag">
                    <div class="tag-name" title="[[getValueByKey(item, attrForLabel)]]">
                      [[getValueByKey(item, attrForLabel)]]
                    </div>
                  </div>
                </template>
            </template>
          </div>
        <isu-iron-fit id="newtree-collapse"  auto-fit-on-attach vertical-align="auto" horizontal-align="auto" no-overlap dynamic-align hidden="[[!isShowCollapse]]">
              <isu-tree id="tree" data="{{data}}" data-set="{{dataSet}}" selected-items="{{selectedItems}}" value="{{value}}" 
                        filter-selected-items="{{filterSelectedItems}}" filter-value="{{filterValue}}"  init-filter-value="[[initFilterValue]]"
                        attr-for-value="[[attrForValue]]" attr-for-label="[[attrForLabel]]"
                        only-select-level="[[onlySelectLevel]]" filter-fn="[[filterFn]]"
                        multi="[[multi]]" show-search-input="[[showSearchInput]]" default-expand-all search-word="{{searchWord}}" 
                        ></isu-tree>
        </isu-iron-fit>
        <div class="prompt-tip__container" data-prompt$="[[prompt]]">
          <div class="prompt-tip">
            <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
            [[prompt]]
          </div>
        </div>
      </div>
      <template is="dom-if" if="[[isAllTrue(isView, readonly)]]">
        <div class$="view-text [[fontSize]]">
           <span>[[textValue]]</span>
        </div>
      </template>
`
  }

  static get properties () {
    return {
      /**
       * A url for fetching local data, the response data of the request should be json.
       * @type {string}
       */
      src: {
        type: String
      },
      /**
       * The data of the tree
       * @type {array}
       * @default []
       */
      data: {
        type: Array,
        value: [],
        notify: true
      },
      /**
       * The label of the select tree.
       * @type {string}
       */
      label: {
        type: String
      },
      attrForLabel: {
        type: String,
        value: 'label'
      },
      /**
       * Attribute name for value.
       * @type {string}
       * @default 'id'
       */
      attrForValue: {
        type: String,
        value: 'id'
      },
      /**
       * The placeholder of the select.
       * @type {String}
       * @default '请选择'
       */
      placeholder: {
        type: String,
        value: '请选择'
      },
      /**
       *
       * The selected value of this select tree
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * An array of the selected items
       * @type {array}
       */
      selectedItems: {
        type: Array,
        notify: true
      },
      /**
       * 对选中数据结果进行处理的函数
       */
      filterFn: {
        type: Function
      },
      /**
       * 过滤属性，对选中的结果集进行处理，过滤选中结果集只为指定层级的数据，与filterFn并行使用且优先于filterFn,eg: '2,3'
       */
      onlySelectLevel: {
        type: String
      },
      filterSelectedItems: {
        type: Array,
        notify: true
      },
      filterValue: {
        type: String,
        notify: true
      },
      /**
       * 仅做初始化数据使用
       * 应用场景，通过filterValue回显数据
       */
      initFilterValue: {
        type: String
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
       * Set to true, if the select is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * The prompt tip to show when input is invalid.
       * @type {string}
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
       * multiple options or not，default not
       * @type {boolean}
       * @default false
       */
      multi: {
        type: Boolean,
        value: false
      },
      /**
       * Whether to display the search box
       * @type {boolean}
       * @default false
       */
      showSearchInput: {
        type: Boolean,
        value: false
      },
      /**
       * 输入框是否因为显示数量太多被撑开展示全部，默认展示全部
       * */
      showAll: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      textValue: {
        type: String,
        notify: true,
        computed: '_textValueComputed(selectedItems, filterSelectedItems)'
      },
      /**
       * 是否显示选择树面板，默认不显示
       */
      isShowCollapse: {
        type: Boolean,
        value: false
      }
    }
  }

  static get is () {
    return 'isu-select-tree-new'
  }

  static get observers () {
    return [
      '_srcChanged(src)'
    ]
  }

  connectedCallback () {
    super.connectedCallback()
    const target = dom(this.$['newtree-collapse']).rootTarget
    const myFit = this.$['newtree-collapse']
    myFit.positionTarget = target || this.$['tag-content']
    const self = this
    document.addEventListener('click', e => {
      e.stopPropagation()
      // 点击除了组织树以外的其他地方，组织树都消失
      const composedPath = e.composedPath()
      if (!composedPath.some(item => item.tagName === 'ISU-SELECT-TREE-NEW')) {
        self.set('searchWord', null)
        // self._displayCollapse(false)
        this.set('isShowCollapse', false)
      }
    })
  }

  _inputFocus () {
    if (!this.readonly) {
      // this._displayCollapse(true)
      this.set('isShowCollapse', true)
    }
  }

  // _displayCollapse (display) {
  //   this.$['newtree-collapse'].hidden = !display
  // }

  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @return {boolean}
   */
  validate () {
    return this.required ? !!this.value.trim() : true
  }

  async _srcChanged (src) {
    if (!src) return
    const data = await this.query({ url: src, data: {} }, { showLoading: false })
    if (Array.isArray(data)) {
      this.set('data', data)
    } else {
      this.set('data', [data])
    }
  }

  _textValueComputed (selectedItems, filterSelectedItems) {
    return (this.filterFn && this.isFunction(this.filterFn)) || !!this.onlySelectLevel ? (filterSelectedItems || []).map(item => item[this.attrForLabel]).join(this.joinConnector) : (selectedItems || []).map(item => item[this.attrForLabel]).join(this.joinConnector)
  }
}

window.customElements.define(IsuSelectTreeNew.is, IsuSelectTreeNew)
