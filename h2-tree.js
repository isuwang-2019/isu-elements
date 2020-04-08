import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/h2-tree-shared-styles.js';
import './h2-tree-node.js';
import './h2-input.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import TreeStore from './utils/tree/tree-store.js'
import Node from "./utils/tree/node";

/**
 * @customElement
 * @polymer
 * @demo demo/h2-button/index.html
 */
class H2Tree extends mixinBehaviors(TreeStore, PolymerElement) {

  static get template() {
    return html`
       <style include="h2-tree-shared-styles">
       
       </style>
       <template is="dom-if" if="[[requireQuery]]">
          <h2-input type="text" value="{{searchWord}}"></h2-input>
        </template>
        <template is="dom-repeat" items="{{node.childNodes}}" index-as="index">
          <h2-tree-node show-checkbox="{{showCheckbox}}" search-word="[[searchWord]]"
            is-checked="{{isChecked}}" is-first="[[_isFirst(index)]]"
            accordion="[[accordion]]" level="1" id="{{item.nodeId}}"
            key="[[getNodeKey(item, index)]]" node="{{item}}"  
            default-expand-all="[[defaultExpandAll]]"
            show-radio="{{showRadio}}" indent="[[indent]]"
            data-location="[[_getDataLocation(index)]]" 
          >
          <div slot="before-label">
            <slot name="before-label">
            </slot>
          </div>
          </h2-tree-node>
        </template>
`;
  }

  static get properties() {
    return {
      data: {
        type: Array
      },
      /**
      * 是否需要搜索
      * */
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
      }
    }
  }
  static get observers() {
    return [
      '_childNodesChanged(node.childNodes.*)',
      '_isFirst(isFirst)'
    ]
  }

  _childNodesChanged(target) {
    const self = this
    self.addEventListener('check-button', (e) => {
      self.debounce('_setBindItemsChanged', self._setBindItemsChanged.bind(self, e), 200)
    });
  }

  _setBindItemsChanged(e) {
    this.set('bindItems', e.detail.checkedNodes)
    this.set('bindItemKeys', e.detail.checkedKeys)
    console.log(this.bindItems)
    console.log(this.bindItemKeys)
  }

  ready() {
    super.ready()
    const store = new TreeStore({
      data: this.data,
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

window.customElements.define('h2-tree', H2Tree);
