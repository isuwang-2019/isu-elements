import { html, PolymerElement } from '@polymer/polymer'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import './behaviors/isu-tree-shared-styles.js'
import './isu-tree-node.js'
import './isu-input.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import { BaseBehavior } from './behaviors/base-behavior'

/**
 *
 * `isu-tree`
 *
 * Example:
 * ```html
 *  <div>
 *    <h4>Basic</h4>
 *    <isu-tree id="tree"></isu-tree>
 *    <h4>部分禁用</h4>
 *    <isu-tree id="tree4" show-radio></isu-tree>
 *    <h4>多选</h4>
 *    <isu-tree id="tree2" multi></isu-tree>
 *    <h4>单选</h4>
 *    <isu-tree id="tree3" show-radio></isu-tree>
 *    <h4>可以进行搜索</h4>
 *    <isu-tree id="tree5" multi show-search-input></isu-tree>
 *    <h4>手风琴模式，一次只展开一个同级列表</h4>
 *    <isu-tree id="tree6" multi accordion></isu-tree>
 *    <h4>展开所有节点</h4>
 *    <isu-tree id="tree7" multi default-expand-all></isu-tree>
 *    <h4>默认选中部分值</h4>
 *    <isu-tree id="tree9" multi></isu-tree>
 *  </div>
 * ```
 *
 * ### Styling
 *
 * `<isu-button>` provides the following custom properties and mixins
 * for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--paper-checkbox` | Mixin applied to the paper-checkbox | {}
 * `--paper-checkbox-half-choose` | Mixin applied to the paper-checkbox with half selected status | {}
 * `--paper-checkbox-half-after` | Mixin applied to the paper-checkbox with half selected shape| {}
 * `--paper-checkbox-unchecked-background-color` | Checkbox background color when the input is not checked | `transparent`
 * `--paper-checkbox-unchecked-color` | Checkbox border color when the input is not checked | `--primary-text-color`
 * `--paper-checkbox-unchecked-ink-color` | Selected/focus ripple color when the input is not checked | `--primary-text-color`
 * `--paper-checkbox-checked-color` | Checkbox color when the input is checked | `--primary-color`
 * `--paper-checkbox-checked-ink-color` | Selected/focus ripple color when the input is checked | `--primary-color`
 * `--paper-checkbox-checkmark-color` | Checkmark color | `white`
 * `--paper-checkbox-label-color` | Label color | `--primary-text-color`
 * `--paper-checkbox-label-checked-color` | Label color when the input is checked | `--paper-checkbox-label-color`
 * `--paper-checkbox-label-spacing` | Spacing between the label and the checkbox | `8px`
 * `--paper-checkbox-label` | Mixin applied to the label | `{}`
 * `--paper-checkbox-label-checked` | Mixin applied to the label when the input is checked | `{}`
 * `--paper-checkbox-error-color` | Checkbox color when invalid | `--error-color`
 * `--paper-checkbox-size` | Size of the checkbox | `18px`
 * `--paper-checkbox-ink-size` | Size of the ripple | `48px`
 * `--paper-checkbox-margin` | Margin around the checkbox container | `initial`
 * `--paper-checkbox-vertical-align` | Vertical alignment of the checkbox container | `middle`
 *
 * @customElement
 * @polymer
 * @demo demo/isu-tree/index.html
 */
class IsuTree extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
       <style include="isu-tree-shared-styles">
          #tree-search-input {
              position: -webkit-sticky; /* safari 浏览器 */
              position: sticky; /* 其他浏览器 */
              top: 0px;
              z-index: 100;
          }
       </style>
        <template is="dom-if" if="[[showSearchInput]]">
          <isu-input id="tree-search-input" type="text" value="{{searchWord}}"></isu-input>
        </template>
        <template is="dom-if" if="[[isRenderNodes]]">
            <template is="dom-repeat" items="[[data]]" index-as="index" initial-count="5">
              <isu-tree-node 
                data="{{item}}"
                multi="[[multi]]" 
                show-radio="[[showRadio]]" 
                search-word="[[searchWord]]"
                is-first="[[_isFirst(index)]]"
                accordion="[[accordion]]" 
                default-expand-all="[[defaultExpandAll]]" 
                indent="[[indent]]"
                attr-for-value="[[attrForValue]]"
                attr-for-label="[[attrForLabel]]"
                selected-items="[[selectedItems]]"
              >
              <div slot="before-label">
                <slot name="before-label">
                </slot>
              </div>
              </isu-tree-node>
            </template>
        </template>
        
`
  }

  static get properties () {
    return {
      /**
       * 原据源，为树结构的数组
       * @demo
       * [
       *  { id: 1, label: '第1个', children: []},
       *  { id: 2, label: '第2个', children: [{ id: 11, label: '二级第1个',  children: [] }]},
       * ]
       *
       * @type {array}
       */
      data: {
        type: Array
      },
      /**
       * 存储树转Array后的数据集合
       */
      dataSet: {
        type: Array
      },
      /**
       * 树结构数据子节点的属性，默认为children
       * @type {String}
       * @default 'children'
       */
      attrForChild: {
        type: String
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
       * Whether to require a query input box or not
       *
       * @type {boolean}
       * @default false
       */
      showSearchInput: {
        type: Boolean,
        value: false
      },
      /**
       * The selected value of this select tree
       */
      value: {
        type: String,
        notify: true
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
      /**
       * 经过onlySelectLevel、filterFn处理过后的结果集合
       */
      filterSelectedItems: {
        type: Array,
        notify: true,
        computed: '__filterSelectedItemsComputed(selectedItems, onlySelectLevel, filterFn)'
      },
      filterValue: {
        type: String,
        notify: true,
        computed: '__filterValueComputed(filterSelectedItems)'
      },
      /**
       * 仅做初始化数据使用
       * 应用场景，通过filterValue回显数据
       */
      initFilterValue: {
        type: String
      },
      /**
       * 是否多选
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
       * How many pixels are indented per layer.
       *
       * @type {number}
       * @default 18
       * */
      indent: {
        // 每一层缩进多少像素
        type: Number,
        value: 18
      },
      isTree: {
        type: Boolean,
        value: true
      },
      props: {
        type: Object,
        value () {
          return {
            children: 'children',
            label: 'label',
            disabled: 'disabled'
          }
        }
      },
      /**
       * The search word
       *
       * @type {string}
       * */
      searchWord: {
        type: String,
        notify: true
      },
      /**
       * 是否渲染树节点，默认为true
       * 设置为false时候，树节点不进行渲染，
       * isu-select-tree-new 通过该属性，控制树的渲染
       */
      isRenderNodes: {
        type: Boolean,
        value: true
      }

    }
  }

  static get observers () {
    return [
      '__valueChanged(value)',
      '__selectedItemsChanged(selectedItems)',
      '__initData(data)',
      '_dataSetChanged(dataSet)',
      '_initValue(initFilterValue, dataSet)'
    ]
  }

  // __attrForChildChanged() {
  //   console.log('__attrForChildChanged')
  //   this.__initData(this.metadata)
  // }

  __initData (data) {
    if (!data) {
      this.set('dataSet', [])
      return
    }
    const attrForChild = this.attrForChild || 'children'
    const attrForValue = this.attrForValue || 'id'
    const dataSet = []
    const selectedItems = []
    const __init = (arr, level = 1, parent) => {
      arr.forEach(item => {
        item.children = item[attrForChild]
        item.parent = parent
        item.level = level
        item.visible = true
        if (item.checked) {
          selectedItems.push(item)
        } else {
          item.checked = false
        }
        dataSet.push(item)
        __init(item[attrForChild] || [], level + 1, item[attrForValue])
      })
    }
    __init(data)
    this.set('dataSet', dataSet)
    if (selectedItems.length > 0) {
      this.set('selectedItems', selectedItems)
    }
  }

  __valueChanged (value) {
    if (!this.dataSet || this.dataSet.length === 0) {
      return
    }
    value = (value && `${value}`) || '' // 将value强制转为string
    const attrForValue = this.attrForValue || 'id'
    const valueItems = value.split(',')
    const selectedItems = this.selectedItems || []
    const flag = valueItems.length === selectedItems.length && valueItems.every(item => selectedItems.findIndex(i => `${item[attrForValue]}` === item) > -1)
    if (!flag) {
      const newSelectedItems = this.dataSet.filter(item => valueItems.includes(`${item[attrForValue]}`))
      this.set('selectedItems', newSelectedItems)
    }
  }

  _dataSetChanged (dataSet) {
    if (this.value) {
      this.__valueChanged(this.value)
    }
  }

  __selectedItemsChanged (selectedItems) {
    const attrForValue = this.attrForValue || 'id'
    const value = (selectedItems || []).map(item => item[attrForValue]).join(',')
    this.set('value', value)
  }

  __filterSelectedItemsComputed (selectedItems, onlySelectLevel, filterFn) {
    selectedItems = selectedItems || []
    if (onlySelectLevel) {
      const onlySelectLevelItems = (onlySelectLevel || '').split(',')
      selectedItems = selectedItems.filter(item => onlySelectLevelItems.includes(`${item.level}`))
    }
    if (filterFn && this.isFunction(filterFn)) {
      selectedItems = filterFn(selectedItems)
    }
    return selectedItems
  }

  __filterValueComputed (filterSelectedItems) {
    const attrForValue = this.attrForValue || 'id'
    if (this.dataSet) {
      return filterSelectedItems && filterSelectedItems.map(item => item[attrForValue]).join(',')
    }
  }

  connectedCallback () {
    super.connectedCallback()
    this.addEventListener('multiple-checked-changed', this._multipleCheckChangedHandle)
    this.addEventListener('multiple-click-checked-changed', this._multipleClickCheckChangedHandle)
    this.addEventListener('single-checked-changed', this._singleCheckedChangedHandle)
  }

  /**
   * 多选，多选框变化处理器
   * @param e
   * @private
   */
  _multipleCheckChangedHandle (e) {
    const { data, isChecked } = e.detail
    const selectedItems = this.selectedItems || []
    const attrForValue = this.attrForValue || 'id'
    if (isChecked) { // 选中
      if (selectedItems.findIndex(item => item[attrForValue] === data[attrForValue]) === -1) {
        const newSelectedItems = [...selectedItems, data]
        this.set('selectedItems', newSelectedItems)
      }
    } else { // 非选中
      const newSelectedItems = selectedItems.filter(item => item[attrForValue] !== data[attrForValue])
      this.set('selectedItems', newSelectedItems)
    }
  }

  /**
   * 多选，多选框点击处理器
   * @param e
   * @private
   */
  _multipleClickCheckChangedHandle (e) {
    let { data, isChecked } = e.detail
    const { indeterminate } = data
    if (indeterminate && isChecked) { // 中间态当作已经选中取反
      isChecked = false
    }
    const targetItems = []
    const disabledItems = []
    const __initTargetItems = (d) => {
      if (d.disabled) {
        disabledItems.push(d)
      } else {
        targetItems.push(d)
        d.children && d.children.forEach(item => __initTargetItems(item))
      }
    }
    __initTargetItems(data)
    const selectedItems = this.selectedItems || []
    const attrForValue = this.attrForValue || 'id'
    const newSelectedItems = selectedItems.filter(item => targetItems.findIndex(target => target[attrForValue] === item[attrForValue]) === -1)
    if (isChecked) {
      this.set('selectedItems', [...newSelectedItems, ...targetItems])
    } else {
      this.set('selectedItems', newSelectedItems)
    }
  }

  _singleCheckedChangedHandle (e) {
    if (this.multi) return // 如果是多选，不做处理
    const { data } = e.detail
    const attrForValue = this.attrForValue || 'id'
    const selectedItems = this.selectedItems || []
    if (selectedItems.length > 0 && selectedItems[0][attrForValue] === data[attrForValue]) {
      this.set('selectedItems', [])
    } else {
      const newSelectedItems = [data]
      this.set('selectedItems', newSelectedItems)
    }
  }

  _isFirst (index) {
    return index === 0
  }

  /**
   * 初始化value
   * 初始化条件：
   * 前置条件：dataSet存在且dataSet.length>0
   * 1、initFilterValue 存在且value 不存在，需要初始化value值
   * 2、value、initFilterValue(空字符串也算)同时存在，且initFilterValue 与 filterValue 不一致，需要重置value
   *
   * 通过initFilterValue 重置value为空，需要将initFilterValue设置为''
   * @param initFilterValue
   * @param dataSet
   * @private
   */
  _initValue (initFilterValue, dataSet) {
    if (!dataSet || dataSet.length === 0) return
    const flag1 = initFilterValue && !this.value
    const flag2 = initFilterValue !== undefined && this.value && initFilterValue !== this.filterValue
    if (!flag1 && !flag2) return
    const attrForValue = this.attrForValue || 'id'
    const valueItems = []
    const _initValueItems = (value) => {
      const target = dataSet.find(item => `${item[attrForValue]}` === `${value}`)
      if (target) {
        !valueItems.includes(target) && valueItems.push(target)
        if (target.children && target.children.length > 0) {
          target.children.forEach(child => _initValueItems(child[attrForValue]))
        }
      }
    }
    `${initFilterValue}`.split(',').forEach(value => _initValueItems(value))
    const value = valueItems.map(item => item[attrForValue]).join(',')
    this.set('value', value)
  }
}

window.customElements.define('isu-tree', IsuTree)
