import { html, PolymerElement } from '@polymer/polymer'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import './behaviors/isu-tree-shared-styles.js'
import './isu-tree-node.js'
import './isu-input.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import TreeStore from './utils/tree/tree-store.js'
import Node from './utils/tree/node'

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
 *    <isu-tree id="tree2" show-checkbox></isu-tree>
 *    <h4>单选</h4>
 *    <isu-tree id="tree3" show-radio></isu-tree>
 *    <h4>可以进行搜索</h4>
 *    <isu-tree id="tree5" show-checkbox show-search-input></isu-tree>
 *    <h4>手风琴模式，一次只展开一个同级列表</h4>
 *    <isu-tree id="tree6" show-checkbox accordion></isu-tree>
 *    <h4>展开所有节点</h4>
 *    <isu-tree id="tree7" show-checkbox default-expand-all></isu-tree>
 *    <h4>默认选中部分值</h4>
 *    <isu-tree id="tree9" show-checkbox default-checked-keys="[11,21]"></isu-tree>
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
class IsuTree extends mixinBehaviors(TreeStore, PolymerElement) {
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
        <template is="dom-repeat" items="{{node.childNodes}}" index-as="index">
          <isu-tree-node show-checkbox="{{showCheckbox}}" search-word="[[searchWord]]"
            is-checked="{{isChecked}}" is-first="[[_isFirst(index)]]"
            accordion="[[accordion]]" level="1" id="{{item.nodeId}}"
            key="[[getNodeKey(item, index)]]" node="{{item}}"  
            default-expand-all="[[defaultExpandAll]]" check-on-click-node="[[checkOnClickNode]]"
            show-radio="{{showRadio}}" indent="[[indent]]"
            data-location="[[_getDataLocation(index)]]" 
          >
          <div slot="before-label">
            <slot name="before-label">
            </slot>
          </div>
          </isu-tree-node>
        </template>
`
  }

  static get properties () {
    return {
      /**
       * The data of the tree
       *
       * @type {array}
       */
      data: {
        type: Array
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
       * Whether to show checkbox or not
       *
       * @type {boolean}
       * @default false
       * */
      showCheckbox: {
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
       * The specified field of the collection of keys that need to be returned
       *
       * @type {string}
       * @default 'id'
       * */
      key: {
        type: String,
        value: 'id'
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
      store: {
        type: TreeStore
      },
      node: {
        type: Node,
        notify: true,
        reflectToAttribute: true
      },
      /**
       * The search word
       *
       * @type {string}
       * */
      searchWord: {
        type: String
      },
      /**
       * The set of selected items
       *
       * @type {array}
       * */
      bindItems: {
        type: Array,
        notify: true
      },
      /**
       * The set of selected items`s id
       *
       * @type {array}
       * */
      bindItemKeys: {
        type: Array,
        notify: true
      },
      /**
       * The default selected set of keys
       *
       * @type {array}
       * */
      defaultCheckedKeys: {
        type: Array
      },
      /**
       * Whether to choose the node when the node is clicked. The default value is false, which means that the node is only selected when the checkbox is clicked
       *
       * @type {boolean}
       * @default false
       * */
      checkOnClickNode: {
        type: Boolean,
        value: false
      }
    }
  }

  static get observers () {
    return [
      '_childNodesChanged(node.childNodes.*)',
      '_isFirst(isFirst)',
      '_dataChanged(data, defaultCheckedKeys)'
    ]
  }

  _childNodesChanged (target) {
    const self = this
    self.addEventListener('check-button', (e) => {
      self.debounce('_setBindItemsChanged', self._setBindItemsChanged.bind(self, e), 200)
    })
    self.addEventListener('single-check', (e) => {
      self.debounce('_setSingleBindItemsChanged', self._setSingleBindItemsChanged.bind(self, e), 200)
    })
    self.addEventListener('arrow-check', (e) => {
      this.dispatchEvent(new CustomEvent('tree-arrow-check', { detail: { selectedItem: (self.bindItems || [])[0] }, bubbles: true, composed: true }))
    })
  }

  _setBindItemsChanged (e) {
    if (!this.checkOnClickNode) {
      this.set('bindItems', e.detail.checkedNodes)
      this.set('bindItemKeys', e.detail.checkedKeys)
    }
  }

  _setSingleBindItemsChanged (e) {
    this.set('bindItems', Array.prototype.concat([], e.detail.data))
    this.set('bindItemKeys', Array.prototype.concat([], e.detail.data[this.key]))
  }

  _dataChanged (data, defaultCheckedKeys) {
    if (data) {
      const store = new TreeStore({
        data: data,
        key: this.key,
        lazy: this.lazy,
        props: this.props,
        load: this.load,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly,
        checkDescendants: this.checkDescendants,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll
      })
      this.set('store', store)
      this.set('node', store.root)
    }
  }

  _isFirst (index) {
    return index === 0
  }

  getNodeKey (node, index) {
    return node.id ? node.id : index
  }

  _getDataLocation (index) {
    return [this.level + 1, index]
  }
}

window.customElements.define('isu-tree', IsuTree)
