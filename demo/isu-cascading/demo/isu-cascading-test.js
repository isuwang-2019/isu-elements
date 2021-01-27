import { html, PolymerElement } from '@polymer/polymer'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '../../../isu-cascading.js'
import { AjaxBehavior } from '../../../behaviors/ajax-behavior'

/**
 * `isu-cascading-test`
 *
 * @customElement
 * @polymer
 * @demo demo/isu-cascading/index.html
 */
class IsuCascadingTest extends mixinBehaviors([AjaxBehavior], PolymerElement) {
  static get template () {
    return html`
      <style>
        :host {
          width: 500px;
        }
        
        #isu-cascading1 {
          --isu-cascading-height: 50px;
        }
        
      </style>
      <isu-cascading id="isu-cascading1" class="isu-cascading" font-size="x-small" label="地址(内部)" src="/init2.do" is-innner-dynamic-append-data
        value="{{value}}" tree-items="{{treeItems}}" fetch-param="{{fetchParam}}"
      ></isu-cascading>
      <isu-cascading class="isu-cascading" label="地址2（外部）" is-dynamic-append-data
        value="{{value2}}" tree-items="{{treeItems2}}" current-click-view-element="{{currentClickViewElement}}"
      ></isu-cascading>
    `
  }

  static get properties () {
    return {
      treeItems: {
        type: Array,
        notify: true,
        value: []
      },
      treeItems2: {
        type: Array,
        notify: true,
        value: []
      },
      value: {
        type: Array,
        notify: true,
        value: []
      },
      value2: {
        type: Array,
        notify: true,
        value: []
      },
      selectedValues: {
        type: Array,
        notify: true,
        value: []
      },
      currentClickViewElement: {
        type: Object,
        notify: true
      },
      src: {
        type: String
      }
    };
  }

  static get observers() {
    return [
      '__value2Changed(value2)',
    ];
  }

  __value2Changed(value) {
    const self = this
    setTimeout(() => {
      const treeItems = [].concat(self.treeItems2);
      if (value.length) {
        treeItems.push([
          {
            value: 'dongcheng',
            label: '东城'
          },
          {
            value: 'xicheng',
            label: '西城'
          }
        ]);
        self.treeItems2 = treeItems;
      }
      self.hideLoading(this.currentClickViewElement)
    }, 3000)
  }

  ready() {
    super.ready()
    const self = this
    self.query({url: '/init2.do', data: {start: 0, limit: 10}}, function (result) {
      self.set('data', result.rows)
    })

  }

  test() {
    const self = this
    self.query({url: '/init2.do', data: {start: 0, limit: 10}}, function (result) {
      self.set('data', result.rows)
    })
  }

  static get is() {
    return "isu-cascading-test";
  }
}

window.customElements.define(IsuCascadingTest.is, IsuCascadingTest);
