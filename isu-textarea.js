import { html, PolymerElement } from '@polymer/polymer'
import '@polymer/iron-icon'
import '@polymer/iron-icons/social-icons'
import './behaviors/isu-elements-shared-styles.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import { BaseBehavior } from './behaviors/base-behavior'
/**
 * `isu-textarea`
 *
 * Example:
 * ```html
 * <isu-textarea label="备注"></isu-textarea>
 * <isu-textarea label="备注" required></isu-textarea>
 * ```
 *
 *
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * |Custom property | Description | Default|
 * |----------------|-------------|----------|
 * |`--isu-textarea` | Mixin applied to the textarea | {}
 * |`--isu-textarea-placeholder` | Mixin applied to placeholder of the textarea | {}
 * |`--isu-view-text` | Mixin applied to the text when the readonly and is-view is true | {}
 *
 * @customElement
 * @polymer
 * @demo demo/isu-textarea/index.html
 *
 */
class IsuTextarea extends mixinBehaviors(BaseBehavior, PolymerElement) {
  static get template () {
    return html`
      <style include="isu-elements-shared-styles">
        :host {
          display: flex;
          flex-wrap: nowrap;
          font-family: var(--isu-ui-font-family), sans-serif;
          font-size: var(--isu-ui-font-size);
          width: var(--isu-textarea-width, 400px);
          position: relative;
          background: white;
          height: var(--isu-textarea-height, 34px);
        }
  
        #textarea-wrapper {
          flex: 1;
          display: flex;
          position: relative;
        }
  
        #textarea {
          flex: 1;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 6px;
          outline: none;
          resize: none;
          background: inherit;
          color: inherit;
          font-size: inherit;
          font-family: inherit;
          line-height: inherit;
          text-align: inherit;
  
          @apply --isu-textarea;
        }
  
        :host([data-invalid]) #textarea {
          border-color: var(--isu-ui-color_pink);
        }
  
  
        textarea::-webkit-input-placeholder {
          color: #999;
          @apply --isu-textarea-placeholder;
        }
  
        textarea:-moz-placeholder {
          color: #999;
          @apply --isu-textarea-placeholder;
        }
  
        textarea::-moz-placeholder {
          color: #999;
          @apply --isu-textarea-placeholder;
        }
  
        textarea:-ms-input-placeholder {
          color: #999;
          @apply --isu-textarea-placeholder;
        }
        
       .view-text {
         @apply --isu-textarea-view-text
       }
       .view-text pre {
          margin: 0;
          font-family: "Microsoft YaHei";
       }
       .isu-label {
          height: var(--isu-textarea-height, 34px);
          line-height: var(--isu-textarea-height, 34px);
       }
  
      </style>
      <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class="isu-label">[[label]]</div>
      </template>
      
      <div id="textarea-wrapper">
        <textarea id="textarea" value="{{value::input}}" aria-label$="[[label]]" autocomplete$="[[autocomplete]]" autofocus$="[[autofocus]]"  cols$="[[cols]]"
        inputmode$="[[inputmode]]" placeholder$="[[placeholder]]" readonly$="[[readonly]]" required$="[[required]]" disabled$="[[disabled]]" rows$="[[rows]]" 
        minlength$="[[minlength]]" maxlength$="[[maxlength]]"></textarea>
        <div class="mask"></div>
      </div>
      <div class="prompt-tip__container" data-prompt$="[[prompt]]">
        <div class="prompt-tip">
          <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
          [[prompt]]
        </div>
      </div>
      <template is="dom-if" if="[[_isView(isView, readonly)]]">
        <div class="view-text">
           <pre>[[value]]</pre>
        </div>
     </template>
`
  }

  static get properties () {
    return {
      /**
       * The value of the textarea.
       * @type {string|number}
       */
      value: {
        type: String,
        notify: true
      },

      /**
       * The initial number of rows.
       *
       * @attribute rows
       * @type {number}
       * @default 1
       */
      rows: {
        type: Number,
        value: 1
      },
      /**
       * The initial number of cols
       * @type {number}
       * @default 1
       * */
      cols: {
        type: Number,
        value: 1
      },

      /**
       * Bound to the textarea's `autocomplete` attribute.
       * @type {string}
       * @default 'off'
       */
      autocomplete: {
        type: String,
        value: 'off'
      },

      /**
       * Bound to the textarea's `autofocus` attribute.
       * @type {boolean}
       * @default false
       */
      autofocus: {
        type: Boolean,
        value: false
      },

      /**
       * Bound to the textarea's `inputmode` attribute.
       * @type {string}
       */
      inputmode: {
        type: String
      },

      /**
       * Bound to the textarea's `placeholder` attribute.
       * @type {string}
       */
      placeholder: {
        type: String
      },

      /**
       * Bound to the textarea's `readonly` attribute.
       * @type {boolean}
       */
      readonly: {
        type: Boolean
      },

      /**
       * Set to true to mark the textarea as required.
       * @type {boolean}
       */
      required: {
        type: Boolean,
        reflectToAttribute: true
      },

      /**
       * The minimum length of the input value.
       */
      minlength: {
        type: Number
      },

      /**
       * The maximum length of the input value.
       * @type {number}
       */
      maxlength: {
        type: Number
      },

      /**
       * Bound to the textarea's `aria-label` attribute.
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       * The prompt to show when textarea is invalid.
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
       * The text mode display requires readonly=true to take effect
       * @type {boolean}
       * @default false
       * */
      isView: {
        type: Boolean,
        value: false
      }
    }
  }

  static get is () {
    return 'isu-textarea'
  }

  static get observers () {
    return [
      '__refreshUIState(required)',
      '__refreshUIState(value)',
      '__isViewChanged(isView,readonly)'
    ]
  }

  /**
   * Returns the underlying textarea.
   * @type HTMLTextAreaElement
   */
  get textarea () {
    return this.$.textarea
  }

  /**
   * Returns textarea's selection start.
   * @type Number
   */
  get selectionStart () {
    return this.$.textarea.selectionStart
  }

  /**
   * Returns textarea's selection end.
   * @type Number
   */
  get selectionEnd () {
    return this.$.textarea.selectionEnd
  }

  /**
   * Sets the textarea's selection start.
   */
  set selectionStart (value) {
    this.$.textarea.selectionStart = value
  }

  /**
   * Sets the textarea's selection end.
   */
  set selectionEnd (value) {
    this.$.textarea.selectionEnd = value
  }

  __refreshUIState () {
    if (!this.validate()) {
      this.setAttribute('data-invalid', '')
    } else {
      this.removeAttribute('data-invalid')
    }
  }

  /**
   * Returns true if `value` is valid. Use`textarea`'s `validity` attribute.
   *
   * @return {boolean} True if the value is valid.
   */
  validate () {
    return this.$.textarea.validity.valid
  }

  __isViewChanged (isView, readonly) {
    this.$['textarea-wrapper'].style.display = (this.readonly && isView) ? 'none' : 'flex'
  }

  _isView (isView, readonly) {
    return isView && readonly
  }

  /**
   * Set focus to textarea.
   */
  doFocus () {
    this.$.textarea.focus()
  }
}

window.customElements.define(IsuTextarea.is, IsuTextarea)
