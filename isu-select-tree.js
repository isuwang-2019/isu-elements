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
 |`--isu-ui-font-family` | The font family of the picker | Microsoft YaHei
 |`--isu-ui-font-size` | The font size of the picker | 14px

 |`--isu-select-tree-collapse` | Mixin applied to the collapse tree | {}
 |`--isu-select-tree-input` | Mixin applied to the input div | {}
 |`--isu-label` | Mixin applied to the label | {}

 * @customElement
 * @polymer
 * @demo demo/isu-org-tree/index.html
 */
class IsuSelectTree extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
      <style include="isu-elements-shared-styles">
        :host {
          display: flex;
          width: 300px;
          height: 34px;
          line-height: 34px;
          font-family: var(--isu-ui-font-family), sans-serif;
          font-size: var(--isu-ui-font-size);
          position: relative;
          box-sizing: border-box;
        }
  
        #collapse-tree {
          position: absolute;
          z-index: 999;
          min-width: 225px;
          background: white;
          border: 1px solid lightgray;
          border-radius: 5px;
          height: 420px;
          overflow-y: auto;
          @apply --isu-select-tree-collapse
        }
        #collapse-tree[hidden] {
          visibility: hidden;
          height: 0;
          opacity: 0;
        }
        .input-div {
          width: 210px;
          height: 24px;
          line-height: 24px;
          border: 1px solid lightgray;
          flex: 1;
          font-family: 'Microsoft Yahei', sans-serif;
          font-size: inherit;
          padding: 4px 8px;
          min-width: inherit;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          @apply --isu-select-tree-input
        }
        .placeholder {
          color: #999;
        }
  
      </style>
      <template is="dom-if" if="[[ toBoolean(label) ]]">
         <div class="isu-label">[[label]]</div>
      </template>
      
      <div id="select__container">
        <div id="keywordInput" tabindex="0" on-focus="_inputFocus" class$="input-div [[getPlaceholderClass(selectedItem.label, placeholder)]]">
          [[getValued(selectedItem.label, placeholder)]]
        </div>
        <div id="collapse-tree" hidden>
          <isu-tree id="tree" data="{{treeData}}" bind-items="{{bindItems}}" default-expand-all check-on-click-node></isu-tree>
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
       * The fetch param of the url,for example: {id: 2}
       * */
      fetchParam: {
        type: Object
      },
      /**
       * The label of the select tree.
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the select.
       * @type {String}
       * @default '请选择'
       */
      placeholder: {
        type: String,
        value: '请选择'
      },
      /**
       *
       * The selected value of this select tree
       * @type {string}
       */
      value: {
        type: String,
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
       * Attribute name for value.
       * @type {string}
       * @default 'id'
       */
      attrForValue: {
        type: String,
        value: "id"
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
       * Set to true, if the select tree is readonly.
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
      /**
       * shortcut key
       * @type {string}
       * @default 'enter'
       */
      shortcutKey: {
        type: String,
        value: 'Enter'
      },
      /**
       * The prompt tip to show when input is invalid.
       * @type {string}
       */
      prompt: {
        type: String
      },
      /**
       * The prompt tip's position. top/bottom
       * @type String
       * @default ''
       */
      promptPosition: {
        type: String,
        value: ''
      },
      /**
       * The data of the tree
       * @type {array}
       * @default []
       */
      treeData: {
        type: Array,
        value: [],
        notify: true
      },
      /**
       * An array of the selected items
       * @type {array}
       */
      bindItems: {
        type: Array
      }
    };
  }

  static get is() {
    return "isu-select-tree";
  }

  static get observers() {
    return [
      '_bindItemsChange(bindItems)',
      '_srcChanged(src)',
      '_valueChanged(value)'
    ]
  }

  connectedCallback() {
    super.connectedCallback();
    const self = this
    self.$.keywordInput.addEventListener("blur", e => {
      // e.stopPropagation();
      setTimeout(() => { // 解决blur事件和click事件冲突的问题
        if (self.shadowRoot.activeElement && self.shadowRoot.activeElement.id === 'keywordInput') return;
        self._displayCollapse(false);
      }, 200);
    });
    this.addEventListener('click', e => {
      const minWidth = this.$['collapse-tree'].offsetLeft
      const maxWidth = minWidth + this.$['collapse-tree'].offsetWidth
      const minHeight = this.$['collapse-tree'].offsetTop
      const maxHeight = minHeight + this.$['collapse-tree'].offsetHeight
      if (e.offsetX >= minWidth && e.offsetX <= maxWidth && e.offsetY >= minHeight && e.offsetY <= maxHeight) {
        this.$.keywordInput.focus()
      }
    })
    this.addEventListener('tree-arrow-check', (e) => {
      this.selectedItem = e.detail.selectedItem
      this.$.keywordInput.focus()
    });
  }

  _bindItemsChange(bindItems) {
    if (bindItems) {
      this.selectedItem = bindItems[0]
      this.value = this.selectedItem && this.selectedItem[this.attrForValue]
    }
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
    return this.required ? !!this.value.trim() : true;
  }

  getValued(label, placeholder) {
    return !!label ? label : placeholder
  }

  getPlaceholderClass(label, placeholder) {
    return !!label ? '' : 'placeholder'
  }

  _valueChanged(value) {
    const self = this
    if (this.treeData.length > 0) {
      const getSuitIndex = function (items) {
        if (!items) return -1
        let index = items.findIndex(item => item[self.attrForValue] == self.value)
        if (index < 0) {
          items.forEach(item => {
            getSuitIndex(item.children)
          })
        }
        if (index >= 0) {
          self.selectedItem = items[index]
        }
        return index

      }
      getSuitIndex(this.treeData)
    }

  }

  _srcChanged(src) {
    const self = this
    if (!src) return;
    this.fetchParam = {id: this.value}
    const request = this._mkRequest(this.fetchParam);
    this._fetchUtil.fetchIt(request)
      .then(res => res.json())
      .then(data => {
        let items;
        if (this.resultPath) {
          items = this.getValueByPath(data, this.resultPath, []);
        } else {
          items = data || [];
        }
        // let findIndex = items.findIndex(item => item[this.attrForValue] == this.value);
        const getSuitIndex = function (items) {
          if (!items) return -1
          let index = items.findIndex(item => item[self.attrForValue] == self.value)
          if (index < 0) {
            items.forEach(item => {
              getSuitIndex(item.children)
            })
          }
          if (index >= 0) {
            self.selectedItem = items[index]
          }
          return index

        }
        let findIndex = getSuitIndex(items)
        // if (findIndex >= 0) {
        //   this.selectedItem = items[findIndex]
        // }
        this.set('treeData', items)
      })
      .catch(console.error);
  }

  _mkRequest(data) {
    return {
      url: this.src,
      method: "POST",
      headers: {
        "content-type": "application/json;charset=utf-8",
        "Cache-Control": "no-cache"
      },
      credentials: "include",
      body: JSON.stringify(data)
    };
  }

}

window.customElements.define(IsuSelectTree.is, IsuSelectTree);
