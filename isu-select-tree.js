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

 |`--isu-select-tree-collapse` | Mixin applied to the collapse tree | {}
 |`--isu-select-tree-input` | Mixin applied to the input div | {}
 |`--isu-label` | Mixin applied to the label | {}

 * @customElement
 * @polymer
 * @demo demo/isu-select-tree/index.html
 */
class IsuSelectTree extends mixinBehaviors([BaseBehavior, AjaxBehavior], PolymerElement) {
  static get template () {
    return html`
      <style include="isu-elements-shared-styles">
        :host {
          display: flex;
          height: var(--isu-select-tree-height, 34px);
          line-height: var(--isu-select-tree-height, 34px);
          font-family: var(--isu-ui-font-family), sans-serif;
          font-size: var(--isu-ui-font-size);
          position: relative;
          width: var(--isu-select-tree-width, 300px);
          box-sizing: border-box;
        }
  
        #collapse-tree {
          position: absolute;
          z-index: 999;
          min-width: 225px;
          background: white;
          border: 1px solid lightgray;
          border-radius: 5px;
          height: 420px;
          overflow-y: auto;
          @apply --isu-select-tree-collapse
        }
        #collapse-tree[hidden] {
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
        .input-div {
          width: 210px;
          height: 24px;
          line-height: 24px;
          flex: 1;
          font-family: 'Microsoft Yahei', sans-serif;
          font-size: inherit;
          padding: 4px 8px;
          min-width: inherit;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis
          @apply --isu-select-tree-input
        }
        .placeholder {
          color: #999;
        }
  
      </style>
      <template is="dom-if" if="[[ toBoolean(label) ]]">
         <div class$="isu-label [[fontSize]]">[[label]]</div>
      </template>
      
      <div id="select__container" class$="[[fontSize]]">
        <div id="keywordInput" tabindex="0" on-focus="_inputFocus" class$="input-div [[getPlaceholderClass(selectedItems)]]">
            <template is="dom-if" if="[[isArrayEmpty(selectedItems)]]">
                [[placeholder]]
            </template>
            <template is="dom-if" if="[[!isArrayEmpty(selectedItems)]]">
                <template is="dom-repeat" items="[[selectedItems]]">
                    [[item.label]]
                </template>
            </template>
        </div>
        <isu-iron-fit id="collapse-tree" auto-fit-on-attach vertical-align="auto" horizontal-align="auto" no-overlap dynamic-align hidden>
          <isu-tree data="{{data}}" selected-items="{{selectedItems}}" value="{{value}}" filter-selected-items="{{filterSelectedItems}}" filter-value="{{filterValue}}" 
                attr-for-value="[[attrForValue]]" show-radio="[[showRadio]]" search-word="{{searchWord}}"  show-search-input="[[showSearchInput]]" default-expand-all></isu-tree>
        </isu-iron-fit>
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
       * A url for fetching local data, the response data of the request should be json.
       * @type {string}
       */
      src: {
        type: String
      },
      /**
       * The fetch param of the url,for example: {id: 2}
       * */
      fetchParam: {
        type: Object
      },
      /**
       * The label of the select tree.
       * @type {string}
       */
      label: {
        type: String
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
      filterSelectedItems: {
        type: Array,
        notify: true
      },
      filterValue: {
        type: String,
        notify: true
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
       * Whether to show radio or not
       *
       * @type {boolean}
       * @default false
       * */
      showRadio: {
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

      textValue: {
        type: String,
        notify: true,
        computed: '_textValueComputed(selectedItems, filterSelectedItems)'
      }
    }
  }

  static get is () {
    return 'isu-select-tree'
  }

  static get observers () {
    return [
      '_srcChanged(src)'
    ]
  }

  connectedCallback () {
    super.connectedCallback()
    const self = this
    const target = dom(self.$['collapse-tree']).rootTarget
    const myFit = self.$['collapse-tree']
    myFit.positionTarget = target || self.$.keywordInput
    document.addEventListener('click', e => {
      e.stopPropagation()
      // 点击除了组织树以外的其他地方，组织树都消失
      const composedPath = e.composedPath()
      if (!composedPath.some(item => item.tagName === 'ISU-SELECT-TREE')) {
        self.set('searchWord', null)
        self._displayCollapse(false)
      }
    })
    this.addEventListener('click', e => {
      const minWidth = this.$['collapse-tree'].offsetLeft
      const maxWidth = minWidth + this.$['collapse-tree'].offsetWidth
      const minHeight = this.$['collapse-tree'].offsetTop
      const maxHeight = minHeight + this.$['collapse-tree'].offsetHeight
      if (e.offsetX >= minWidth && e.offsetX <= maxWidth && e.offsetY >= minHeight && e.offsetY <= maxHeight) {
        this.$.keywordInput.focus()
      }
    })
  }

  _inputFocus () {
    this._displayCollapse(true)
  }

  _displayCollapse (display) {
    this.$['collapse-tree'].hidden = !display
  }

  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @return {boolean}
   */
  validate () {
    return this.required ? !!this.value.trim() : true
  }

  getPlaceholderClass (selectedItems) {
    return this.isArrayEmpty(selectedItems) ? 'placeholder' : ''
  }

  async _srcChanged (src) {
    if (!src) return
    const data = await this.query({ url: src, data: {} }, { showLoading: false })
    this.set('data', data)
  }

  _textValueComputed (selectedItems, filterSelectedItems) {
    return this.filterFn ? (filterSelectedItems || []).map(item => item.label).join(',') : (selectedItems || []).map(item => item.label).join(',')
  }
}

window.customElements.define(IsuSelectTree.is, IsuSelectTree)
