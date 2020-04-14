import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/social-icons';
import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/isu-elements-shared-styles.js';
import {IsuFetch} from './isu-fetch';
import './isu-tree.js'


/**

 Example:
 ```html
 ```

 ## Styling

 The following custom properties and mixins are available for styling:

 |Custom property | Description | Default|
 |----------------|-------------|----------|
 |`--isu-picker-width` | The width of the picker | 300px
 |`--isu-ui-font-family` | The font family of the picker | Microsoft YaHei
 |`--isu-ui-font-size` | The font size of the picker | 14px
 |`--isu-ui-bg` | The basic color of the selected tags,collapse tr`s color when hover tr | linear-gradient(315deg, var(--isu-ui-color_lightblue)  0%, var(--isu-ui-color_skyblue) 100%)
 |`--isu-ui-red` | The color of the selected tag`s delete shape when hover the tag | linear-gradient(315deg, #f9a7c3 0%, var(--isu-ui-color_pink) 100%);

 |`--isu-picker-input` | Mixin applied to the keyword input | {}
 |`--isu-picker-tag` | Mixin applied to the chosed tags | {}
 |`--isu-select-tag-deleter` | Mixin applied to the selected tag's delete tag | {}
 |`--isu-picker-dropdown` | Mixin applied to the dropdown table | {}
 |`--collapase-table-cell` | Mixin applied to the dropdown table's cell | {}

 * @customElement
 * @polymer
 * @demo demo/isu-org-tree/index.html
 */
class IsuOrgTree extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
      <style include="isu-elements-shared-styles">
        :host {
          display: flex;
          font-family: var(--isu-ui-font-family), sans-serif;
          font-size: var(--isu-ui-font-size);
          position: relative;
          box-sizing: border-box;
        }
  
        .input-wrap {
        }
        #collapse-tree {
          position: absolute;
          z-index: 999;
          min-width: 225px;
          background: white;
          border: 1px solid lightgray;
          border-radius: 5px;
        }
        #collapse-tree[hidden] {
          visibility: hidden;
          height: 0;
          opacity: 0;
        }
        .input-div {
          width: 300px;
          height: 30px;
          border: 1px solid lightgray;
        }
  
      </style>
      <template is="dom-if" if="[[ toBoolean(label) ]]">
         <div class="isu-label">[[label]]</div>
      </template>
      
      <div class="input-wrap" id="select__container">
        <div on-focus="_inputFocus" class="input-div"></div>
        <!--<iron-input bind-value="[[value]]" id="input" class="iron-input">-->
          <!--<input id="innerInput" placeholder$="[[placeholder]]" type$="[[type]]" minlength$="[[minlength]]" rows$="[[rows]]"-->
              <!--maxlength$="[[maxlength]]" min$="[[min]]" max$="[[max]]" readonly$="[[readonly]]" on-focus="_inputFocus"-->
              <!--autocomplete="off" step="any" spellcheck="false">-->
        <!--</iron-input>-->
        <div id="collapse-tree" hidden>
          <isu-tree id="tree" data="[[treeData]]" default-expand-all></isu-tree>
        </div>
        <div class="prompt-tip__container" data-prompt$="[[prompt]]">
          <div class="prompt-tip">
            <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
            [[prompt]]
          </div>
        </div>
      </div>
`;
  }

  static get properties() {
    return {
      /**
       * 发送请求和模拟数据的组件
       */
      _fetchUtil: {
        type: Object,
        readOnly: true,
        value: function () {
          return new IsuFetch();
        }
      },
      /**
       * The label of the picker.
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the select.
       * @type {String}
       */
      placeholder: {
        type: String
      },
      /**
       *
       * The selected value of this select,  if `multi` is true,
       * the value will join with comma ( `selectedValues.map(selected => selected[this.attrForValue]).join(',')` ).
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * The selected value objects of this select.
       * @type {array}
       */
      selectedValues: {
        type: Array,
        notify: true
      },
      /**
       * The selected item.
       * @type {object}
       */
      selectedItem: {
        type: Object,
        notify: true
      },
      /**
       * A url for fetching local data, the response data of the request should be json.
       * @type {string}
       */
      src: {
        type: String
      },
      /**
       * The candidate selection of this picker.
       * @type {array}
       */
      items: {
        type: Array
      },
      /**
       * Attribute name for value.
       * @type {string}
       * @default 'value'
       */
      attrForValue: {
        type: String,
        value: "value"
      },
      /**
       * Attribute name for label.
       * @type {object}
       * @default 'label'
       */
      attrForLabel: {
        type: Object,
        value: "label"
      },

      /**
       * Set to true, if the selection is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true, if the picker is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false
      },
      /**
       * If true, hotkeys for selecting items are allowed.
       * @type {boolean}
       * @default false
       */
      enableHotkey: {
        type: Boolean,
        value: false
      },
      text: {
        type: String,
        notify: true,
        observer: '__textChanged'
      },
      shortcutKey: {
        type: String,
        value: 'Enter'
      },
      prompt: String,
      /**
       * The data of the tree
       * @type {boolean}
       * @default false
       */
      treeData: {
        type: String
      }
    };
  }

  static get is() {
    return "isu-org-tree";
  }

  static get observers() {
    return [
    ]
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("blur", e => {
      e.stopPropagation();
      setTimeout(() => { // 解决blur事件和click事件冲突的问题
        if (this.shadowRoot.activeElement && this.shadowRoot.activeElement.id === 'keywordInput') return;
        this._displayCollapse(false);
      }, 200);
    });

  }

  _inputFocus() {
    this._displayCollapse(true)
  }

  _displayCollapse(display) {
    this.$['collapse-tree'].hidden = !display
  }

  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @returns {boolean}
   */
  validate() {
    if (this.mode === 'text') {
      return this.required ? this.text : true;
    } else {
      return this.required ? (this.selectedValues && this.selectedValues.length > 0) : true;
    }
  }

}

window.customElements.define(IsuOrgTree.is, IsuOrgTree);
