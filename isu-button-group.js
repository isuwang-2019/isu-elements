import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import { BaseBehavior } from './behaviors/base-behavior'
import { html, PolymerElement } from '@polymer/polymer'
import '@polymer/iron-collapse'
import './behaviors/isu-elements-shared-styles'
import './isu-button'
/**
 *
 * `isu-button-group`
 *
 * Example:
 * ```html
 * <isu-button-group label="测试">
 * <div bind-item="1">测试1</div>
 * <div bind-item="2">测试2</div>
 * <div bind-item="3">测试3</div>
 * </isu-button-group>
 *
 *
 * <isu-button-group items="[[ items ]]" label="测试" attr-for-label="label"></isu-button-group>
 *
 * items = [
 * {label: "测试1", value: "1"},
 * {label: "测试2", value: "2"},
 * {label: "测试3", value: "3"}
 * ]
 *
 * ```
 *
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * |Custom property | Description | Default|
 * |----------------|-------------|----------|
 * |`--isu-button-group-button` | The style of the trigger button | {}
 * |`--isu-button-group-dropdown` | The style of the dropdown menu | {}
 *
 * @customElement
 * @polymer
 * @demo demo/isu-button-group/index.html
 */
class IsuButtonGroup extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: inline-block;
        min-width: 70px;
        outline: none;
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }

      .trigger {
        width: 100%;
        height: 100%;
        display: flex;
        border-radius: var(--isu-ui-border-radius);
        @apply --isu-button-group-button;
      }
      
      .trigger__label {
        flex: 1;
      }
      
      :host([divided]) .trigger__label::after {
        width: 2px;
        border-right: 1px solid lightgray;
        content: '|';
        color: transparent;
        float: right;
      }
      
      /*下拉列表*/
      :host .dropdown-menu {
        position: fixed;
        background: #fff;
        color: var(--isu-ui-color_skyblue);
        flex-flow: column nowrap;
        box-sizing: border-box;
        z-index: 999;
        font-size: 1em;
        text-align: center;
        background-clip: padding-box;
        --iron-collapse-transition-duration: 200ms;
        overflow: auto;
        @apply --isu-button-group-dropdown;
      }
      
      .dropdown-menu::-webkit-scrollbar {
        display: none;
      }
      
      .container {
        border-radius: var(--isu-ui-border-radius);
        border: 1px solid var(--isu-ui-color_skyblue);
      }

      .item, ::slotted(*) {
        display: block;
        cursor: pointer;
        margin: 0px;
        line-height: 20px;
        white-space: nowrap;
        font-size: 0.9em;
        text-align: center;
        outline: none;
      }
      
      /*hover*/
      .item:hover, ::slotted(*:hover) {
        color: #fff;
        background: var(--isu-ui-bg);
      }
      
      .trigger__icon {
        transition: transform .2s ease-in-out
      }
      
      :host([opened]) .trigger__icon {
        transform: rotate(180deg);
        transition: transform .2s ease-in-out
      }
      
      :host([size=small]) {
        width: 90px;
        height: 30px;
      }
      
      :host([size=medium]) {
        width: 120px;
        height: 35px;
      }
     
     :host([size=large]) {
        width: 150px;
        height: 40px;
     }
     
     :host([disabled]) {
        cursor: not-allowed;
        color: #fff;
      }
     .item([disabled]) {
       background: #aeaeae !important;
       cursor: not-allowed;
       color: #fff;
     }
      
    </style>
    
    <isu-button class="trigger" on-mouseover="toggle" on-mouseout="close"  disabled="[[disabled]]">
      <div class="trigger__label">[[ label ]]</div>
      <iron-icon class="trigger__icon" icon="icons:expand-more"></iron-icon>
    </isu-button>
    
    <iron-collapse id="collapse" on-mouseover="toggle" on-mouseout="close" disabled="[[disabled]]" class="dropdown-menu" opened="[[ opened ]]" on-click="_onButtonDropdownClick">
      <div class="container">
       <template is="dom-repeat" items="[[ items ]]" filter="_hasPermission">
         <paper-button class="item" bind-item="[[ item ]]" disabled="[[item.disabled]]">[[ getValueByKey(item, attrForLabel, 'Unknown') ]]</paper-button>
       </template>
       <slot id="itemSlot"></slot>
      </div>
    </iron-collapse>
`
  }

  static get properties () {
    return {
      /**
       * Size of the action group button.options:small/medium/large.Default option:medium
       *
       * @type String
       * @default medium
       */
      size: {
        type: String,
        value: 'medium',
        reflectToAttribute: true
      },
      /**
       * Label of the action group.
       *
       * @type String
       * @default
       */
      label: {
        type: String
      },
      /**
       * Return true if the action group is expanded.
       * @type Boolean
       * @default false
       */
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * The dropdown items.
       * @type Array
       */
      items: {
        type: Array
      },

      /**
       * Attribute name for label.
       * @type String
       * @default 'label'
       */
      attrForLabel: {
        type: String,
        value: 'label'
      },
      /**
       * The Function called when user click on every item on dropdownlist.
       * @type Object
       * @default
       */
      onItemClick: {
        type: Object
      },
      /**
       * Return true if the button-group element is disabled
       * @type Boolean
       * @default false
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * The items will hide when user clicks one item
       * @type Boolean
       * @default false
       * */
      hideItemsOnClick: {
        type: Boolean,
        value: false
      },
      /**
       * Whether to show itself or not
       */
      hasShow: {
        type: String,
        value: 'true'
      }
    }
  }

  static get observers () {
    return ['_hasShow(hasShow, items)']
  }

  static get is () {
    return 'isu-button-group'
  }

  _hasShow (hasShow, items) {
    let flag = (hasShow === 'true') && items.length > 0
    if (flag) {
      // 如果selectItems里面的每一项都是false,那么整个按钮组影藏
      flag = !items.every(e => ('permission' in e) && !e.permission)
    }
    this.style.display = !flag ? 'none' : 'inline-block'
  }

  connectedCallback () {
    super.connectedCallback()
    window.addEventListener('scroll', e => {
      this.close()
    })
  }

  /**
   * Expand the group.
   */
  open () {
    this.opened = true
  }

  /**
   * Collpase the group.
   */
  close () {
    this.opened = false
  }

  /**
   * Toggle the group.
   */
  toggle (e) {
    if (!this.disabled) {
      const { top, left } = this.getElemPos(this)
      const _top = top + this.clientHeight

      this.$.collapse.style.top = _top + 'px'
      this.$.collapse.style.left = left + 'px'
      // 当外界设置了下拉框的宽度时，取外界的宽度，否则取按钮的宽度
      this.$.collapse.style.width = (window.getComputedStyle(this.$.collapse).inlineSize !== 'auto') ? window.getComputedStyle(this.$.collapse).inlineSize : this.clientWidth + 'px'
      this.opened = !this.opened
    }
  }

  getElemPos (obj) {
    const { x, y } = obj.getBoundingClientRect()
    return { top: y + 2, left: x }
  }

  _onButtonDropdownClick (e) {
    const target = e.target
    const bindItem = e.target.bindItem || e.target.getAttribute('bind-item')

    if (this.hideItemsOnClick) {
      this.opened = false
    }
    this.dispatchEvent(new CustomEvent('item-click', { detail: { target, bindItem } }))
  }

  /**
   * Whether the item has the permission to show or not
   * */
  _hasPermission (item) {
    const permission = 'permission' in item
    return !permission || (permission && item.permission)
  }
}

window.customElements.define(IsuButtonGroup.is, IsuButtonGroup)
