import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/iron-input';
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import '@polymer/iron-icons/social-icons';

import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/isu-elements-shared-styles.js';
/**
 *
 * Example:
 * ```html
 * <isu-input label="文本框"></isu-input>
 * <isu-input label="数字框" type="number"></isu-input>
 * <isu-input label="电话" type="tel" maxlength="11"></isu-input>
 * <isu-input label="密码框" type="password"></isu-input>
 * <isu-input label="颜色框" type="color"></isu-input>
 * <isu-input label="日期框" type="date"></isu-input>
 * <isu-input label="日期时间框" type="datetime-local"></isu-input>
 * ```
 *
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * |Custom property | Description | Default|
 * |----------------|-------------|----------|
 * |`--isu-input-label` | Mixin applied to the label of input | {}
 * |`--isu-input` | Mixin applied to the input | {}
 * |`--isu-input-unit` | Mixin applied to unit of the input value | {}
 * |`--isu-input-width` | The width of the isu-input | 300px
 *
 *
 * @customElement
 * @polymer
 * @demo demo/isu-input/index.html
 */

class IsuInput extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: flex;
        width: var(--isu-input-width, 300px);
        height: 34px;
        line-height: 34px;
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }

      :host .input__container {
        flex: 1;
        display: flex;
        line-height: inherit;
        min-width: 0;
        position: relative;
      }
      
      :host([readonly]) .input__container {
        pointer-events: none;
        /*opacity: 0.7;*/
        cursor: no-drop;
      }

      #input {
        height: inherit;
        min-width: inherit;
        display: flex;
        flex: 1;
      }

      #innerInput {
        flex: 1;
        font-family: 'Microsoft Yahei', sans-serif;
        font-size: inherit;
        height: inherit;
        padding: 4px 8px;
        width: 100%;
        min-width: inherit;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;

        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        @apply --isu-input;
      }

      :host(:not([readonly])) input:focus {
        border-color: #66afe9;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
      }

      :host .input-unit {
        background: var(--isu-ui-bg);
        color: var(--isu-ui-color_white);
        white-space: nowrap;

        height: inherit;
        line-height: inherit;

        padding-left: 8px;
        padding-right: 8px;
        @apply --isu-input-unit;
      }

      /*前缀单位*/
      :host .prefix-unit {
        border: 1px solid #ccc;
        border-right: none;
        border-radius: 4px 0 0 4px;
      }

      /*后缀单位*/
      :host .suffix-unit {
        border: 1px solid #ccc;
        border-left: none;
        border-radius: 0 4px 4px 0;
      }

      :host([prefix-unit]) input {
        border-left: none !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }

      :host([suffix-unit]) input {
        border-right: none !important;
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }

      /*隐藏输入框的上下小箭头Chrome*/
      :host input::-webkit-outer-spin-button,
      :host input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
      }

      /*隐藏输入框的上下小箭头Firefox*/
      :host input {
        -moz-appearance: textfield;
      }

      :host input::-moz-placeholder {
        color: #999;
        opacity: 1;
      }

      :host input:-ms-input-placeholder {
        color: #999;
      }

      :host input::-webkit-input-placeholder {
        color: #999;
      }

      :host([readonly]) input {
        cursor: default;
      }

      :host([required]) .input__container::before {
        content: "*";
        color: red;
        position: absolute;
        left: -10px;
        line-height: inherit;
      }

      :host([data-invalid]) #innerInput {
        border-color: var(--isu-ui-color_pink);
      }
      .clear {
        width: 12px;
        padding: 0 5px;
        z-index: 1;
        position: absolute;
        right: 5px;
      }
      .icon-clear {
        width: 12px;
        height: 12px;
        border: 1px solid #ccc;
        border-radius: 50%;
        color: #ccc;
        display: none;
      }
      :host([clearable]) .input__container:hover .icon-clear {
        display: inline-block;
      }
      :host .iron-input {
        position: relative;
      }
      .icon-password {
        width: 14px;
        height: 14px;
        color: #ccc;
        display: none;
      }
       :host([show-password]) .input__container:hover .icon-password {
        display: inline-block;
      }
    </style>
    <template is="dom-if" if="[[ toBoolean(label) ]]">
       <div class="isu-label">[[label]]</div>
    </template>
    
    <!--可编辑状态-->
    <div id="input__container" class="input__container">
            <template is="dom-if" if="[[prefixUnit]]">
              <div class="prefix-unit input-unit">[[prefixUnit]]</div>
            </template>
            <iron-input bind-value="[[value]]" id="input" class="iron-input">
              <input id="innerInput" placeholder$="[[placeholder]]" type$="[[type]]" minlength$="[[minlength]]"
                  maxlength$="[[maxlength]]" min$="[[min]]" max$="[[max]]" readonly$="[[readonly]]" autocomplete="off" step="any" spellcheck="false">
              <div class="clear">
                <template is="dom-if" if="[[ isExistTruthy(value) ]]">
                  <iron-icon class="icon-clear" icon=icons:clear on-click="clear"></iron-icon>
                </template>
              </div>
              <div class="clear">
                <template is="dom-if" if="[[ isExistTruthy(value) ]]">
                  <template is="dom-if" if="[[ togglePassword ]]">
                    <iron-icon class="icon-password" icon=icons:visibility on-click="showPassword"></iron-icon>
                  </template>
                  <template is="dom-if" if="[[ !togglePassword ]]">
                    <iron-icon class="icon-password" icon=icons:visibility-off on-click="showPassword"></iron-icon>
                  </template>
                </template>
              </div>
            </iron-input>
            <template is="dom-if" if="[[suffixUnit]]">
              <div class="suffix-unit input-unit">[[suffixUnit]]</div>
            </template>
            
            <div class="prompt-tip__container" data-prompt$="[[prompt]]">
            <div class="prompt-tip">
              <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
              [[prompt]]
            </div>
          </div>
          <!--add mask when the componet is disabled or readonly-->
          <div class="mask"></div>
          
          </div>
    <template is="dom-if" if="[[isView]]">
      <div class="input__container">[[prefixUnit]] [[value]] [[suffixUnit]]</div>
    </template>
    
`;
  }

  static get properties() {
    return {
      /**
       * The label of the input.
       *
       * @type {string}
       * @default
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the input.
       * @type {string}
       * @default
       */
      placeholder: {
        type: String
      },
      /**
       * Bound to input' `type` attribute. [Input types](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input)
       * @attribute type
       * @type {string}
       * @default 'text'
       */
      type: {
        type: String,
        value: "text"
      },
      /**
       * A regexp to validate user input.
       * @type {string}
       */
      allowedPattern: {
        type: String
      },
      /**
       * Value of the input.
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * Set to true, if the input is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true, if the input is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false
      },
      /**
       * Prefix unit to show（i.e. ￥$元吨托）
       * @type {string}
       */
      prefixUnit: {
        type: String
      },
      /**
       * Suffix unit to show（i.e. ￥$元吨托）
       * @type {string}
       */
      suffixUnit: {
        type: String
      },
      /**
       * The minimum length user can input.
       * @type {number}
       */
      minlength: {
        type: Number
      },
      /**
       * The maximum length user can input.
       * @type {number}
       */
      maxlength: {
        type: Number
      },

      /**
       * The minimum value user can input or choose.
       * @type {string}
       */
      min: {
        type: String
      },
      /**
       * The maximum value user can input or choose
       * @type {string}
       */
      max: {
        type: String
      },

      /**
       * The prompt tip to show when input is invalid.
       * @type {String}
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
      togglePassword: {
        type: Boolean,
        value: false
      },
      /**
       * The text mode display requires readonly=true to take effect
       * @type {boolean}
       * @default false
       * */
      isView: {
        type: Boolean,
        value: false,
      }
    };
  }

  static get is() {
    return "isu-input";
  }

  static get observers() {
    return [
      'getInvalidAttribute(required, min, max, value)',
      '__allowedPatternChanged(allowedPattern)',
      '__isViewChanged(isView)'
    ];
  }

  __allowedPatternChanged() {
    if (this.allowedPattern) {
      this._patternRegExp = new RegExp(this.allowedPattern);
      this.getInvalidAttribute();
    }
  }

  /**
   * Set focus to input.
   */
  doFocus() {
    this.root.querySelector("#innerInput").focus();
  }

  /**
   * Validates the input element.
   *
   * First check the iron-input.validate(),
   * Then if required = true check (value != undefined && value !== '')
   * And if allowPattern is defined , use the regexp to test the value
   *
   * @returns {boolean}
   */
  validate() {
    super.validate()
    let valid = this.root.querySelector("#input").validate();

    if (this.required) {
      valid = valid && (this.value != undefined && this.value !== '');
    }

    if (this._patternRegExp) {
      valid = valid && this._patternRegExp.test(this.value);
    }

    return valid;
  }

  clear(e) {
    e.stopPropagation();
    this.value = '';
  }

  showPassword (e) {
    this.togglePassword = !this.togglePassword
    this.$.innerInput.type = this.togglePassword ? 'text' : 'password'
  }

  __isViewChanged(isView) {
    if (this.readonly) {
      this.$['input__container'].style.display = isView ? 'none' : 'flex'
    }
  }

  ready() {
    super.ready()
    const self = this
    let cpLock = true
    this.$.innerInput.addEventListener('compositionstart', function () {
      cpLock = false
    })
    this.$.innerInput.addEventListener('compositionend', function () {
      cpLock = true
    })

    this.$.innerInput.addEventListener('input', function () {
      setTimeout(function(){
        if(cpLock) {
          self.value = self.$.input.value
        }
      },1)
    })
  }
}

window.customElements.define(IsuInput.is, IsuInput);
