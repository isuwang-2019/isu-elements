
import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/h2-tree-shared-styles.js';
import '@polymer/paper-styles/default-theme.js';
import '@polymer/paper-checkbox';
import {BaseBehavior} from "./behaviors/base-behavior";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/paper-radio-button';
/**
 * @customElement
 * @polymer
 * @demo demo/h2-tree/index.html
 */
class H2TreeNode extends mixinBehaviors([BaseBehavior], PolymerElement) {
  
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
        position: relative;
      }
      paper-checkbox.half{
        --paper-checkbox-unchecked-background-color: var(--primary-color);
        --paper-checkbox-unchecked-color: var(--primary-color);
        @apply --paper-checkbox-half
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
         {{node.checked}}
          <paper-checkbox 
            class="checkbox-item half" 
            class$="[[getHalfClass(isIndeterminate)]]"
            checked="{{ node.checked }}" 
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
            checked="{{ node.checked }}" 
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
      <template is="dom-if" if="[[isShow]]">
        <template is="dom-repeat" items="{{node.childNodes}}" index-as="index">
          <h2-tree-node
            show-checkbox="[[showCheckbox]]"
            show-radio="[[showRadio]]"
            is-checked="{{isChecked}}"
            search-word="[[searchWord]]"
            key="[[getNodeKey(item, index)]]"
            node="{{item}}" id="{{item.nodeId}}"
            default-expand-all="[[defaultExpandAll]]"
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
      isChecked: {
        type: Boolean,
        value: false
      },
      visible: {
        type: Boolean,
        value: true
      },
      id: {
        type: String
      },
      searchWord: {
        type: String
      },
      isIndeterminate: {
        type: Boolean,
        value: false
      }
    }
  }

  static get is() {
    return "h2-tree-node";
  }

  static get observers() {
    return [
      '_defaultExpandAllChanged(defaultExpandAll)',
      '_searchWordChanged(searchWord)',
      '_childNodesChanged(node.childNodes.*)',
      '_isIndeterminateChanged(isIndeterminate)',
      '_notifyDataChanged(isChecked)',
      '_notifyDataChanged(node.checked)'
    ]
  }

  connectedCallback() {
    super.connectedCallback();
    const parent = this.parentNode.host || this.parentNode
    if (parent.isTree) {
      this.tree = parent
    } else {
      this.tree = parent.parentNode.host.tree
    }
  }

  // _nodePropertyChanged(node) {
  //   console.log(node)
  // }

  getHalfClass(indeterminate) {
    return indeterminate === true ? 'half' : ''
  }


  _isIndeterminateChanged(isIndeterminate) {
    console.log('isIndeterminate', isIndeterminate)
    if (!this.node.disabled && isIndeterminate) {
      this.set('isIndeterminate', isIndeterminate)
      // console.log('node.checked', this.node.checked)
      // this._notifyDataChanged()
    }
  }

  _childNodesChanged (target) {
    console.log('target', target)
    this._showNodeFilter()
    const {path, value} = target
    if(path.includes('checked')) {
      this.__setNodeChecked(this)
    }
    // this._notifyDataChanged(this.isChecked)
  }

  _searchWordChanged(searchWord) {
    this._showNodeFilter()
  }

  _showNodeFilter () {
    const self = this
    const visible = self.filterNode(self.searchWord, self.node)
    self.set('node.visible', visible)
  }

  filterNode(searchWord, node) {
    if (!node) {
      return false
    }
    if (!searchWord) {
      return true
    }
    const self = this
    const {data, childNodes} = node
    const selfVisible = data.label.includes(searchWord)
    const childVisilbe = childNodes.some(childNode => {
      return self.filterNode(searchWord, childNode)
    })
    return selfVisible || childVisilbe
  }

  _defaultExpandAllChanged(defaultExpandAll) {
    this.isShow = true
    this.rotate = 0
  }
  _getNextLevel(level) {
    return level + 1
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

  __checkedRadioChangeHandler(e) {
    e.stopPropagation()

    const allPaperRadioButton = this.__getAllPaperRadioButton()
    allPaperRadioButton.forEach(item => item.checked = false )
    this.isChecked = e.target.checked

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
    const isChecked = e.target.checked
    if(this.isIndeterminate && isChecked) {
      this.__setNodeChecked(this)
    }
    this._notifyDataChanged(isChecked)

    // this.__setNodeChecked(this)
    // const self = this
    // const isChecked = e.target.checked
    // self._notifyDataChanged(isChecked)
    // self.__getParentChecked(self)

    // this.node.setChecked(e.target.checked, !this.tree.checkStrictly);
    // const isChecked = this.__getChecked(this.node)
    // this.set('isChecked', isChecked)
    // this.set('isIndeterminate', false)
    // this.__getParentChecked(this)


  }

  _notifyDataChanged(isChecked) {
    const self = this
    if(isChecked === undefined || isChecked === null) {
      return
    }

    // TODO  通知数据变化
    // const store = this.tree.store
    // let param = {
    //   checkedNodes: store.getCheckedNodes(),
    //   checkedKeys: store.getCheckedKeys(),
    //   halfCheckedNodes: store.getHalfCheckedNodes(),
    //   halfCheckedKeys: store.getHalfCheckedKeys()
    // }
    // this.dispatchEvent(new CustomEvent("check", {detail: {data: this.node.data, ...param}}));


  }

  __notifyDataChangedByHalfHandler (isChecked, isHalfCheck) {
    if(!isHalfCheck) { //  全选递归选中/取消选中子节点
      this._notifyDataChanged(isChecked)
    }
  }

  __getChecked(node) {
    if (!node) return false
    const checked = node.childNodes.every(childNode => childNode.checked == true)
    const childrenChecked = node.childNodes.every(childNode => {
      return this.__getChecked(childNode)
    })
    return checked && childrenChecked
  }

  __getAllPaperRadioButton() {
    let allCustomElements = [];

    const findAllPaperRadioButton = (nodes) =>{
      for (let i = 0, el; el = nodes[i]; ++i) {
        if (el.localName === 'paper-radio-button') {
          allCustomElements.push(el);
        }
        // 如果元素有shadow DOM, 那么就继续深入
        if (el.shadowRoot) {
          findAllPaperRadioButton(el.shadowRoot.querySelectorAll('*'));
        }
      }
    }

    findAllPaperRadioButton(document.querySelectorAll('*'));
    return allCustomElements
  }

  // __setParentNodeChecked(el) {
  //   if (el.parentElement && el.level !== 0) {
  //     const parentNode = el.getRootNode().host
  //     this.__setNodeChecked(parentNode)
  //     // const childNodes = parentNode.node.childNodes
  //
  //   }
  // }
  
  __setNodeChecked(ele) {
    const node = ele.node
    const noneChecked = this.__noneCheckedFn(node)
    const allChecked = this.__allCheckedFn(node)
    const halfChecked = this.__CheckHalfCheckededFn(node)
    if (noneChecked) {
      ele.set('isIndeterminate', false)
      ele.set('isChecked', false)
      ele.set('node.checked', ele.isChecked)
    } else if (halfChecked) {
      ele.set('isIndeterminate', true)
      ele.set('isChecked', false)
      ele.set('node.checked', ele.isChecked)
    } else if (allChecked) {
      ele.set('isIndeterminate', false)
      ele.set('isChecked', true)
      ele.set('node.checked', ele.isChecked)
    }
  }
  __checkSelfHalf() {

  }
  __isAllChildrenChecked(childNodes) {

  }

  __checkedClickedHandler(e) {
    e.stopPropagation()
    const self = this
    const isChecked = e.target.checked
    const recursionCheckedChildNode = (prefixKey, childNodes) => {
      childNodes.forEach((node, index) => {
        if(!node.disabled) {
          const key = `${prefixKey}.${index}.checked`
          self.set(key, isChecked)
          recursionCheckedChildNode(`${prefixKey}.${index}.childNodes`, node.childNodes)
        }
      })
    }
    const prefixKey = `node.childNodes`
    const childNodes = this.node.childNodes
    recursionCheckedChildNode(prefixKey, childNodes)
  }

  __noneCheckedFn(node) {
    const self = this
    return node.childNodes.every(childNode => !childNode.checked  && self.__noneCheckedFn(childNode))
  }

  __allCheckedFn(node) {
    const self = this
    if(node.childNodes.length === 0) {
      return true
    }
    return node.childNodes.every(childNode => childNode.checked  && self.__allCheckedFn(childNode))
  }
  __CheckHalfCheckededFn(node) {
    return !this.__noneCheckedFn(node) && !this.__allCheckedFn(node)
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
