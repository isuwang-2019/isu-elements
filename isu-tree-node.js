
import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/isu-tree-shared-styles.js';
import '@polymer/paper-styles/default-theme.js';
import '@polymer/paper-checkbox';
import {BaseBehavior} from "./behaviors/base-behavior";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/paper-radio-button';
import Node from "./utils/tree/node";
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

  static get template() {
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
            class="checkbox-item half" 
            class$="[[getHalfClass(node.indeterminate)]]"
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
            on-click="__checkedRadioClickedHandler"
            value="[[ getValueByKey(item, attrForValue) ]]">
              [[ getValueByKey(item, attrForLabel) ]]
           </paper-radio-button>
        </template>
        <!--可自定义部分-->
        <slot name="before-label"></slot>
        <span>[[node.label]]</span>
        <!--可自定义部分-->
        <slot name="after-label"></slot>
      </div>
      <!--<transition-group name="dht-tree-node">-->
      <template is="dom-if" if="{{isShow}}">
        <template is="dom-repeat" items="{{node.childNodes}}" index-as="index">
          <isu-tree-node
            show-checkbox="[[showCheckbox]]"
            show-radio="[[showRadio]]"
            is-checked="{{isChecked}}"
            search-word="[[searchWord]]" is-show="{{isShow}}"
            key="[[getNodeKey(item, index)]]"
            node="{{item}}" id="{{item.nodeId}}"
            default-expand-all="[[defaultExpandAll]]"
            level="[[_getNextLevel(level)]]"
            data-location="[[_getDataLocation(index)]]"
            indent="[[indent]]"
          >
           <slot name="before-label"></slot>
          </isu-tree-node>
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
        type: Boolean,
        value: false
      },
      /**
       * 操作子元素关闭
       * */
      isShow: {
        type: Boolean,
        value: false,
        observer: '__isShowChanged'
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
      isFirst: {
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
    return "isu-tree-node";
  }

  static get observers() {
    return [
      '_defaultExpandAllChanged(defaultExpandAll)',
      '_searchWordChanged(searchWord)',
      '_childNodesChanged(node.childNodes.*)',
      '_isIndeterminateChanged(isIndeterminate)',
      '_notifyDataChanged(isChecked)',
      '_notifyDataChanged(node.checked)',
      '_isFirst(isFirst)'
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

  _isFirst(isFirst) {
    if(!this.defaultExpandAll) {
      this.set('isShow', isFirst)
      this.set('rotate', isFirst ? 0 : -90)
    }
  }

  getHalfClass(isIndeterminate) {
    return isIndeterminate === true ? 'half' : ''
  }

  _isIndeterminateChanged(isIndeterminate) {
    if (!this.node.disabled && isIndeterminate) {
      this.set('isIndeterminate', isIndeterminate)
      this.set('node.indeterminate', isIndeterminate)
    }
  }

  _childNodesChanged (target) {
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

  __isShowChanged(isShow) {
    const self = this
    // 这里是从父节点对下面的所有子孙节点手动添加监听，防止节点折叠的时候选择父节点，子孙节点选择错误的问题。后面需要再优化
    if(isShow) {
      const recursionNotifyNodeChecked = (prefixKey, curNode) => {
        self.notifyPath(`${prefixKey}.childNodes.splices`)
        self.notifyPath(`${prefixKey}.checked`)
        const childNodes = curNode.childNodes
        childNodes.forEach((node, index) => {
          recursionNotifyNodeChecked(`${prefixKey}.childNodes.${index}`, node)
        })
      }
      recursionNotifyNodeChecked('node', this.node)
    }
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
    if (defaultExpandAll) {
      this.isShow = true
      this.rotate = 0
    }
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
      parent.shadowRoot.querySelectorAll('isu-tree-node').forEach(el => {
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
    const isChecked = e.target.checked
    const allPaperRadioButton = this.__getAllPaperRadioButton()
    allPaperRadioButton.forEach(item => item.checked = false )
    this.isChecked = isChecked
    this.set('node.checked', isChecked)

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

  }

  _notifyDataChanged(isChecked) {
    const self = this
    if(isChecked === undefined || isChecked === null) {
      return
    }

    if(this.tree) {
      const store = this.tree.store
      let param = {
        checkedNodes: store.getCheckedNodes(),
        checkedKeys: store.getCheckedKeys(),
        halfCheckedNodes: store.getHalfCheckedNodes(),
        halfCheckedKeys: store.getHalfCheckedKeys()
      }
      this.dispatchEvent(new CustomEvent("check-button", {detail: {data: this.node.data, ...param}, bubbles: true, composed: true}))
    }

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
    // 拿到所有的paper-radio-button按钮
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

  __setNodeChecked(ele) {
    const node = ele.node
    const noneChecked = this.__noneCheckedFn(node)
    const allChecked = this.__allCheckedFn(node)
    const halfChecked = this.__CheckHalfCheckededFn(node)
    if (noneChecked) {
      ele.set('isIndeterminate', false)
      ele.set('isChecked', false)
      ele.set('node.checked', ele.isChecked)
      ele.set('node.indeterminate', ele.isIndeterminate)
    } else if (halfChecked) {
      ele.set('isIndeterminate', true)
      ele.set('isChecked', false)
      ele.set('node.checked', ele.isChecked)
      ele.set('node.indeterminate', ele.isIndeterminate)
    } else if (allChecked) {
      ele.set('isIndeterminate', false)
      ele.set('isChecked', true)
      ele.set('node.checked', ele.isChecked)
      ele.set('node.indeterminate', ele.isIndeterminate)
    }
  }

  __checkedRadioClickedHandler(e) {
    e.stopPropagation()
  }

  __checkedClickedHandler(e) {
    e.stopPropagation()
    const self = this
    const isChecked = e.target.checked
    // this.set('isShow', true)
    // this.set('rotate', 0)
    // this.shadowRoot.querySelectorAll('isu-tree-node').forEach(el => {
    //   el.isShow = true
    //   el.rotate = 0
    // })
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
    this._notifyDataChanged(isChecked)
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

}

window.customElements.define(IsuTreeNode.is, IsuTreeNode);
