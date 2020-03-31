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

  constructor() {
    super();
  }

  static get template() {
    return html`
       <style include="h2-tree-shared-styles">
       
       </style>
        <template is="dom-if" if="[[requireQuery]]">
          <h2-input type="text" value="{{keyword}}"></h2-input>
        </template>
        <template is="dom-repeat" items="{{root.childNodes}}" index-as="index">
          <h2-tree-node show-checkbox="{{showCheckbox}}" 
            accordion="[[accordion]]" level="1" id="{{item.nodeId}}"
            key="[[getNodeKey(item, index)]]" node="{{item}}"  
            default-expand-all="[[defaultExpandAll]]"
            show-radio="{{showRadio}}" indent="[[indent]]"
            data-location="[[_getDataLocation(index)]]" 
          ></h2-tree-node>
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
      root: {
        type: Node,
        notify: true,
        reflectToAttribute: true
      }
    }
  }

  static get is() {
    return "h2-tree";
  }

  static get observers() {
    return ['_keywordChanged(keyword)', '_rootChanged(root.childNodes.*)']
  }

  _keywordChanged(keyword) {
    console.log('before', this.root)
    const self = this

    this.store.filter(keyword)
    // this.set('store', {...this.store})
    // while( th)
    // // const treeNodes = this.__getAllTreeNode()
    // //
    // const getVisibleElement = function (node) {
    //   if ( node.childNodes ) {
    //     node.childNodes.forEach((item,index) => {
    //       self.set(``)
    //     })
    //   }
    // }



    console.log('after', this.store.root)
    console.log(this.root)
  }
  _rootChanged(root) {
    console.log('root', root)
  }
  __getAllTreeNode() {
    let allCustomElements = [];

    const findAllPaperRadioButton = (nodes) =>{
      for (let i = 0, el; el = nodes[i]; ++i) {
        if (el.localName === 'h2-tree-node') {
          allCustomElements.push(el);
        }
        // If the element has shadow DOM, dig deeper.
        if (el.shadowRoot) {
          findAllPaperRadioButton(el.shadowRoot.querySelectorAll('*'));
        }
      }
    }

    findAllPaperRadioButton(document.querySelectorAll('*'));
    return allCustomElements
  }

  connectedCallback() {
    super.connectedCallback();
    //是否有子元素作为模板
    // this.slot = !!
  }

  ready() {
    super.ready()
    const store = new TreeStore({
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
      filterNodeMethod: this.filterNodeMethod,
    });
    console.log('this',this)
    this.set('store',  store)
    this.set('root',  store.root)
  }
  filterNodeMethod(value, data) {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  }

  getNodeKey(node, index) {
    return node.id ? node.id : index
  }

  _getDataLocation(index) {
    return [this.level + 1, index]
  }

}

window.customElements.define(H2Tree.is, H2Tree);
