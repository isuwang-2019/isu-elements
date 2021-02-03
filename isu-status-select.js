import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import { html, PolymerElement } from '@polymer/polymer'
import '@polymer/iron-selector/iron-selector'
import { BaseBehavior } from './behaviors/base-behavior'
import './behaviors/isu-elements-shared-styles.js'

/**
 * `isu-toggles`
 *    <isu-status-select id="demo1" label="状态"></isu-status-select>
 * ```html
 * ```
 * @customElement
 * @polymer
 * @demo demo/isu-status-select/index.html
 */
class IsuStatusSelect extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
      <style include="isu-elements-shared-styles">
        :host {
            display: inline-block;
            margin-top: 5px;
        }
        :host .status-select-content{
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            @apply --status-select-content
            
        }
        :host iron-selector{
            display: inline-block;
        }

        :host iron-selector > * {
            padding: 5px;
            font-size: 12px;
            cursor: pointer;
            color: #337ab7;
            @apply --status-item
        }

        /*hover*/
        :host .status:hover {
            background-color: #70A8CB;
            color: #fff;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            @apply --status-hover
        }
        :host iron-selector > .iron-selected{
            color: #fff;
        }
            /*选中*/
        :host .iron-selected {
            background-color: #70A8CB;
            color: #fff;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            @apply --status-selected
        }
        :host .status-count{
            @apply --status-count
        }
      </style>
      <div class="status-select-content">
        <template is="dom-if" if="[[ toBoolean(label) ]]">
           <div class="isu-label-div"><span class$="isu-label [[fontSize]]">[[label]]</span><span class="isu-label-after-extension"></span></div>
        </template>
        <iron-selector selected="{{value}}" attr-for-selected="statusItem">
            <template is="dom-repeat" items="[[items]]">
                <span class="status" status-item="[[ getValueByKey(item, attrForValue) ]]" on-tap="itemSelected">
                    <span>[[ getValueByKey(item, attrForLabel) ]]</span>
                    <template is="dom-if" if="[[!noCount]]">
                        (<span class="status-count">[[ getValueByKey(item, attrForCount) ]]</span>)
                    </template>
                </span>
            </template>
        </iron-selector>
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

      /**
       * If false, count is not displayed
       * @type {Boolean}
       * @default false
       */
      noCount: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      items: {
        type: Array,
        value () {
          return []
        }
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
       * Attribute name for label.
       * @type {string}
       * @default 'count'
       */
      attrForCount: {
        type: String,
        value: 'count'
      },

      value: {
        type: String,
        notify: true
      }

    }
  }

  itemSelected(e) {
    const selectedValue = this.getValueByKey(e.model.item, e.model.attrForValue)
    const resultValue = this.value === selectedValue ? '' : selectedValue
    setTimeout(() => {
      this.set('value', resultValue)
      this.dispatchEvent(new CustomEvent('status-selected', {
        composed: true,
        bubbles: true,
        detail: resultValue
      }))
    }, 0)

  }

}

window.customElements.define('isu-status-select', IsuStatusSelect)
