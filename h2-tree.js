import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/h2-tree-shared-styles.js';
import './h2-tree-node.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import TreeStore from './utils/tree/tree-store.js'

/**
 * @customElement
 * @polymer
 * @demo demo/h2-button/index.html
 */
class H2Tree extends mixinBehaviors(TreeStore, PolymerElement) {

  constructor() {
    super();
  }

  static get template() {
    return html`
     <style include="h2-tree-shared-styles">
     
     </style>
      <template is="dom-repeat" items="{{root.childNodes}}" index-as="index">
        <h2-tree-node show-checkbox="{{showCheckbox}}" accordion="[[accordion]]"
          key="[[getNodeKey(item, index)]]" node="[[item]]"  level="1"
          default-expand-all="[[defaultExpandAll]]"
          data-location="[[_getDataLocation(index)]]" indent="[[indent]]"
        ></h2-tree-node>
      </template>
`;
  }

  static get properties() {
    return {
      data: {
        type: Array
      },
      showCheckbox: {
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
      root: {
        type: Object
      }
    }
  }

  static get is() {
    return "h2-tree";
  }

  connectedCallback() {
    super.connectedCallback();
    //是否有子元素作为模板
    // this.slot = !!
  }

  ready() {
    super.ready()
    this.store = new TreeStore({
      data: this.data,
      lazy: this.lazy,
      props: this.props,
      load: this.load,
      currentNodeKey: this.currentNodeKey,
      checkStrictly: this.checkStrictly,
      checkDescendants: this.checkDescendants,
      defaultCheckedKeys: this.defaultCheckedKeys,
      defaultExpandedKeys: this.defaultExpandedKeys,
      autoExpandParent: this.autoExpandParent,
      defaultExpandAll: this.defaultExpandAll,
      filterNodeMethod: this.filterNodeMethod
    });
    this.root = this.store.root
  }

  getNodeKey(node, index) {
    return node.id ? node.id : index
  }

  _getDataLocation(index) {
    return [this.level + 1, index]
  }

}

window.customElements.define(H2Tree.is, H2Tree);
