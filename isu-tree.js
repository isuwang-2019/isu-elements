import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/isu-tree-shared-styles.js';
import './isu-tree-node.js';
import './isu-input.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import TreeStore from './utils/tree/tree-store.js'
import Node from "./utils/tree/node";

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
 *    <isu-tree id="tree5" show-checkbox require-query></isu-tree>
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

  static get template() {
    return html`
       <style include="isu-tree-shared-styles">
       
       </style>
       <template is="dom-if" if="[[requireQuery]]">
          <isu-input type="text" value="{{searchWord}}"></isu-input>
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
`;
  }

  static get properties() {
    return {
      data: {
        type: Array
      },
      /**
       * The value of the input number
       *
       * @type Number
       * @default 1
       */
      requireQuery: {
        type: Boolean,
        value: false
      },
      /**
       * 是否显示多选框
       * */
      showCheckbox: {
        type: Boolean,
        value: false
      },
      /**
       * 是否显示单选框
       * */
      showRadio: {
        type: Boolean,
        value: false
      },
      /**
       * 是否默认展开所有节点
       * */
      defaultExpandAll: {
        type: Boolean,
        value: false
      },
      /**
       * 手风琴模式，一次只展示一个
       * */
      accordion: {
        type: Boolean,
        value: false
      },
      /**
       * 需要返回的key的集合的指定字段
       * */
      key: {
        type: String,
        value: 'id'
      },
      indent: {
        // 每一层缩进多少像素
        type: Number,
        value: 18
      },
      isTree: {
        type: Boolean,
        value: true
      },
      dataLocation: {
        type: Array
      },
      props: {
        type: Object,
        value() {
          return {
            children: 'children',
            label: 'label',
            disabled: 'disabled'
          };
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
       * 搜索条件
       * */
      searchWord: {
        type: String
      },
      /**
       * 选中的对象的集合
       * */
      bindItems: {
        type: Array,
        notify: true
      },
      /**
       * 选中的对象的id的集合
       * */
      bindItemKeys: {
        type: Array,
        notify: true
      },
      /**
       * 默认选中的key集合
       * */
      defaultCheckedKeys: {
        type: Array
      },
      /**
       * 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点
       * */
      checkOnClickNode: {
        type: Boolean,
        value: false
      }
    }
  }
  static get observers() {
    return [
      '_childNodesChanged(node.childNodes.*)',
      '_isFirst(isFirst)',
      '_dataChanged(data)'
    ]
  }

  _childNodesChanged(target) {
    const self = this
    self.addEventListener('check-button', (e) => {
      self.debounce('_setBindItemsChanged', self._setBindItemsChanged.bind(self, e), 200)
    });
    self.addEventListener('single-check', (e) => {
      self.debounce('_setSingleBindItemsChanged', self._setSingleBindItemsChanged.bind(self, e), 200)
    });
    self.addEventListener('arrow-check', (e) => {
      this.dispatchEvent(new CustomEvent('tree-arrow-check', {detail: {selectedItem: self.bindItems[0]}, bubbles: true, composed: true}));
    });
  }

  _setBindItemsChanged(e) {
    if (!this.checkOnClickNode) {
      this.set('bindItems', e.detail.checkedNodes)
      this.set('bindItemKeys', e.detail.checkedKeys)
    }
  }

  _setSingleBindItemsChanged(e) {
    this.set('bindItems', Array.prototype.concat([], e.detail.data))
    this.set('bindItemKeys', Array.prototype.concat([], e.detail.data[this.key]))
  }

  _dataChanged(data) {
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
      });
      this.set('store',  store)
      this.set('node',  store.root)
    }

  }

  _isFirst(index) {
    return index === 0
  }

  getNodeKey(node, index) {
    return node.id ? node.id : index
  }

  _getDataLocation(index) {
    return [this.level + 1, index]
  }

}

window.customElements.define('isu-tree', IsuTree);
