
import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/h2-tree-shared-styles.js';
import '@polymer/paper-checkbox';
/**
 * @customElement
 * @polymer
 * @demo demo/h2-button/index.html
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
        --paper-checkbox-unchecked-color: #C0C4CC;
      }
      .trigger__icon {
        color: #C0C4CC;
      }
    </style>
    <div class="dht-tree-twig-one">
      <div class="dht-tree-node-content" style$="{{_getIndentStyle(level, indent)}}" on-click="showNode">
        <!--箭头-->
        <template is="dom-if" if="[[child.children.length]]">
          <iron-icon class="trigger__icon" icon="icons:arrow-drop-down" style$="{{_getRotateStyle(rotate)}}"></iron-icon>
        </template>
        <!--没有子元素的时候箭头用空span代替-->
        <template is="dom-if" if="[[!child.children.length]]">
          <span class="black-span"></span>
        </template>
        <!--多选框-->
        <template is="dom-if" if="[[showCheckbox]]">
          <paper-checkbox 
            class="checkbox-item" 
            checked="{{ child.checked }}" 
            disabled="{{ child.disabled }}" 
            on-change="__checkedChangeHandler"
            on-click="_checkedClickHandler" 
            value="[[ getValueByKey(item, attrForValue) ]]">
              [[ getValueByKey(item, attrForLabel) ]]
           </paper-checkbox>
        </template>
        <!--icon图标-->
        <template is="dom-if" if="[[child.icon]]">
          <span class="icon" class$="[[child.icon]]"></span>
        </template>
         <slot ></slot>
        <!--可自定义部分-->
        <!--<node-content :node="child"></node-content>-->
        <span>[[child.label]]</span>
        <slot ></slot>
      </div>
      <!--<transition-group name="dht-tree-node">-->
      <template is="dom-repeat" items="{{child.children}}" index-as="index">
        <template is="dom-if" if="[[isShow]]">
          <h2-tree-node
            show-checkbox="[[showCheckbox]]"
            key="[[getNodeKey(item, index)]]"
            child="[[item]]"
            level="[[_getNextLevel(level)]]"
            data-location="[[_getDataLocation(index)]]"
            indent="[[indent]]"
          ></h2-tree-node>
        </template>
      </template>
      <!--</transition-group>-->
    </div>
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
      child: Object // 子节点数据
    }
  }

  static get is() {
    return "h2-tree-node";
  }

  static get observers() {
    return ['_checkedChanged(child.checked)']
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

  _getNextLevel(level) {
    return level + 1
  }

  showNode () {
    if (this.child.children.length <= 0) return false
    //操作子元素方式开启关闭
    if (this.isShow) {
      this.isShow = false
      this.rotate = -90
    } else {
      this.isShow = true
      this.rotate = 0
    }
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

  // getNodeKey(node) {
  //   return getNodeKey(this.tree.nodeKey, node.data);
  // }

  _checkedClickHandler(e) {
    e.stopPropagation()
  }


  __checkedChangeHandler(e) {
    // if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
    //   this.tree.$emit('check-change', this.node.data, checked, indeterminate);
    // }
    // this.oldChecked = checked;
    // this.indeterminate = indeterminate;
    if ( this.child.children.length > 0) {
      this.child.children.forEach(item => {
        item.checked = this.child.checked
      })
    }
    // this.checked = !
    console.log('checked', this.child.checked)
    console.log('e', e)
  }

  __checkedChange(children) {
    if (children.length > 0) {
      children.forEach(item => {
        item.checked = this.child.checked
        this.__checkedChange(item.children)
      })
    }
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
