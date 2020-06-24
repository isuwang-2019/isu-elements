import { html, PolymerElement } from '@polymer/polymer'
import { Templatizer } from '@polymer/polymer/lib/legacy/templatizer-behavior.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
/**
 * `isu-table-column`
 *
 * Example:
 * ```html
 *
 * ```
 * @customElement
 * @polymer
 * @demo demo/isu-table-column/index.html
 */
class IsuEditTableColumn extends mixinBehaviors([Templatizer], PolymerElement) {
  static get template () {
    return null
  }

  static get properties () {
    return {
      prop: {
        type: String
      },

      label: {
        type: String
      },

      width: {
        type: Number
      },

      type: {
        type: String
      }
    }
  }

  static get is () {
    return 'isu-edit-table-column'
  }

  constructor () {
    super()
  }
}

window.customElements.define(IsuEditTableColumn.is, IsuEditTableColumn)
