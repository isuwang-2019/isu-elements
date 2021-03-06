import { html, PolymerElement } from '@polymer/polymer'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import { BaseBehavior } from './behaviors/base-behavior'
import '@polymer/iron-icons'
import '@polymer/iron-icon'
import './behaviors/isu-elements-shared-styles'
import './isu-button.js'
import './isu-input.js'
import './isu-dialog.js'
/**
 * `isu-tip`
 *
 * Example:
 * ```html
 * <isu-tip type="success" message="success" id="tip"></isu-tip>
 * <isu-button id="btn" onclick="tip.open();">Success</isu-button>
 *
 * <isu-tip type="warn" message="warn" id="tip2"></isu-tip>
 * <isu-button id="btn2" onclick='tip2.open(2000);'>Warn</isu-button>
 *
 * <isu-tip type="error" message="alert" id="tip3"></isu-tip>
 * <isu-button id="btn3" onclick='tip3.open(5000);'>Error</isu-button>
 * ```
 * @customElement
 * @polymer
 * @demo demo/isu-tip/index.html
 */
class IsuTip extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        min-width: 330px;
        min-height: 100px;
        overflow: hidden;
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }
      
      #dialog {
        --isu-dialog-content: {
          display: flex;
          flex-flow: column nowrap;
        }
        
        --isu-dialog-title: {
          font-size: 18px;
        }
      }
      .tip-icon {
        @apply --isu-custom-tip;
      }
      
      .tip {
        vertical-align: middle;
        box-sizing: border-box;
        font-size: 14px;
        display: flex;
        flex-flow: row nowrap;
        flex: 1;
        padding: 0 4px;
      }

      :host([type=warn]) #tip {
        color: var(--isu-ui-color_yellow);
      }

      :host([type=success]) #tip {
        color: #46d23a;
      }
      
      :host([type=error]) #tip {
        color: var(--isu-ui-color_pink);
      }

      .tip-content {
        color: #848484;
        flex: 1;
        word-break: break-all;
      }
      
      :host([type=success]) #dialog,
      :host([type=warn]) #dialog,
      :host([type=error]) #dialog,
      :host([type=custom]) #dialog{
        --isu-dialog-width: 400px;
        --isu-dialog-height: auto;
      }
      
      :host([type=success]) .tip-content,
      :host([type=warn]) .tip-content,
      :host([type=error]) .tip-content,
      :host([type=custom]) .tip-content{
        padding: 5px 12px;
        padding-right: 34px;
      }
      
      :host([type=prompt]) #dialog,
      :host([type=confirm]) #dialog {
        --isu-dialog-width: 440px;
        --isu-dialog-height: 200px;
      }
      
      :host([type=success]) #operate-panel,
      :host([type=warn]) #operate-panel,
      :host([type=error]) #operate-panel,
      :host([type=custom]) #operate-panel,
      :host([type=success]) #remark-input,
      :host([type=warn]) #remark-input,
      :host([type=error]) #remark-input,
      :host([type=confirm]) #remark-input,
      :host([type=custom]) #remark-input {
        display: none;
      }

      .tip-icon {
        width: 36px;
        height: 36px;
      }

      #remark-input {
        width: inherit;
      }

      #operate-panel {
        text-align: right;
        margin-top: 10px;
      }
      :host([center]) #tip {
        margin: auto;
      }
    </style>
    <isu-dialog id="dialog" modal="[[ isOneOf(type, 'confirm', 'prompt') ]]" no-cancel-on-outside-click title="[[orElse(title, config.title)]]">
      <div id="tip" class="tip">
          <template is="dom-if" if="[[ isEqual(type, 'success') ]]">
            <iron-icon class="tip-icon" icon="icons:check-circle"></iron-icon>
          </template>
          <template is="dom-if" if="[[ isEqual(type, 'warn') ]]">
            <iron-icon class="tip-icon" icon="icons:error"></iron-icon>
          </template>
          <template is="dom-if" if="[[ isEqual(type, 'error') ]]">
            <iron-icon class="tip-icon" icon="icons:cancel"></iron-icon>
          </template>
          <template is="dom-if" if="[[  isEqual(type, 'custom')  ]]">
            <iron-icon class="tip-icon" icon$="[[ iconClass ]]"></iron-icon>
          </template>
          <div class="tip-content" id="messageContainer"></div>
      </div>
      <isu-input id="remark-input" value="{{ remark }}"></isu-input>
      <div id="operate-panel">
        <isu-button on-click="_confirm" type="[[orElse(config.confirmBtnType, 'primary')]]" size="small">[[orElse(config.confirmBtnLabel, '确定')]]</isu-button>
        <isu-button on-click="_cancel" type="[[orElse(config.cancelBtnType, 'default')]]" size="small">[[orElse(config.cancelBtnLabel, '取消')]]</isu-button>
      </div>
    </isu-dialog>
`
  }

  static get is () {
    return 'isu-tip'
  }

  static get properties () {
    return {
      /**
       * Message of the tip.
       * @type {string}
       */
      message: {
        type: String
      },
      /**
       * Tip type [success | warn | error | confirm | prompt]
       * @type {string} type
       * @default 'success'
       */
      type: {
        type: String,
        value: 'success'
      },
      /**
       * User input when `type` is `prompt`.
       * @type {string}
       */
      remark: {
        type: String
      },
      /**
       * The callback function by clicking the confirm、prompt message box`s sure button
       * @type {function}
       */
      _confirmCallback: {
        type: Function
      },
      /**
       * The callback function by clicking the confirm、prompt message box`s cancel button
       *  @type {function}
       */
      _cancelCallback: {
        type: Function
      },

      /**
       * When `type` is `success`, `warn` or `error`, the tip will disappear after [duration] ms.
       * @type {number}
       * @default 1500 ms
       */
      duration: {
        type: Number,
        value: 1500
      },
      /**
       * If true, no duration is required. The tip will displayed until you close it.
       * @type {boolean}
       * @default false
       */
      noDuration: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true, if you want that `isu-tip` can auto detach from its parentElement.
       * @type {boolean}
       * @default false
       */
      autoDetach: {
        type: Boolean,
        value: false
      },
      /**
       * The title of the tip
       * @type {string}
       */
      title: {
        type: String
      },
      /**
       * The width of the tip box
       * @type {string}
       */
      width: {
        type: String
      },
      /**
       * The height of the tip box
       * @type {string}
       */
      height: {
        type: String
      },
      /**
       * Custom configuration.eg: {"title":"Notice!!!", "cancelBtnLabel": "NO", "confirmBtnLabel": "YES", "cancelBtnType": "warning", "confirmBtnType": "default"}
       *
       * @type {string}
       */
      config: {
        type: Object,
        value: function () {
          return {}
        }
      },
      /**
       * The icon`s class in the tip box. eg: `icons:build`
       *
       * @type {string}
       * */
      iconClass: {
        type: String
      },
      /**
       * Whether the tip content is centered or not
       *
       * @type {boolean}
       * @default false
       * */
      center: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }

    }
  }

  static get observers () {
    return [
      '__sizeChanged(width, "width")',
      '__sizeChanged(height, "height")',
      '__messageChanged(message)'
    ]
  }

  __sizeChanged (size, sizeAttr) {
    if (size) {
      this.$.dialog.updateStyles({ ['--isu-dialog-' + sizeAttr]: size })
    }
  }

  __messageChanged (message) {
    this.$.messageContainer.innerHTML = message
  }

  /**
   * Cancel handler
   */
  _cancel () {
    this.close()
    this.isFunction(this._cancelCallback) && this._cancelCallback()
  }

  /**
   * Confirm handler
   */
  async _confirm () {
    const cbParam = this.type === 'prompt' ? { remark: this.remark } : null
    const callbackResult = this.isFunction(this._confirmCallback) && await this._confirmCallback(cbParam)
    if (this.type === 'prompt' && callbackResult === false) return
    this.close()
  }

  /**
   * Open the tip dialog.
   *
   * 3 ways to use the open api:
   *
   *   - open(duration)
   *   - open(confirmCallback)
   *   - open(confirmCallback, cancelCallback)
   * @param args
   */
  open (...args) {
    let confirmCallback; let cancelCallback; let duration = this.duration
    if (args.length > 0 && typeof args[0] === 'function') {
      confirmCallback = args.shift()
    }

    if (args.length > 0 && typeof args[0] === 'function') {
      cancelCallback = args.shift()
    }

    if (args.length > 0 && (typeof args[0] === 'number' || typeof args[0] === 'string')) {
      duration = Number(args[0])
    }

    this._confirmCallback = confirmCallback
    this._cancelCallback = cancelCallback

    this.$.dialog.open()

    if (this.type !== 'confirm' && this.type !== 'prompt') {
      if (!this.noDuration) {
        setTimeout(() => {
          this.close()
        }, duration)
      }
    }
  }

  /**
   * Hide the tip.
   */
  close () {
    this.$.dialog.close()
    if (this.autoDetach && this.parentElement && this.parentElement.removeChild) {
      this.parentElement.removeChild(this)
    }
  }
}

window.customElements.define(IsuTip.is, IsuTip)
