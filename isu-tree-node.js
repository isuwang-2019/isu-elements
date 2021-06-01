import { html, PolymerElement } from '@polymer/polymer'
import './behaviors/isu-tree-shared-styles.js'
import '@polymer/paper-styles/default-theme.js'
import '@polymer/paper-checkbox'
import { BaseBehavior } from './behaviors/base-behavior'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import '@polymer/paper-radio-button'
/**
 *
 * `isu-tree-node`
 *
 * Example:
 * ```html
 *
 * ```
 *
 * @customElement
 * @polymer
 * @demo demo/isu-tree/index.html
 */
class IsuTreeNode extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
    <style include="isu-tree-shared-styles">
      .black-span {
        display: inline-block;
        width: 24px;
        height: 24px;
      }
      paper-checkbox {
        --paper-checkbox-unchecked-color: #B1B6BF;
        position: relative;
        @apply --paper-checkbox
      }
      paper-checkbox.half{
        --paper-checkbox-unchecked-background-color: #3F51B5;
        --paper-checkbox-unchecked-color: #3F51B5;
       @apply --paper-checkbox-half-choose
      }
      paper-checkbox.half::after {
        content: '-';
        display:inline-block;
        font-size: 30px;
        font-weight: bold;
        width: 24px;
        height: 24px;
        color: white;
        position: absolute;
        top: 8px;
        left: 4px;
        @apply --paper-checkbox-half-after
        
      }
      .trigger__icon {
        color: #B1B6BF;
      }
      .pitch-on {
        background: #FCE9BB;
        text-decoration: underline;
      }
      .ellipsis {
          white-space: nowrap;
          overflow: hidden;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
      }
      .ellipsis.pointer{
        cursor: pointer;
      }
      .high-lighted-color{
        color: var(--high-lighted-color, #f106d2);
      }
    </style>
    <template is="dom-if" if="[[data.visible]]">
      <div class="dht-tree-twig-one">
        <div class$="dht-tree-node-content [[pitchOn]]" style$="[[_getIndentStyle(data.level, indent)]]" on-click="_clickCheckOnClickNode">
          <!--箭头-->
          <template is="dom-if" if="[[data.children.length]]">
            <iron-icon class="trigger__icon" icon="icons:arrow-drop-down" style$="[[_getRotateStyle(rotate)]]" on-click="showNode"></iron-icon>
          </template>
          <!--没有子元素的时候箭头用空span代替-->
          <template is="dom-if" if="[[!data.children.length]]">
            <span class="black-span"></span>
          </template>
          <!--多选框-->
          <template is="dom-if" if="[[multi]]">
            <paper-checkbox 
              class$="checkbox-item [[getHalfClass(data.indeterminate)]]"
              checked="{{ data.checked }}" 
              disabled="{{ data.disabled }}" 
              on-change="__checkedChangeHandler"
              on-click="__checkedClickedHandler"
              value="[[ getValueByKey(data, attrForValue) ]]">
                <span class="ellipsis">[[ getValueByKey(data, attrForLabel) ]]</span>
             </paper-checkbox>
          </template>
          <!--单选框-->
          <template is="dom-if" if="[[showRadio]]">
            <paper-radio-button
              class="checkbox-item" name="radio"
              checked="{{ data.checked }}" 
              disabled="{{ data.disabled }}" 
              on-click="__checkedRadioClickedHandler"
              value="[[ getValueByKey(data, attrForValue) ]]">
                <span class="ellipsis">[[ getValueByKey(data, attrForLabel) ]]</span>
             </paper-radio-button>
          </template>
          <!--可自定义部分-->
          <slot name="before-label"></slot>
          <template is="dom-if" if="[[isAllFalse(showRadio, multi)]]">
            <span class="ellipsis pointer">[[ getValueByKey(data, attrForLabel) ]]</span>
          </template>
          <!--可自定义部分-->
          <slot name="after-label"></slot>
        </div>
        <template is="dom-repeat" items="{{data.children}}" index-as="index" initial-count="5">
          <isu-tree-node
            data="{{item}}"
            multi="[[multi]]"
            show-radio="[[showRadio]]"
            search-word="[[searchWord]]" 
            default-expand-all="[[defaultExpandAll]]"
            indent="[[indent]]"
            selected-items="[[selectedItems]]"
            attr-for-value="[[attrForValue]]"
            attr-for-label="[[attrForLabel]]"
            hidden="[[!isShow]]"
          >
           <slot name="before-label"></slot>
          </isu-tree-node>
        </template>
    </div>
    </template>
    
`
  }

  static get properties () {
    return {
      // 存储Node节点data
      data: {
        type: Object
      },
      /**
       * 选择的树节点集合
       *
       * @type {array}
       * */
      selectedItems: {
        type: Array,
        notify: true
      },
      /**
       * 节点作为value值的属性，默认取id作为value值
       * @type {String}
       * @default 'children'
       */
      attrForValue: {
        type: String,
        value: 'id'
      },
      attrForLabel: {
        type: String,
        value: 'label'
      },
      /**
       * The angle at which a triangle rotates
       *
       * @type {number}
       * @default -90
       */
      rotate: {
        type: Number,
        value: -90
      }, // 三角形标记
      /**
       * Whether to show checkbox or not
       *
       * @type {boolean}
       * @default false
       * */
      multi: {
        type: Boolean,
        value: false
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
       * Accordion mode, showing only one sibling node at a time
       *
       * @type {boolean}
       * @default false
       * */
      accordion: {
        type: Boolean,
        value: false
      },
      /**
       * Whether to expand all nodes by default
       *
       * @type {boolean}
       * @default false
       * */
      defaultExpandAll: {
        type: Boolean,
        value: false
      },
      /**
       * Operate the child element is closed or opened
       * */
      isShow: {
        type: Boolean,
        value: false
      },
      /**
       * How many pixels are indented per layer.
       *
       * @type {number}
       * @default 18
       * */
      indent: {
        type: Number,
        value: 18
      },
      isFirst: {
        type: Boolean,
        value: false
      },
      searchWord: { // 有搜索框时输入的关键字
        type: String
      },
      /**
       * 是否高亮显示开关，如果是，搜索时候，匹配上的文本会高亮显示
       */
      highlightedLabelFlag: {
        type: Boolean,
        value: false
      },
      /**
       * checkOnClickNode 为true时候，选中的节点添加选中样式
       */
      pitchOn: {
        type: String,
        computed: '__pitchOn(multi, showRadio, selectedItems)'
      }
    }
  }

  static get is () {
    return 'isu-tree-node'
  }

  static get observers () {
    return [
      '_defaultExpandAllChanged(defaultExpandAll)',
      '_searchWordChanged(searchWord)',
      '_isFirst(isFirst)',
      '__selectedItemsChanged(selectedItems)',
      '__dataChanged(data.*)'
    ]
  }

  connectedCallback () {
    super.connectedCallback()
    this.addEventListener('children-status-changed', this._childrenStatusChangedHandle)
  }

  __dataChanged (data) {
    const { path } = data
    if (path.includes('indeterminate') || path.includes('checked')) {
      this.debounce('childrenStatusChanged', () => {
        this.dispatchEvent(new CustomEvent('children-status-changed', { detail: { data: this.data }, bubbles: true, composed: true }))
      }, 200)
    }
  }

  _childrenStatusChangedHandle (e) {
    e.stopPropagation()
    this.debounce('childrenStatusChangedHandle', this.queryCurNodeIsChecked.bind(this, this.selectedItems), 100)
  }

  _isFirst (isFirst) {
    if (!this.defaultExpandAll) {
      this.set('isShow', isFirst)
      this.set('rotate', isFirst ? 0 : -90)
    }
  }

  getHalfClass (indeterminate) {
    const result = indeterminate ? 'half' : ''
    return result
  }

  _searchWordChanged (searchWord) {
    this._showNodeFilter()
    this._highlightedLabel(searchWord)
  }

  _highlightedLabel (searchWord) {
    if (searchWord === null || searchWord === undefined) return
    const eles = this.root.querySelectorAll('.ellipsis')
    if (!searchWord) {
      Array.from(eles).forEach(e => {
        const label = this.data[this.attrForLabel || 'label']
        e.innerHTML = label
      })
    } else {
      Array.from(eles).forEach(e => {
        const searchWordRegExp = new RegExp(`(${searchWord})`, 'gi')
        if (searchWordRegExp.test(e.textContent)) {
          e.innerHTML = e.textContent.replace(searchWordRegExp, '<span class="high-lighted-color">$1</span>')
        }
      })
    }
  }

  _showNodeFilter () {
    const visible = this.filterNode(this.searchWord, this.data)
    this.set('data.visible', visible)
  }

  filterNode (searchWord, data) {
    if (!data) {
      return false
    }
    if (!searchWord) {
      return true
    }
    const self = this
    const { children } = data
    const searchWordRegExp = new RegExp(`(${searchWord})`, 'gi')
    const selfVisible = searchWordRegExp.test(data[this.attrForLabel] || data.label)
    const childVisilbe = (children || []).some(childrenData => {
      return self.filterNode(searchWord, childrenData)
    })
    return selfVisible || childVisilbe
  }

  _defaultExpandAllChanged (defaultExpandAll) {
    if (defaultExpandAll) {
      this.isShow = true
      this.rotate = 0
    }
  }

  _clickCheckOnClickNode () {
    if (this.multi || this.showRadio) return
    this.dispatchEvent(new CustomEvent('single-checked-changed', { detail: { data: this.data }, bubbles: true, composed: true }))
  }

  showNode (e) {
    e.stopPropagation()
    if (this.data.children.length <= 0) return false

    // this.dispatchEvent(new CustomEvent('arrow-check', { detail: { data: null }, bubbles: true, composed: true }))
    const parent = this.domHost
    if (this.isShow) {
      this.isShow = false
      this.rotate = -90
      return
    }

    // 如果开启了手风琴模式，一次展示一个层级
    if (this.accordion) {
      parent.shadowRoot.querySelectorAll('isu-tree-node').forEach(el => {
        el.isShow = false
        el.rotate = -90
      })
    }
    // 操作子元素方式开启关闭
    this.isShow = true
    this.rotate = 0
  }

  _getIndentStyle (level, indent) {
    return `padding-left: ${level * indent}px`
  }

  _getRotateStyle (rotate) {
    return `transform: rotate(${rotate}deg)`
  }

  __checkedChangeHandler (e) {
    e.stopPropagation()
    const isChecked = e.target.checked
    setTimeout(() => {
      if (this.multi) { // 如果是多选状态
        this.dispatchEvent(new CustomEvent('multiple-checked-changed', { detail: { data: this.data, isChecked: isChecked }, bubbles: true, composed: true }))
      }
    }, 0)
  }

  __checkedRadioClickedHandler (e) {
    e.stopPropagation()
    if (this.multi) { // 如果是多选，跳过
      return
    }
    this.dispatchEvent(new CustomEvent('single-checked-changed', { detail: { data: this.data }, bubbles: true, composed: true }))
  }

  __checkedClickedHandler (e) {
    e.stopPropagation()
    if (this.multi) { // 如果是多选状态
      const isChecked = e.target.checked
      this.dispatchEvent(new CustomEvent('multiple-click-checked-changed', { detail: { data: this.data, isChecked: isChecked }, bubbles: true, composed: true }))
    }
  }

  __pitchOn (multi, showRadio, selectedItems) {
    const flag = !multi && !showRadio && this.queryCurNodeIsChecked(selectedItems)
    const result = flag ? 'pitch-on' : ''
    return result
  }

  /**
   * 根据selectedItems 的变化，来判断当前节点是否显示
   * @param selectedItems
   * @private
   */
  __selectedItemsChanged (selectedItems) {
    // 判断当前是否选中状态
    this.queryCurNodeIsChecked(selectedItems)
  }

  /**
   * 判断当前节点是否中间状态
   * @return {boolean|boolean}
   */
  queryCurNodeIsIndeterminate () {
    let isIndeterminate = false // 默认不是中间状态
    const children = this.data.children || []
    if (children.length > 0 && this.multi) { // 多选且存在子节点时候，才有中间态
      if (children.findIndex(item => item.indeterminate) > -1) { // 存在子节点为中间态，当前为中间态
        isIndeterminate = true
      } else {
        const isAllChecked = children.every(item => item.checked) // 子节点都选中
        const isAllUnchecked = children.every(item => !item.checked) // 子节点都没有选中
        isIndeterminate = !isAllChecked && !isAllUnchecked
      }
    }
    this.set('data.indeterminate', isIndeterminate)
    return isIndeterminate
  }

  /**
   * 判断当前节点是否选中状态
   * @param selectedItems
   * @return {boolean}
   */
  queryCurNodeIsChecked (selectedItems = []) {
    let isChecked = false
    if (this.multi) { // 多选时候
      const isIndeterminate = this.queryCurNodeIsIndeterminate()
      if (!isIndeterminate) {
        const children = (this.data && this.data.children) || []
        const flag1 = children.length > 0 && children.every(item => item.checked) // 1、存在子节点，所有的子节点都是选中状态，则为选中状态
        const flag2 = children.length === 0 && (selectedItems || []).findIndex(item => item[this.attrForValue] === this.data[this.attrForValue]) > -1 // 2、不存在子节点，且当前节点在选中节点列表中
        isChecked = flag1 || flag2
      }
    } else { // 不是多选，当前节点在选中列表中则为选中
      isChecked = (selectedItems || []).findIndex(item => item[this.attrForValue] === this.data[this.attrForValue]) > -1
    }

    this.set('data.checked', isChecked)
    return isChecked
  }
}

window.customElements.define(IsuTreeNode.is, IsuTreeNode)
