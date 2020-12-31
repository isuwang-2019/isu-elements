import { html, PolymerElement } from '@polymer/polymer'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'

import { BaseBehavior } from './behaviors/base-behavior'
import './behaviors/isu-elements-shared-styles.js'
import '@polymer/paper-checkbox'
/**
 *
 * `isu-checkbox-group`
 *
 * Example:
 * ```html
 * <isu-checkbox-group label="材料" value="0" items="{{items}}"></isu-checkbox-group>
 *
 * ```
 *
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * |Custom property | Description | Default|
 * |----------------|-------------|----------|
 * |`--isu-checkbox-group-label` | Mixin applied to the label of checkbox | {}
 * |`--isu-checkbox-group-checked-color` | Mixin applied to color of the checkbox when it is checked | #0099FF
 *
 * @customElement
 * @polymer
 * @demo demo/isu-checkbox-group/index.html
 */
class IsuCheckboxGroup extends mixinBehaviors(BaseBehavior, PolymerElement) {
  static get template () {
    return html`
      <style include="isu-elements-shared-styles">
        :host {
          display: flex;
          flex-wrap: nowrap;
          position: relative;
          line-height: var(--isu-checkbox-group-height, 34px);
          font-family: var(--isu-ui-font-family), sans-serif;
          font-size: var(--isu-ui-font-size);
        }
  
        #checkbox-container {
          position: relative;
          display: flex;
          align-items: center;
          flex-direction: row;
          @apply --isu-checkbox-group-container;
        }
  
        :host([direction=column]) #checkbox-container {
          flex-direction: column;
          align-items: start;
        }
        
        :host([direction=column]) .checkbox-item {
          margin-bottom: 6px;
        }
        .checkbox-item {
          margin-left: 6px;
          --paper-checkbox-checked-color: var(--isu-ui-color_skyblue);
        }
        
        :host([border]) .checkbox-item {
          border: 1px solid lightgray;
          padding: 7px 13px;
          border-radius: 4px;
        }
        
        :host([border]) .checkbox-item[checked] {
          border: 1px solid var(--isu-ui-color_skyblue);
        }
        .readonly-shade {
          min-width: 100px;
          width: 100%;
          height: 34px;
          position: absolute;
          z-index: 999;
          top: 0;
        }
        
         :host([required]) .checkbox-container::before {
          content: "*";
          color: red;
          position: absolute;
          left: -10px;
          line-height: inherit;
          @apply --isu-required
        }
        
        .inline-block {
          display: inline-block;
          position: relative;
        }
        :host([readonly]) .inline-block {
          background: #f4f4f4;
        }
        
      </style>
      <div class="isu-label">[[label]]</div>
      <div id="checkbox-container" class="checkbox-container">
        <div class="checkboxes">
           <template is="dom-repeat" items="[[ _items ]]" index-as="index">
            <div class="inline-block">
              <paper-checkbox noink class="checkbox-item" checked="{{ item.checked }}" disabled="{{ item.disabled }}" on-change="__checkedChangeHandler" value="[[ getValueByKey(item, attrForValue) ]]">
                [[ getValueByKey(item, attrForLabel) ]]
              </paper-checkbox>
              <template is="dom-if" if="[[readonly]]">
                <div id$="readonly[[index]]" class="readonly-shade"></div>
              </template>
              
            </div>
            
           </template>
        </div>
        <!--<div id="readonly" class="readonly-shade">-->
        <!--</div>-->
        
        <div class="prompt-tip__container" data-prompt$="[[prompt]]">
        <div class="prompt-tip">
          <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
          [[prompt]]
        </div>
        <div class="mask"></div>
      </div>
    `
  }

  static get properties () {
    return {
      /**
       * The label of the Checkbox
       *
       * @attribute label
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       * Candidates of the checkbox group.
       * @attribute items
       * @type {array}
       */
      items: {
        type: Array
      },

      _items: {
        type: Array,
        computed: '__computedInnerItems(items, value)'
      },
      /**
       * The selected value of checkbox group.
       * @attribute value
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * The selected value items of checkbox group.
       * @attribute value
       * @type {array}
       */
      selectedValues: {
        type: Array,
        notify: true
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
       * Set to true if the selection is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * A limit on the number of optional items, smallest optional
       * @type Number
       * @default
       * */
      min: {
        type: Number
      },
      /**
       * A limit on the number of optional items, biggest optional
       * @type Number
       * @default
       * */
      max: {
        type: Number
      },
      /**
       * The prompt tip to show when input is invalid.
       * @type String
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
       * Set to true if the selection is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    }
  }

  static get is () {
    return 'isu-checkbox-group'
  }

  static get observers () {
    return [
      '__valueChanged(value, items)',
      'getInvalidAttribute(required, min, max, value)',
      '__readonlyChanged(readonly)'
    ]
  }

  __readonlyChanged (readonly) {
    // if (readonly) {
    //   this.$.readonly.style.width = this.querySelector('.checkboxes')
    // }
  }

  __computedInnerItems (items = [], value = '') {
    const values = this.__parseValues(value)
    const selectValues = value.split(',')
    const _items = items.map(item =>
      Object.assign({}, item, { checked: values.some(val => val === item[this.attrForValue] + '') }))
    if (this.min) {
      if (selectValues.length <= this.min && selectValues.length > 0) {
        _items.forEach(item => {
          if (item.checked) item.disabled = true
        })
      }
    }
    if (this.max) {
      if (selectValues.length >= this.max) {
        _items.forEach(item => {
          if (!item.checked) item.disabled = true
        })
      }
    }
    this.set('_items', _items)
    return _items
  }

  __checkedChangeHandler () {
    const selectValues = this._items.filter(item => !!item.checked).map(item => item[this.attrForValue])
    this.value = selectValues.length > 0 ? selectValues.join(',') : undefined
  }

  /**
   * @private
   */
  __valueChanged (value = '', items = []) {
    const values = this.__parseValues(value)

    this.selectedValues = items.filter(item => values.some(val => val === item[this.attrForValue] + ''))
  }

  /**
   * @private
   */
  __parseValues (value = '') {
    return value.split(',').map(val => val.trim())
  }

  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @return {boolean}
   */
  validate () {
    super.validate()

    let valid = true

    if (this.required) {
      valid = this.selectedValues && this.selectedValues.length > 0
    }

    if (this.min) {
      valid = this.selectedValues && this.selectedValues.length >= this.min
    }

    if (this.max) {
      valid = this.selectedValues && this.selectedValues.length <= this.max
    }

    return valid
  }
}

window.customElements.define(IsuCheckboxGroup.is, IsuCheckboxGroup)
