
import './behaviors/format-behavior.js';

import './isu-input.js';
import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {FormatBehavior} from "./behaviors/format-behavior";
/**
 * `isu-input-datetime`
 *
 * Example:
 * ```html
 * <isu-input-datetime class="datetime" label="无默认日期"></isu-input-datetime>
 * <isu-input-datetime class="datetime" label="默认value" value="2017-10-26T10:20"></isu-input-datetime>
 * <isu-input-datetime class="datetime" label="默认time" timestamp="1509008130349"></isu-input-datetime>
 * ```
 *
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * |Custom property | Description | Default|
 * |----------------|-------------|----------|
 * |`--isu-input-datetime-label` | Mixin applied to the label of input | {}
 *
 * @customElement
 * @polymer
 * @demo demo/isu-input-datetime/index.html
 *
 */

class IsuInputDatetime extends mixinBehaviors([FormatBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        width: 300px;
        height: 34px;
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
        line-height: 34px;
      }

      #input {
        flex: 1;
        width: inherit;
        height: inherit;
        font-size: inherit;
        line-height: inherit;

        --isu-input-label: {
          @apply --isu-input-datetime-label;
        };
      }

    </style>
    <isu-input id="input" value="{{value}}" label="[[label]]" placeholder="[[placeholder]]" required="[[required]]" min="[[min]]" max="[[max]]" readonly$="[[readonly]]" type="datetime-local">
    </isu-input>
`;
  }

  static get properties() {
    return {
      /**
       * The value of the input, return a date string format to `yyyy-MM-ddTHH:mm`. i.e. 2017-10-26T12:20
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * 时间戳
       */
      timestamp: {
        type: Number,
        notify: true
      },
      /**
       * The label of the input.
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the input.
       */
      placeholder: {
        type: String
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
       * The minimum datetime which can be chosen. It should be a string format to `yyyy-MM-ddTHH:mm`.
       * @type {string}
       */
      min: {
        type: String
      },
      /**
       * The maximum datetime which can be chosen. It should be a string format to `yyyy-MM-ddTHH:mm`.
       * @type {string}
       */
      max: {
        type: String
      }
    };
  }

  static get is() {
    return "isu-input-datetime";
  }

  static get observers() {
    return [
      '_valueChanged(value)',
      '_timestampChanged(timestamp)'
    ];
  }
  /**
   * @param value
   * @private
   */
  _valueChanged(value) {
    if (!this.value) {
      this.set("timestamp", undefined);
      return;
    }
    const time = new Date(value).getTime();
    this.set("timestamp", time);
  }

  /**
   * @param timestamp
   * @private
   */
  _timestampChanged(timestamp) {
    if (!timestamp) {
      this.set("value", undefined);
      return;
    }
    const date = new Date(timestamp);
    this.set("value", this.formatDate(date, "yyyy-MM-ddTHH:mm"));
  }

  /**
   * Set focus to input.
   */
  doFocus() {
    this.$.input.doFocus();
  }

  /**
   * Validates the input element.
   * @returns {boolean}
   */
  validate() {
    return this.$.input.validate();
  }
}

window.customElements.define(IsuInputDatetime.is, IsuInputDatetime);
