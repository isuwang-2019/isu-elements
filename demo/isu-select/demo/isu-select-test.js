import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '../../../isu-cascading.js'
import {AjaxBehavior} from "../../../behaviors/ajax-behavior";
import '../../../isu-select'

/**
 * `isu-cascading-test`
 *
 * @customElement
 * @polymer
 * @demo demo/isu-cascading/index.html
 */
class IsuSelectTest extends mixinBehaviors([AjaxBehavior], PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          width: 500px;
        }
      </style>
      <isu-select label="球员" placeholder="选择球员" multi="" items="{{allItems}}" show-all></isu-select>
      <isu-select label="球员" placeholder="选择球员" items="{{allItems}}" show-all></isu-select>
    `
  }

  static get properties() {
    return {
      items: {
        type: Array,
        value: []
      },
      allItems: {
        type: Array,
        value: [
          {label: "梅西", value: 1},
          {label: "C罗", value: 2},
          {label: "苏亚雷斯fffffffffffffffffffff", value: 3},
          {label: "库蒂尼奥", value: 4},
          {label: "特尔斯特根", value: 5},
          {label: "保利尼奥", value: 6},
          {label: "内马尔", value: 13}
        ]
      }
    };
  }


  static get is() {
    return "isu-select-test";
  }
}

window.customElements.define(IsuSelectTest.is, IsuSelectTest);
