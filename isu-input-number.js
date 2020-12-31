import { html, PolymerElement } from '@polymer/polymer'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import '@polymer/paper-button/paper-button'
import './behaviors/isu-elements-shared-styles.js'
import '@polymer/iron-input'
import '@polymer/iron-icon'
import '@polymer/iron-icons'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import { BaseBehavior } from './behaviors/base-behavior'

/**
 *
 * `isu-input-number`
 *
 * Example:
 * ```html
 *  <div>
 *    <h4>Basic</h4>
 *    <isu-input-number id="inputNumber"></isu-input-number>
 *    <h4>步长，相关联label</h4>
 *    <isu-input-number id="inputNumber2" step="0.01" label="数量"></isu-input-number>
 *    <h4>最大输入值，最小输入值</h4>
 *    <isu-input-number id="inputNumber3" min="0" max="10"></isu-input-number>
 *    <h4>禁用</h4>
 *    <isu-input-number id="inputNumber4" disabled></isu-input-number>
 *    <h4>不要两个控制按钮</h4>
 *    <isu-input-number id="inputNumber5" no-controls></isu-input-number>
 *    <h4>精度为2</h4>
 *    <isu-input-number id="inputNumber6" precision="2" step="0.1"></isu-input-number>
 *  </div>
 * ```
 *
 * ### Styling
 *
 * `<isu-button>` provides the following custom properties and mixins
 * for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--isu-label` | Mixin applied to the button | {}
 *
 * @customElement
 * @polymer
 * @demo demo/isu-input-number/index.html
 */
class IsuInputNumber extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: flex;
        font-family: var(--isu-ui-font-family) sans-serif;
        font-size: var(--isu-ui-font-size);
        border-radius: 4px;
        outline: none;
        line-height: var(--isu-input-number-height, 34px);
        height: var(--isu-input-number-height, 34px);
      }
      .box {
         display: inline-block;
         border: 1px solid lightgray;
         box-sizing: border-box;
         text-align: center;
         line-height: var(--isu-input-number-height, 34px);
         height: var(--isu-input-number-height, 34px);
         border-radius: 2px;
         padding: 0px;
      }
      .icon-box {
        width: var(--isu-input-number-height, 34px);
        height: var(--isu-input-number-height, 34px);
        background-color: transparent;
      }
      .icon {
        width: 20px;
      }
      .input {
        width: 120px;
        font-size: 16px;
      }
      :host([disabled]) .box:hover {
        cursor: no-drop;
      }
      :host([disabled]) .input {
        color: lightgray;
      }
      :host([no-controls]) .input {
        width: 190px;
      }
      .disabled {
        color: lightgray;
      }
      .disabled:hover {
        cursor: no-drop;
      }
      .hidden {
        display: none;
      }
    </style>
    <template is="dom-if" if="[[ toBoolean(label) ]]">
       <div class="isu-label">[[label]]</div>
    </template>
    <button id="removeButton" class="box icon-box" disabled="[[disabled]]" data-args="[[step]]" on-click="minus">
      <iron-icon class="icon" icon="icons:remove"></iron-icon>
    </button>
    <iron-input bind-value="{{value}}" id="input" disabled="[[disabled]]">
      <input id="innerInput" class="box input" placeholder$="[[placeholder]]" type="number" minlength$="[[minlength]]" rows$="[[rows]]"
          on-input="patternLimit"
          maxlength$="[[maxlength]]" min$="{{min}}" max$="{{max}}" readonly$="[[disabled]]" pattern$="[[pattern]]"
          autocomplete="off" step="any" spellcheck="false" on-change="checkNum">
    </iron-input>
    <button id="addButton" class="box icon-box" on-click="add" data-args="[[step]]" disabled="[[disabled]]">
      <iron-icon class="icon" icon="icons:add"></iron-icon>
    </button>
`
  }

  constructor () {
    super()
  }

  static get properties () {
    return {
      /**
       * The value of the input number
       *
       * @type Number
       * @default 1
       */
      value: {
        type: Number,
        value: 1,
        notify: true
      },
      /**
       * placeholder
       *
       * @type String
       * @default 请输入
       */
      placeholder: {
        type: String,
        value: '请输入'
      },
      /**
       * minimum input number
       *
       * @type Number
       * @default
       */
      min: Number,
      /**
       * maximum input number
       *
       * @type Number
       * @default
       */
      max: Number,
      /**
       * Add and subtract steps
       *
       * @type Number
       * @default 1
       */
      step: {
        type: Number,
        value: 1
      },
      /**
       * title before input number
       *
       * @type String
       * @default
       */
      label: String,
      /**
       * is disabled
       *
       * @type Boolean
       * @default false
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * Whether to display the control button or not
       *
       * @type Boolean
       * @default false
       */
      noControls: {
        type: Boolean,
        value: false
      },
      /**
       *The precision of the input number
       *
       * @type Number
       * @default
       */
      precision: Number,
      /**
       *Can only enter multiples of step, step can not be null
       *
       * @type Boolean
       * @default
       */
      stepStrictly: {
        type: Boolean,
        value: false
      },
      /**
       *If true,the input is limit to one format, is useful with method 'patternLimit'
       *
       * @type Boolean
       * @default
       */
      isPatternLimit: {
        type: Boolean,
        value: false
      }
    }
  }

  static get observers () {
    return [
      '_valueChanged(value)',
      '_noControlsChanged(noControls)',
      '_precisionChanged(precision)'
    ]
  }

  connectedCallback () {
    super.connectedCallback()

    if (this.stepStrictly) {
      this.set('value', Math.ceil(this.value / this.step) * this.step)
    }

    if (this.precision) {
      this.set('value', Number(this.value).toFixed(this.precision))
    }
  }

  _valueChanged (value) {
    if (this.min !== null && this.min !== undefined) {
      if (value <= this.min) {
        this.set('value', this.min)
        this.$.removeButton.classList.add('disabled')
      } else {
        this.$.removeButton.classList.remove('disabled')
      }
    }
    if (this.max !== null && this.max !== undefined) {
      if (value >= this.max) {
        this.set('value', this.max)
        this.$.addButton.classList.add('disabled')
      } else {
        this.$.addButton.classList.remove('disabled')
      }
    }
  }

  /**
   * Limit the pattern of the input number
   * normal example:
   * 小数点后3位小数:e.detail.target.value = e.detail.target.value.replace(/^\D*([0-9]*)(\.?)([0-9]{0,3}).*$/, '$1$2$3')
   * 正整数(包括0）：e.detail.target.value = e.detail.target.value.replace(/\D/g,'')
   * 正整数（不包括0）：if(e.detail.target.value.length==1)e.detail.target.value=e.detail.target.value.replace(/[^1-9]/,'')}else{e.detail.target.value=e.detail.target.value.replace(/\D/g,'')}
   * 整数：e.detail.target.type = 'text'
   *      e.detail.target.value = e.detail.target.value.replace(/[^-\d]/g, '')
   * */
  patternLimit (e) {
    if (this.isPatternLimit) {
      this.dispatchEvent(new CustomEvent('pattern-value-changed', { detail: { target: e.target }, bubbles: true, composed: true }))
    }
  }

  _precisionChanged (precision) {
    if (precision) {
      this.set('value', Number(this.value).toFixed(this.precision))
    }
  }

  _noControlsChanged (noControls) {
    if (noControls) {
      this.$.removeButton.classList.add('hidden')
      this.$.addButton.classList.add('hidden')
    }
  }

  minus (e) {
    this.value = this.calculate(this.value, e.currentTarget.dataArgs, '-')
  }

  add (e) {
    this.value = this.calculate(this.value, e.currentTarget.dataArgs, '+')
  }

  calculate (oldValue, step, operator) {
    let value = oldValue
    if (this.stepStrictly) {
      value = Math.ceil(value / step) * step
    }
    const decimal = step.toString().split('.')[1]
    const digit = decimal ? decimal.length : 1
    const pow = Math.pow(10, digit)
    switch (operator) {
    case '+':
      const numAdd = Math.round((Number(value) * pow + step * pow)) / pow
      return this.precision ? numAdd.toFixed(this.precision) : numAdd
    case '-':
      const numMinus = Math.round((Number(value) * pow - step * pow)) / pow
      return this.precision ? numMinus.toFixed(this.precision) : numMinus
    }
  }

  checkNum (e) {
    const decimal = this.value.toString().split('.')[1]
    const length = decimal ? decimal.length : 0
    if (this.stepStrictly) {
      this.set('value', Math.ceil(this.value / this.step) * this.step)
    }
    if (this.precision && length !== this.precision) {
      this.set('value', Number(this.value).toFixed(this.precision))
    }
  }
}

window.customElements.define('isu-input-number', IsuInputNumber)
