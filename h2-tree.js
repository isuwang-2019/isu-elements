import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/h2-tree-shared-styles.js';
import './h2-tree-node.js'

/**
 * @customElement
 * @polymer
 * @demo demo/h2-button/index.html
 */
class H2Tree extends PolymerElement {

  constructor() {
    super();
  }

  static get template() {
    return html`
     <style include="h2-tree-shared-styles">
     
     </style>
      <template is="dom-repeat" items="{{data}}" index-as="index">
        <h2-tree-node show-checkbox="{{showCheckbox}}"
          key="[[getNodeKey(item, index)]]" child="[[item]]"  level="1"
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

  getNodeKey(node, index) {
    return node.id ? node.id : index
  }

  showCheckbox(child, showCheckbox) {
    return child.children.length && showCheckbox
  }

  _getDataLocation(index) {
    return [this.level + 1, index]
  }

}

window.customElements.define(H2Tree.is, H2Tree);
