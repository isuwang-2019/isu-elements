import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import { html, PolymerElement } from '@polymer/polymer'
import { BaseBehavior } from './behaviors/base-behavior'
import './behaviors/isu-elements-shared-styles.js'

/**
 * `isu-toggles`
 * ```html
 *  <isu-toggles  label="开关："></isu-toggles>
 *  <isu-toggles  label="只读：" readonly></isu-toggles>
 *  <isu-toggles  prefix-label="前缀"></isu-toggles>
 *  <isu-toggles  suffix-label="后缀"></isu-toggles>
 * ```
 * @customElement
 * @polymer
 * @demo demo/isu-toggles/index.html
 */
class IsuToggles extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
      <style include="isu-elements-shared-styles">
        :host {
          display: flex;
          align-items: center;
          height: var(--isu-toggle-height, var(--isu-default-line-height, 34px));
          line-height: var(--isu-toggle-height,var(--isu-default-line-height, 34px));
          width: var(--isu-toggle-width, 320px);
          font-family: var(--isu-ui-font-family), sans-serif;
          font-size: var(--isu-ui-font-size);
        }
        div.switcher label {
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        
        div.switcher label input {
          display: none;
        }
        
        div.switcher label .prefix-label{
          margin-right: 10px;
          @apply --isu-toggles-prefix-label
        }
        
        div.switcher label .suffix-label{
          margin-left: 10px;
          @apply --isu-toggles-suffix-label
        }

        div.switcher  input + span {
          position: relative;
          display: inline-block;
          background: #e0e0e0;
          border: 1px solid #eee;
          border-radius: 50px;
          transition: all 0.3s ease-in-out;
        }

        div.switcher  input + span small {
          position: absolute;
          display: block;
          width: 50%;
          height: 80%;
          top: 10%;
          background: #bbbbbb;
          border-radius: 50%;
          transition: all 0.3s ease-in-out;
          left: 8%;
        }

        div.switcher label .isu-toggles{
          width: 30px;
          height: 18px;
          margin: 0px 5px 0px 0px;
          @apply --isu-toggles
        }
        
        div.switcher  input:checked + span {
          background: #29C174;
          border-color: #29C174;
          @apply --isu-toggles--checked
        }

        div.switcher  input:checked + span small {
          left: 42%;
          background: #fff;
        }

        div.switcher label input:disabled + span, div.switcher label input:disabled + span + small {
          cursor: not-allowed;
          opacity: 0.5;
        }

      </style>
      <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class="isu-label-div"><span class$="isu-label [[fontSize]]">[[label]]</span><span class="isu-label-after-extension"></span></div>
      </template>
      <div class$="switcher [[fontSize]]">
        <label>
          <template is="dom-if" if="[[prefixLabel]]">
            <div class="prefix-label">[[prefixLabel]]</div>
          </template>
          <input type="checkbox" id="checkbox" disabled$="[[readonly]]" checked="{{value::input}}">
          <span class="isu-toggles"><small></small></span>
          <template is="dom-if" if="[[suffixLabel]]">
            <div class="suffix-label">[[suffixLabel]]</div>
          </template>
        </label>
      </div>
    `
  }

  static get properties () {
    return {
      label: {
        type: String
      },

      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      prefixLabel: {
        type: String
      },

      suffixLabel: {
        type: String
      },

      value: {
        type: Boolean,
        notify: true,
        value: false
      }

    }
  }

  ready () {
    super.ready()
  }
}

window.customElements.define('isu-toggles', IsuToggles)
