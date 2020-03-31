
import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/h2-tree-shared-styles.js';
import '@polymer/paper-checkbox';
import '@polymer/paper-radio-button';
/**
 * @customElement
 * @polymer
 * @demo demo/h2-tree/index.html
 */
class H2TreeNode extends PolymerElement {
  
  constructor() {
    super();
    this.noink = true;
  }

  static get template() {
    return html`
    <style include="h2-tree-shared-styles">
      .black-span {
        display: inline-block;
        width: 24px;
        height: 24px;
      }
      paper-checkbox {
        --paper-checkbox-unchecked-color: #B1B6BF;
      }
      .trigger__icon {
        color: #B1B6BF;
      }
    </style>
    <template is="dom-if" if="{{node.visible}}">
      <div class="dht-tree-twig-one">
      <div class="dht-tree-node-content" style$="{{_getIndentStyle(level, indent)}}" on-click="showNode">
        <!--箭头-->
        <template is="dom-if" if="[[node.childNodes.length]]">
          <iron-icon class="trigger__icon" icon="icons:arrow-drop-down" style$="{{_getRotateStyle(rotate)}}"></iron-icon>
        </template>
        <!--没有子元素的时候箭头用空span代替-->
        <template is="dom-if" if="[[!node.childNodes.length]]">
          <span class="black-span"></span>
        </template>
        <!--多选框-->
        <template is="dom-if" if="[[showCheckbox]]">
          <paper-checkbox 
            class="checkbox-item" 
            checked="{{ checked }}" 
            disabled="{{ node.disabled }}" 
            on-change="__checkedChangeHandler"
            on-click="__checkedClickedHandler"
            value="[[ getValueByKey(item, attrForValue) ]]">
              [[ getValueByKey(item, attrForLabel) ]]
           </paper-checkbox>
        </template>
        <!--单选框-->
        <template is="dom-if" if="[[showRadio]]">
          <paper-radio-button
            class="checkbox-item" name="radio"
            checked="{{ checked }}" 
            disabled="{{ node.disabled }}" 
            on-change="__checkedRadioChangeHandler"
            on-click="__checkedClickedHandler"
            value="[[ getValueByKey(item, attrForValue) ]]">
              [[ getValueByKey(item, attrForLabel) ]]
           </paper-radio-button>
        </template>
        <!--icon图标-->
        <template is="dom-if" if="[[node.icon]]">
          <span class="icon" class$="[[node.icon]]"></span>
        </template>
         <slot ></slot>
        <!--可自定义部分-->
        <span>[[node.label]]</span>
        <slot></slot>
      </div>
      <!--<transition-group name="dht-tree-node">-->
      <template is="dom-repeat" items="{{node.childNodes}}" index-as="index">
        <template is="dom-if" if="[[isShow]]">
          <h2-tree-node
            show-checkbox="[[showCheckbox]]"
            show-radio="[[showRadio]]"
            key="[[getNodeKey(item, index)]]"
            node="{{item}}" id="{{item.nodeId}}"
            default-expand-all="[[defaultExpandAll]]"
            checked="{{item.checked}}"
            disabled="{{item.disabled}}"
            level="[[_getNextLevel(level)]]"
            data-location="[[_getDataLocation(index)]]"
            indent="[[indent]]"
          ></h2-tree-node>
        </template>
      </template>
      <!--</transition-group>-->
    </div>
    </template>
    
`;
  }

  static get properties() {
    return {
      tree: Object,
      rotate: {
        type: Number,
        value: -90
      }, // 三角形标记
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
       * 手风琴模式，一次只展示一个
       * */
      accordion: {
        type: Boolean,
        value: false
      },
      /**
       * 是否默认展开所有节点
       * */
      defaultExpandAll: {
        type: Boolean
      },
      /**
       * 操作子元素关闭
       * */
      isShow: {
        type: Boolean,
        value: false
      },
      /**
       * 缩进
       * */
      indent: {
        type: Number,
        value: 18
      },
      dataLocation: Array, // 数据定位，表示层级和数据位置
      level: Number, // 当前层级
      node: {// 子节点数据
        type: Node,
        notify: true,
        reflectToAttribute: true
      },
      checked: {
        type: Boolean,
        value: false
      },
      disabled: {
        type: Boolean,
        value: false
      },
      visible: {
        type: Boolean,
        value: true
      },
      id: {
        type: String
      }
    }
  }

  static get is() {
    return "h2-tree-node";
  }

  static get observers() {
    return ['_defaultExpandAllChanged(defaultExpandAll)', '_visibleChanged(node.*)']
  }

  connectedCallback() {
    super.connectedCallback();
    const parent = this.parentNode.host || this.parentNode
    this.set('disabled', this.node.disabled)
    if (parent.isTree) {
      this.tree = parent
    } else {
      this.tree = parent.parentNode.host.tree
    }
  }
  _visibleChanged(visible) {
    console.log('node.*', visible)
  }
  _defaultExpandAllChanged(defaultExpandAll) {
    this.isShow = true
    this.rotate = 0
  }
  _getNextLevel(level) {
    return level + 1
  }
  _getChecked(checked, disabled) {
    return disabled ? false : checked
  }

  showNode () {
    if (this.node.childNodes.length <= 0) return false
    const parent = this.parentNode.host || this.parentNode
    if (this.isShow) {
      this.isShow = false
      this.rotate = -90
      return
    }
    //如果开启了手风琴模式，一次展示一个层级
    if (this.accordion) {
      parent.shadowRoot.querySelectorAll('h2-tree-node').forEach(el => {
        el.isShow = false
        el.rotate = -90
      })
    }
    //操作子元素方式开启关闭
    this.isShow = true
    this.rotate = 0
  }
  _getDataLocation(index) {
    return [this.level + 1, index]
  }
  _getIndentStyle(level, indent) {
    return `padding-left: ${(level + 1)*indent }px`
  }
  _getRotateStyle(rotate) {
    return `transform: rotate(${ rotate }deg)`
  }
  getNodeKey (node, index) {
    return node.id ? node.id : index
  }

  handleClick() {
    const store = this.tree.store;
    store.setCurrentNode(this.node);
    this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
    this.tree.currentNode = this;
    if (this.tree.expandOnClickNode) {
      this.handleExpandIconClick();
    }
    if (this.tree.checkOnClickNode && !this.node.disabled) {
      this.handleCheckChange(null, {
        target: { checked: !this.node.checked }
      });
    }
    this.tree.$emit('node-click', this.node.data, this.node, this);
  }
  __checkedRadioChangeHandler(e) {
    e.stopPropagation()
    const check = e.target.checked

    const allPaperRadioButton = this.__getAllPaperRadioButton()
    allPaperRadioButton.forEach(item => item.checked = false )
    this.checked = check

    const store = this.tree.store
    let param = {
      checkedNodes: store.getCheckedNodes(),
      checkedKeys: store.getCheckedKeys(),
      halfCheckedNodes: store.getHalfCheckedNodes(),
      halfCheckedKeys: store.getHalfCheckedKeys()
    }
    this.dispatchEvent(new CustomEvent("check", {detail: {data: this.node.data, ...param}}));
  }

  __checkedChangeHandler(e) {
    e.stopPropagation()

    this.node.setChecked(e.target.checked, !this.tree.checkStrictly);
    this.set('node', this.node)
    // this.set('checked', this.node.checked)
    this.__getParentChecked(this)

    const store = this.tree.store
    let param = {
      checkedNodes: store.getCheckedNodes(),
      checkedKeys: store.getCheckedKeys(),
      halfCheckedNodes: store.getHalfCheckedNodes(),
      halfCheckedKeys: store.getHalfCheckedKeys()
    }
    this.dispatchEvent(new CustomEvent("check", {detail: {data: this.node.data, ...param}}));
  }

  __getAllPaperRadioButton() {
    let allCustomElements = [];

    const findAllPaperRadioButton = (nodes) =>{
      for (let i = 0, el; el = nodes[i]; ++i) {
        if (el.localName === 'paper-radio-button') {
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

  __getParentChecked(el) {
    if (el.parentElement && el.level !== 0) {
      const parentNode = el.parentElement.parentNode.host
      if (parentNode.node.childNodes.every(item=> !item.checked )) {
        parentNode.checked = false
        this.__getParentChecked(parentNode)
      }
    }
  }

  __checkedClickedHandler(e) {
    e.stopPropagation()
  }

  getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
    const checkedNodes = [];
    const traverse = function(node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes;

      childNodes.forEach((child) => {
        if ((child.checked || (includeHalfChecked && child.indeterminate)) && (!leafOnly || (leafOnly && child.isLeaf))) {
          checkedNodes.push(child.data);
        }

        traverse(child);
      });
    };

    traverse(this);

    return checkedNodes;
  }

  handleCheckChange(value, ev) {
    this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
    this.$nextTick(() => {
      const store = this.tree.store;
      this.tree.$emit('check', this.node.data, {
        checkedNodes: store.getCheckedNodes(),
        checkedKeys: store.getCheckedKeys(),
        halfCheckedNodes: store.getHalfCheckedNodes(),
        halfCheckedKeys: store.getHalfCheckedKeys(),
      });
    });
  }

}

window.customElements.define(H2TreeNode.is, H2TreeNode);
