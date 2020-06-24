import { html, PolymerElement } from '@polymer/polymer'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import '@polymer/paper-button/paper-button'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import { PaperButtonBehavior } from '@polymer/paper-behaviors/paper-button-behavior'
import './behaviors/isu-elements-shared-styles.js'

/**
 *
 * `isu-button`
 *
 * Example:
 * ```html
 *  <div>
 *   <isu-button>Enable</isu-button>
 *   <isu-button disabled>Disabled</isu-button>
 *  </div>
 *  <div>
 *   <isu-button size="small">small</isu-button>
 *   <isu-button size="normal">normal</isu-button>
 *   <isu-button size="large">large</isu-button>
 *  </div>
 *  <div>
 *    <isu-button>default</isu-button>
 *    <isu-button type="success">success</isu-button>
 *    <isu-button type="primary">primary</isu-button>
 *    <isu-button type="warning">warning</isu-button>
 *    <isu-button type="danger">danger</isu-button>
 *  </div>
 *  <div>
 *   <isu-button><iron-icon icon="check"></iron-icon>default</isu-button>
 *   <isu-button type="success"><iron-icon icon="check"></iron-icon>success</isu-button>
 *   <isu-button type="primary"><iron-icon icon="check"></iron-icon>primary</isu-button>
 *   <isu-button type="warning"><iron-icon icon="check"></iron-icon>warning</isu-button>
 *   <isu-button type="danger"><iron-icon icon="check"></iron-icon>danger</isu-button>
 *  </div>
 *  <div>
 *   <isu-button round>default</isu-button>
 *   <isu-button type="success" round>success</isu-button>
 *   <isu-button type="primary" round>primary</isu-button>
 *   <isu-button type="warning" round>warning</isu-button>
 *   <isu-button type="danger" round>danger</isu-button>
 *  </div>
 *  <div>
 *   <isu-button circle>1</isu-button>
 *   <isu-button type="success" circle>2</isu-button>
 *   <isu-button type="primary" circle>3</isu-button>
 *   <isu-button type="warning" circle>4</isu-button>
 *   <isu-button type="danger" circle>5</isu-button>
 *   <isu-button id="btn4" circle><iron-icon icon="check"></iron-icon></isu-button>
 *  </div>
 * ```
 *
 *
 *
 * ### Styling
 *
 * `<isu-button>` provides the following custom properties and mixins
 * for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--isu-button` | Mixin applied to the button | {}
 * `--isu-ui-default` | Button type=default style | {}
 * `--isu-ui-primary` | Button type=primary style | {}
 * `--isu-ui-warning` | Button type=warning style | {}
 * `--isu-ui-danger` | Button type=danger style | {}
 * `--isu-ui-success` | Button type=success style | {}
 *
 * @customElement
 * @polymer
 * @demo demo/isu-button/index.html
 */
class IsuButton extends mixinBehaviors(PaperButtonBehavior, PolymerElement) {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: inline-block;
        font-family: var(--isu-ui-font-family) sans-serif;
        font-size: var(--isu-ui-font-size);
        border-radius: 4px;
        outline: none;
        height: var(--isu-button-height, 34px) sans-serif;
      }

      :host([hidden]) {
        display: none;
      }

      .btn {
        padding: 5px 10px;
        width: 100%;
        height: 100%;
        margin: 0;
        font-weight: normal;
        text-align: center;
        vertical-align: middle;
        touch-action: manipulation;
        cursor: pointer;
        white-space: nowrap;
        line-height: 1.42857143;
        border-radius: inherit;
        min-width: 0;
        font-size: inherit;
        text-transform: none;
        @apply --isu-button;
      }
      
      :host([disabled]) .btn {
        background: #aeaeae !important;
        cursor: not-allowed;
        color: #fff;
      }
      
      :host([round]) .btn {
        border-radius: 20px;
        padding: 12px;
      }
      
      :host([circle]) .btn {
        border-radius: 50%;
        padding: 12px;
      }
      
      :host(:hover) .btn {
        opacity: 0.8;
      }
      
      :host([type=default]) .btn {
        background: #ffffff;
        color: #000000;
        border: 1px solid lightgray;
        @apply --isu-ui-default;
      }
      
      :host([type=primary]) .btn {
        background: var(--isu-ui-bg);
        color: #fff;
        @apply --isu-ui-primary;
      }
      
     :host([type=warning]) .btn {
        background: var(--isu-ui-orange);
        color: #fff;
        @apply --isu-ui-warning;
      }
      
      :host([type=danger]) .btn {
        background: var( --isu-ui-red);
        color: #fff;
        @apply --isu-ui-danger;
      }
      
      :host([type=success]) .btn {
        background: var(--isu-ui-green);
        color: #fff;
        @apply --isu-ui-success;
      }
      
     :host([size=small]) {
        width: 50px;
        height: 30px;
     }
     
     :host([size=large]) {
        width: 100px;
        height: 40px;
     }
    </style>
    <paper-button class="btn" disabled="[[disabled]]" noink>
      <slot></slot>
    </paper-button>
`
  }

  constructor () {
    super()
    this.noink = true
  }

  static get properties () {
    return {
      /**
       * Properties can be selected as default, primary, warning, danger or success
       *
       * @type String
       * @default default
       */
      type: {
        type: String,
        value: 'default',
        reflectToAttribute: true
      },
      /**
       * Properties can be selected as small, normal or large
       *
       * @type String
       * @default normal
       */
      size: {
        type: String,
        value: 'normal',
        reflectToAttribute: true
      },
      /**
       * Set to true, if the input is readonly.
       * @type {boolean}
       * @default false
       */
      disabled: {
        type: Boolean,
        value: false
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
      }
    }
  }

  _permissionChange (permission) {
    this.set('hidden', !permission)
  }
}

window.customElements.define('isu-button', IsuButton)
