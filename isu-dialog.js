import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/paper-dialog';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import {BaseBehavior} from "./behaviors/base-behavior";
import './behaviors/isu-elements-shared-styles.js';

/**
 * `isu-dialog`
 *
 * Example:
 * ```html
 * <isu-dialog id="dialog">
 * Put your Content here inside an element which with [slot=container]
 * </isu-dialog>
 * <button id="btn" onclick="javascript:dialog.open();">Click to open the Dialog</button>
 * ```
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * |Custom property | Description | Default|
 * |----------------|-------------|----------|
 * |`--isu-dialog-width` | Mixin applied to the width of dialog | 85%
 * |`--isu-dialog-height` | Mixin applied to the height of dialog | 90%
 * |`--isu-dialog-title` |  Mixin applied to the style of dialog title | {}
 * @customElement
 * @polymer
 * @demo demo/isu-dialog/index.html
 */

class IsuDialog extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 99;
      }

      #dialog {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        align-content: stretch;
        width: var(--isu-dialog-width, 85%);
        height: var(--isu-dialog-height, 90%);
        border-radius: 6px;
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }

      .scrollable-container {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        margin: 0;
        padding: 12px;
        @apply --isu-dialog-content;
      }

      .close-dialog {
        position: absolute;
        top: -14px;
        right: -14px;
        cursor: pointer;
        z-index: 10;
        color: #797979;
      }

      .close-dialog:hover {
        color: var(--isu-ui-red);
      }
      
      .title {
        font-size: 26px;
        font-weight: bold;
        margin: 20px 0 10px;
        text-align: left;
        padding: 0 16px;
        @apply --isu-dialog-title;
      }
      
      :host([modal]) .backdrop {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 1;
      }

    </style>

    <paper-dialog id="dialog"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
      no-cancel-on-esc-key="[[noCancelOnEscKey]]"
      opened="{{opened}}"
      no-cancel-on-outside-click="[[noCancelOnOutsideClick]]" on-opened-changed="openedChanged">
      
      <div class="close-dialog" on-tap="close">
        <iron-icon icon="icons:close"></iron-icon>
      </div>
      
      <template is="dom-if" if="[[ toBoolean(title) ]]">
        <div class="title">[[title]]</div>
      </template>
      <div class="scrollable-container">
        <slot></slot>
      </div>
    </paper-dialog>
    
    <div class="backdrop"></div>
`;
  }

  static get properties() {
    return {
      /**
       * Title of the dialog
       */
      title: {
        type: String
      },
      /**
       * Set to True to stop auto dismiss.
       * @type {boolean}
       * @default false
       */
      stopAutoDismiss: {
        type: Boolean,
        value: false
      },

      /**
       * @type {boolean}
       * @default false
       */
      modal: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: 'modalChanged'
      },

      /**
       * @type {boolean}
       * @default false
       */
      noCancelOnOutsideClick: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      noCancelOnEscKey: {
        type: Boolean,
        value: false
      },
      opened: {
        type: Boolean,
        reflectToAttribute: true
      },
      /**
       * 距顶端的距离
       * */
      top: {
        type: Number
      },
      /**
       * 距左边的距离
       * */
      left: {
        type: Number
      },
      /**
       * 是否在 Dialog 出现时将 body 滚动锁定
       * */
      lockScroll: {
        type: Boolean,
        value: false
      }
    };
  }

  static get observers() {
    return ['_positionChanged(top, left)']
  }

  static get is() {
    return "isu-dialog";
  }

  _positionChanged(top, left) {
    if (top) this.$.dialog.style.top = `${top}px`
    if (left) this.$.dialog.style.left = `${left}px`
  }

  connectedCallback() {
    super.connectedCallback();

    /**
     * @listens iron-overlay-closed
     */
    this.addEventListener('iron-overlay-closed', e => {
      // ignore 'iron-overlay-closed' event fired by other element
      if (e.path[0] != this.$.dialog) return;
      e.stopPropagation();
      /**
       * @event isu-dialog-closed
       * Fired when the dialog closed.
       */
      this.dispatchEvent(new CustomEvent('isu-dialog-closed'), {
        composed: true,
        bubbles: true
      });

      if (!this.stopAutoDismiss) {
        setTimeout(() => {
          this.parentElement && this.parentElement.removeChild(this);
        }, 100);
      }
    });

    /**
     * @listens isu-dialog-dismiss
     */
    this.addEventListener('isu-dialog-dismiss', this.close);


  }

  /**
   * Open the dialog.
   */
  open() {
    this.style.display = 'flex';
    this.$.dialog.open();
    if (this.lockScroll ) document.body.style['overflow-y'] = 'hidden'
  }

  /**
   * Close the dialog.
   */
  close() {
    this.style.display = 'none';
    this.$.dialog.close();
    if (this.lockScroll) document.body.style['overflow-y'] = 'auto'
  }

  openedChanged({detail: {value}}) {
    if (!value) this.close();
  }

  modalChanged(modal) {
    if(modal) {
      this.noCancelOnOutsideClick = true;
      this.noCancelOnEscKey = true;
    }
  }
}

window.customElements.define(IsuDialog.is, IsuDialog);