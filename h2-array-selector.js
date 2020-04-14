import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/polymer/lib/elements/array-selector.js';
import '@polymer/polymer/lib/elements/dom-bind.js';

class H2ArraySelector extends PolymerElement {
  constructor() {
    super();
    this.noink = true;
  }
  static get _template() {
    return html`
        <div> Employee list: </div>
        <dom-repeat id="employeeList" items="{{employees}}">
        <array-selector id="selector"
                        items="{{employees}}"
                        selected="{{selected}}"
                        multi toggle></array-selector>
          <template>
            <div>First name: <span>{{item.first}}</span></div>
              <div>Last name: <span>{{item.last}}</span></div>
              <button on-click="toggleSelection">Select</button>

        <div> Selected employees: </div>
        <dom-repeat items="{{selected}}">
          <template>
            <div>姓氏: <span>{{item.first}}</span></div>
            <div>名字: <span>{{item.last}}</span></div>
          </template>
        </dom-repeat>
          </template>
        </dom-repeat>

        `;
  }
  static get is() { return 'h2-array-selector'; }
  static get properties() {
    return {
      employees: {
        value() {
          return [
            {first: 'Bob', last: 'Smith'},
            {first: 'Sally', last: 'Johnson'}
          ];
        }
      }
    };
  }
  toggleSelection(e) {
    const item = this.$.employeeList.itemForElement(e.target);
    this.$.selector.select(item);
  }
}

window.customElements.define(H2ArraySelector.is, H2ArraySelector);
