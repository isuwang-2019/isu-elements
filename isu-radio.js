import { html, PolymerElement } from '@polymer/polymer'
import { BaseBehavior } from './behaviors/base-behavior'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import '@polymer/iron-selector/iron-selector'
import './behaviors/isu-elements-shared-styles.js'
/**
 * `isu-radio`
 *
 * Example:
 * ```html
 * <isu-radio label="性别" value=1></isu-radio>
 * <isu-radio label="姓名" attr-for-value="id" attr-for-label="name" value="3"></isu-radio>
 *
 * <script>
 * radio.items = [{value: 1, label: "男"}, {value: 2, label: "女"}];
 * radio2.items = [{id: 1, name: "张三"}, {id: 2, name: "李四"}, {id: 3, name: "王五"}]
 * </script>
 *
 * <isu-radio label="姓名" attr-for-value="id" attr-for-label="name" value="1" readonly></isu-radio>
 * <isu-radio label="姓名" attr-for-value="id" attr-for-label="name" required></isu-radio>
 * ```
 * @customElement
 * @polymer
 * @demo demo/isu-radio/index.html
 */
class IsuRadio extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: inline-block;
        height: 34px;
        line-height: 32px;
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }

      :host([hidden]) {
        display: none;
      }

      .radio-wrapper {
        display: flex;
      }

      .candidate-wrapper {
        display: inline-block;
        position: relative;
      }

      .candidate-items {
        display: flex;
        flex-wrap: nowrap;
        vertical-align: middle;
      }
      
      :host([required]) .candidate-wrapper::before {
          content: "*";
          color: red;
          position: absolute;
          left: -10px;
          line-height: inherit;
          @apply --isu-required
        }

      .candidate__item:first-of-type {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      .candidate__item:last-of-type {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      .candidate__item {
        height: inherit;
        line-height: inherit;
        padding: 0 10px;
        font-size: inherit;
        cursor: pointer;
        border: 1px solid #ccc;
        background-color: #ffffff;
        text-overflow: ellipsis;
        overflow: hidden;
        @apply --isu-radio-candidate__item
      }

      .candidate__item:not(:last-of-type) {
        border-right: none;
      }

      .candidate__item:hover,
      .candidate__item.iron-selected {
        background: var(--isu-ui-bg);
        color: #fff;
      }

    </style>
    <div class="radio-wrapper">
      <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class="isu-label">[[label]]</div>
      </template>
      
      <div class="candidate-wrapper">
        <iron-selector class="candidate-items" selected="{{value}}" attr-for-selected="radio-item">
          <template is="dom-repeat" items="[[items]]">
            <span class="candidate__item" radio-item="[[ getValueByKey(item, attrForValue) ]]" on-tap="itemSelected">
              [[ getValueByKey(item, attrForLabel) ]]
            </span>
          </template>
        </iron-selector>
        <div class="mask"></div>
        
      </div>
    </div>
`
  }

  static get properties () {
    return {
      /**
       * The label of the radio.
       * @attribute label
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       * The selected value of radio group.
       * @attribute selected
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * Candidates of the radio group.
       * @attribute items
       * @type {array}
       */
      items: {
        type: Array
      },
      /**
       * Set to true, if the selection is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Set to true, if the radio is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Attribute name for value.
       * @type {string}
       * @default 'value'
       */
      attrForValue: {
        type: String,
        value: 'value'
      },
      /**
       * Attribute name for label.
       * @type {string}
       * @default 'label'
       */
      attrForLabel: {
        type: String,
        value: 'label'
      },
      /**
       * If true hides the component， default false
       */
      hidden: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * If you do not have permissions, the component does not display
       * @type Boolean
       * @default true
       */
      permission: {
        type: Boolean,
        value: true,
        observer: '_permissionChange'
      },
      textValue: {
        type: String,
        notify: true
      }
    }
  }

  static get is () {
    return 'isu-radio'
  }

  static get observers () {
    return [
      '_requiredChanged(value, required, items)'
    ]
  }

  _requiredChanged (value, required, items = []) {
    if (required && items.length > 0 && value == undefined) {
      // 如果必填， 默认选中第一项
      this.value = items[0][this.attrForValue]
    }
    if (value && items.length > 0) {
      this.set('textValue', items.filter(e => e.value === value)[0].label)
    } else {
      this.set('textValue', '')
    }
  }

  _permissionChange (permission) {
    this.set('hidden', !permission)
  }

  itemSelected(e) {
    this.dispatchEvent(new CustomEvent('radio-selected'), {
      composed: true,
      bubbles: true,
      detail: this.value
    })
  }

  /**
   * Always return true.
   * @return {boolean}
   */
  validate () {
    return true
  }
}

window.customElements.define(IsuRadio.is, IsuRadio)
