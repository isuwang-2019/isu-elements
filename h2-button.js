import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/paper-button/paper-button'
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {PaperButtonBehavior} from "@polymer/paper-behaviors/paper-button-behavior";
import './behaviors/h2-elements-shared-styles.js';

/**
 *
 * `h2-button`
 *
 * Example:
 * ```html
 *  <div>
 *   <h2-button>Enable</h2-button>
 *   <h2-button disabled>Disabled</h2-button>
 *  </div>
 *  <div>
 *   <h2-button size="small">small</h2-button>
 *   <h2-button size="normal">normal</h2-button>
 *   <h2-button size="large">large</h2-button>
 *  </div>
 *  <div>
 *    <h2-button>default</h2-button>
 *    <h2-button type="success">success</h2-button>
 *    <h2-button type="primary">primary</h2-button>
 *    <h2-button type="warning">warning</h2-button>
 *    <h2-button type="danger">danger</h2-button>
 *  </div>
 *  <div>
 *   <h2-button><iron-icon icon="check"></iron-icon>default</h2-button>
 *   <h2-button type="success"><iron-icon icon="check"></iron-icon>success</h2-button>
 *   <h2-button type="primary"><iron-icon icon="check"></iron-icon>primary</h2-button>
 *   <h2-button type="warning"><iron-icon icon="check"></iron-icon>warning</h2-button>
 *   <h2-button type="danger"><iron-icon icon="check"></iron-icon>danger</h2-button>
 *  </div>
 *  <div>
 *   <h2-button round>default</h2-button>
 *   <h2-button type="success" round>success</h2-button>
 *   <h2-button type="primary" round>primary</h2-button>
 *   <h2-button type="warning" round>warning</h2-button>
 *   <h2-button type="danger" round>danger</h2-button>
 *  </div>
 *  <div>
 *   <h2-button circle>1</h2-button>
 *   <h2-button type="success" circle>2</h2-button>
 *   <h2-button type="primary" circle>3</h2-button>
 *   <h2-button type="warning" circle>4</h2-button>
 *   <h2-button type="danger" circle>5</h2-button>
 *   <h2-button id="btn4" circle><iron-icon icon="check"></iron-icon></h2-button>
 *  </div>
 * ```
 *
 *
 *
 * ### Styling
 *
 * `<h2-button>` provides the following custom properties and mixins
 * for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--h2-button` | Mixin applied to the button | {}
 * `--h2-ui-primary` | Button type=primary style | {}
 * `--h2-ui-warning` | Button type=warning style | {}
 * `--h2-ui-danger` | Button type=danger style | {}
 * `--h2-ui-success` | Button type=success style | {}
 *
 * @customElement
 * @polymer
 * @demo demo/h2-button/index.html
 */
class H2Button extends mixinBehaviors(PaperButtonBehavior, PolymerElement) {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: inline-block;
        font-family: var(--h2-ui-font-family) sans-serif;
        font-size: var(--h2-ui-font-size);
        border-radius: 4px;
        outline: none;
        height: 34px;
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
        @apply --h2-button;
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
        border: 1px solid lightgray;
      }
      
      :host([type=primary]) .btn {
        background: var(--h2-ui-bg);
        color: #fff;
        @apply --h2-ui-primary;
      }
      
     :host([type=warning]) .btn {
        background: var(--h2-ui-orange);
        color: #fff;
        @apply --h2-ui-warning;
      }
      
      :host([type=danger]) .btn {
        background: var( --h2-ui-red);
        color: #fff;
        @apply --h2-ui-danger;
      }
      
      :host([type=success]) .btn {
        background: var(--h2-ui-green);
        color: #fff;
        @apply --h2-ui-success;
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
`;
  }

  constructor() {
    super();
    this.noink = true;
  }

  static get properties() {
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
      }
    }
  }
}

window.customElements.define('h2-button', H2Button);
