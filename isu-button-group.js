import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import { BaseBehavior } from './behaviors/base-behavior'
import { html, PolymerElement } from '@polymer/polymer'
import './behaviors/isu-elements-shared-styles'
import './isu-button'
import './isu-iron-fit'
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js'
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
 * |`--isu-button-group-height` | The height of the trigger button | 100%
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
        position: relative;
        min-width: 70px;
        outline: none;
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }

      .trigger {
        width: 100%;
        height: var(--isu-button-group-height, 100%);
        position: relative;
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
        width: 100%;
        font-size: 12px;
        border-collapse: separate;
        border-spacing: 0;
        text-align: left;
        border-radius: 4px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
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
        height: 34px;
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
     
     #group-collapse {
        display: flex;
        position: absolute;
        margin-top: 1px;
        border-radius: 4px;
        font-size: 12px;
        padding: 0;
        background: white;
        color: black;
        visibility: visible;
        opacity: 1;
        @apply --isu-picker-dropdown;
      }

      #group-collapse[hidden] {
        visibility: hidden;
        height: 0;
        opacity: 0;
      }
      .relative {
        position: relative;
      }
      
    </style>
    <div class$="relative [[fontSize]]" >
       <isu-button on-click="_onButtonClick"  id="group-button" class="trigger select-button" exportparts="btn" disabled="[[disabled]]" type="[[type]]" part="btn">
          <div class="trigger__label select-button">[[ label ]]</div>
          <iron-icon class="trigger__icon select-button" icon="icons:expand-more"></iron-icon>
       </isu-button>
       <isu-iron-fit id="group-collapse"  auto-fit-on-attach vertical-align="auto" horizontal-align="auto" class="dropdown-menu" no-overlap dynamic-align hidden="{{!opened}}">
          <div class="container" on-click="_onButtonDropdownClick">
           <template is="dom-repeat" items="[[ items ]]" filter="_hasPermission">
             <paper-button class="item" bind-item="[[ item ]]" disabled="[[item.disabled]]">[[ getValueByKey(item, attrForLabel, 'Unknown') ]]</paper-button>
           </template>
           <slot id="itemSlot"></slot>
          </div>
        </isu-iron-fit>
    </div>
    
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
       * Properties can be selected as default, primary, warning, danger or success
       *
       * @type String
       * @default default
       */
      type: {
        type: String
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
        reflectToAttribute: true,
        value: false
      },
      /**
       * The items will hide when user clicks one item
       * @type Boolean
       * @default true
       * */
      hideItemsOnClick: {
        type: Boolean,
        value: true
      },
      /**
       * Whether to show itself or not
       */
      permission: {
        type: Boolean,
        value: true
      },
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        computed: '__isHiddenButton(permission,items)'
      }
    }
  }

  static get is () {
    return 'isu-button-group'
  }

  __isHiddenButton (permission, items) {
    const flag = permission && items && items.some(item => item.permission || item.permission === undefined)
    return !flag
  }

  connectedCallback () {
    super.connectedCallback()
    window.addEventListener('scroll', e => {
      this.close()
    })
    const target = dom(this.$['group-collapse']).rootTarget
    const myFit = this.$['group-collapse']
    myFit.positionTarget = target || this.$['group-button']
  }

  /**
   * Expand the group.
   */
  open (e) {
    console.log('e.open.target', e.target)
    this.set('opened', true)
  }

  /**
   * Collpase the group.
   */
  close (e) {
    this.set('opened', false)
  }

  /**
   * Toggle the group.
   */
  toggle (e) {
    if (!this.disabled) {
      // const { top, left } = this.getElemPos(this)
      // const _top = top + this.clientHeight
      //
      // this.$.collapse.style.top = _top + 'px'
      // this.$.collapse.style.left = left + 'px'
      // 当外界设置了下拉框的宽度时，取外界的宽度，否则取按钮的宽度
      // this.$.collapse.style.width = (window.getComputedStyle(this.$.collapse).inlineSize !== 'auto') ? window.getComputedStyle(this.$.collapse).inlineSize : this.clientWidth + 'px'
      this.opened = !this.opened
    }
  }

  _onButtonClick () {
    const self = this
    this.toggle()
    /*
     * 在选择面板打开的时候给body注册click监听事件。以防止多个实例的时候body click事件和实例自身引用错乱的问题。
     */
    const bodyClick = function (e) {
      const path = Array.from(e.path)
      if (!path.includes(self.$['group-button']) && self.opened) {
        self.toggle()
      }
      document.removeEventListener('click', bodyClick, true)
    }
    document.addEventListener('click', bodyClick, true)
  }

  getElemPos (obj) {
    const { x, y } = obj.getBoundingClientRect()
    return { top: y + 2, left: x }
  }

  _onButtonDropdownClick (e) {
    e.stopPropagation()
    const self = this
    const target = e.target
    const bindItem = e.target.bindItem || e.target.getAttribute('bind-item')

    if (self.hideItemsOnClick) {
      self.opened = false
    }
    setTimeout(() => {
      self.dispatchEvent(new CustomEvent('item-click', { detail: { target, bindItem } }))
    }, 100)
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
