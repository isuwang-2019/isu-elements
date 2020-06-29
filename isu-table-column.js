
import { PolymerElement } from '@polymer/polymer'
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer'
import { Templatizer } from '@polymer/polymer/lib/legacy/templatizer-behavior.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'

/**
 * `isu-grid`
 *
 * Example:
 * ```html
 * <isu-table-column prop="phone" label="电话号码" sortable width="160" default-value="--" cell-style="text-align: right;"></isu-table-column>
 * <isu-table-column prop="sex" label="性别" width="100" type="expand"  model-as="user">
 *   <template>
 *    <div class="ext-container">
 *    <div>姓名：[[user.name]]</div>
 *    <div>sex: [[user.sex]]</div>
 *    <div>phone: [[user.phone]]</div>
 *    </div>
 *   </template>
 * </isu-table-column>
 * <isu-table-column label="操作" width="300" type="operate" model-as="user" frozen fixed="right">
 *
 * ```
 * @customElement
 * @polymer
 * @demo demo/isu-table-column/index.html
 */
class IsuTableColumn extends mixinBehaviors([Templatizer], PolymerElement) {
  static get template () {
    return null
  }

  static get properties () {
    return {
      /**
       *The key whose value needs to be displayed in the td. eg: 'sex'
       *
       * @type {string}
       */
      prop: {
        type: String
      },
      /**
       *The keys whose values need to be displayed in the td. eg: 'sex,name'
       *
       * @type {string}
       */
      props: {
        type: String
      },
      /**
       *The separator when a column displays multiple fields
       *
       * @type {string}
       */
      separator: {
        type: String
      },
      /**
       *The label of the column
       *
       * @type {string}
       */
      label: {
        type: String
      },
      /**
       *The width of the column
       *
       * @type {number}
       */
      width: {
        type: Number
      },
      /**
       *The fixed way a column fixed
       *
       * @type {string}
       */
      fixed: {
        type: String
      },
      /**
       *The fixed way a column fixed
       *
       * @type {string}
       */
      type: {
        type: String,
        value: 'view'
      },

      tmpl: Object,

      modelAs: {
        type: String,
        value: 'item'
      },
      /**
       *Whether the column is sortable
       *
       * @type {boolean}
       * @default false
       */
      sortable: {
        type: Boolean,
        value: false
      },
      /**
       *Whether the column is frozen
       *
       * @type {boolean}
       * @default false
       */
      frozen: {
        type: Boolean,
        value: false
      },

      formatter: Function,
      /**
       * The column style, can set the color, alignment,etc.
       *
       * @type {string}
       * */
      cellStyle: {
        type: String
      },
      /**
       * The default value of the column
       *
       * @type {string}
       * */
      defaultValue: {
        type: String
      }
    }
  }

  static get is () {
    return 'isu-table-column'
  }

  constructor () {
    super()
    this.tmpl = this._findTemplate().pop()

    if (this.tmpl) {
      // hack for template.__dataHost
      this.tmpl.__dataHost = this.parentElement
      this._parentModel = {}
      this.templatize(this.tmpl)
    }
  }

  _findTemplate () {
    return FlattenedNodesObserver.getFlattenedNodes(this)
      .filter(node => node.localName === 'template')
  }

  stampTemplate (instanceProps, key = this.modelAs) {
    if (this.tmpl) return this.stamp({ [key]: instanceProps, global: this.tmpl.__dataHost.global })
    return null
  }
}

window.customElements.define(IsuTableColumn.is, IsuTableColumn)
