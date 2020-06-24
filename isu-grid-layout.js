import { html, PolymerElement } from '@polymer/polymer'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import './behaviors/isu-elements-shared-styles.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import { BaseBehavior } from './behaviors/base-behavior'
import '@polymer/iron-icon/iron-icon'
import '@polymer/iron-icons/iron-icons'

/**
 * `isu-grid-layout`
 *
 * Example:
 * ```html
 * 基本用法
 *<isu-grid-layout columns="6" column-gap="10" row-gap="20" class="layout">
 *  <div class="lay">Lorem ipsum dolor sit amet consectetur, adipisicing elit.  architecto. Eius, maiores ad?</div>
 *  <div class="lay" layout-colspan="3" layout-rowspan="3">Quibusdam, eos esse dolorum facere voluptatem eius, dolore quas totam aspernatur obcaecati harum? Nihil eligendi eos minus odit minima earum incidunt rem fugit reprehenderit, molestiae possimus eveniet itaque laudantium excepturi.</div>
 *  <div class="lay">Ducimus quibusdam inventore delectus doloribus dignissimos. Dignissimos quos officia minus exercitationem perspiciatis harum iusto molestiae deleniti quod sunt amet recusandae autem, neque doloremque ad alias eaque consequuntur nesciunt quis eius!</div>
 *  <div class="lay">Cumque aspernatur ex ipsum dolorum eius, tempore omnis minus sequi architecto totam sunt maxime nemo, ab repellendus. Aut voluptatem saepe voluptatibus nisi ipsum. Debitis corporis culpa ipsa error nemo doloribus.</div>
 *  <div class="lay">Consequatur dolore, architecto quos saepe consequuntur libero minus totam? Enim optio provident commodi corporis officiis, sunt maiores? Cupiditate consequuntur, cumque natus corporis velit sunt ad magni aliquid facere deleniti molestiae.</div>
 *  <div class="lay">Voluptatibus similique modi voluptatum voluptatem quo quod minima ducimus facere, sequi libero accusamus nisi nobis? Minima error tempore quo esse quod odit, deleniti labore nulla ullam velit nemo neque sint!</div>
 *  <div class="lay" layout-colspan="1" layout-rowspan="3">Qui, corporis delectus? Pariatur vel autem commodi, accusantium, voluptate obcaecati iste, a debitis facilis repellendus mollitia. Dolore dicta totam, quaerat omnis accusantium magni alias voluptates eligendi ex id aut dolorem?</div>
 *  <div class="lay">Recusandae tempora ab error omnis exercitationem illo accusamus esse sit ipsa accusantium iure, possimus ducimus quis consequuntur qui corporis nobis culpa repudiandae! Suscipit, debitis. Omnis delectus at vitae laborum quos?</div>
 *  <div class="lay">Dolorem saepe accusamus sed placeat porro ex, ab, vel eaque libero incidunt facilis delectus, iure odio dicta error consequuntur perspiciatis quasi? Corrupti incidunt quia asperiores quo magnam at minima laudantium?</div>
 *  <div class="lay">Dolor ad saepe, nemo fugit tempora autem est fugiat quis porro atque nam repellendus maxime neque voluptatem rerum amet odit aspernatur voluptates iusto eos laboriosam enim vel. Eius, debitis beatae!</div>
 *</isu-grid-layout>
 * 新增折叠功能
 * <isu-grid-layout columns="6" column-gap="10" row-gap="20" class="layout" accordion title="自定义标题">
 *  <isu-button slot="header" size="small">编辑</isu-button>
 *  <div class="lay">Lorem ipsum dolor sit amet consectetur, adipisicing elit.  architecto. Eius, maiores ad?</div>
 *  <div class="lay" layout-colspan="3" layout-rowspan="3">Quibusdam, eos esse dolorum facere voluptatem eius, dolore quas totam aspernatur obcaecati harum? Nihil eligendi eos minus odit minima earum incidunt rem fugit reprehenderit, molestiae possimus eveniet itaque laudantium excepturi.</div>
 *  <div class="lay">Ducimus quibusdam inventore delectus doloribus dignissimos. Dignissimos quos officia minus exercitationem perspiciatis harum iusto molestiae deleniti quod sunt amet recusandae autem, neque doloremque ad alias eaque consequuntur nesciunt quis eius!</div>
 *  <div class="lay">Cumque aspernatur ex ipsum dolorum eius, tempore omnis minus sequi architecto totam sunt maxime nemo, ab repellendus. Aut voluptatem saepe voluptatibus nisi ipsum. Debitis corporis culpa ipsa error nemo doloribus.</div>
 *  <div class="lay">Consequatur dolore, architecto quos saepe consequuntur libero minus totam? Enim optio provident commodi corporis officiis, sunt maiores? Cupiditate consequuntur, cumque natus corporis velit sunt ad magni aliquid facere deleniti molestiae.</div>
 *  <div class="lay">Voluptatibus similique modi voluptatum voluptatem quo quod minima ducimus facere, sequi libero accusamus nisi nobis? Minima error tempore quo esse quod odit, deleniti labore nulla ullam velit nemo neque sint!</div>
 *  <div class="lay" layout-colspan="1" layout-rowspan="3">Qui, corporis delectus? Pariatur vel autem commodi, accusantium, voluptate obcaecati iste, a debitis facilis repellendus mollitia. Dolore dicta totam, quaerat omnis accusantium magni alias voluptates eligendi ex id aut dolorem?</div>
 *  <div class="lay">Recusandae tempora ab error omnis exercitationem illo accusamus esse sit ipsa accusantium iure, possimus ducimus quis consequuntur qui corporis nobis culpa repudiandae! Suscipit, debitis. Omnis delectus at vitae laborum quos?</div>
 *  <div class="lay">Dolorem saepe accusamus sed placeat porro ex, ab, vel eaque libero incidunt facilis delectus, iure odio dicta error consequuntur perspiciatis quasi? Corrupti incidunt quia asperiores quo magnam at minima laudantium?</div>
 *  <div class="lay">Dolor ad saepe, nemo fugit tempora autem est fugiat quis porro atque nam repellendus maxime neque voluptatem rerum amet odit aspernatur voluptates iusto eos laboriosam enim vel. Eius, debitis beatae!</div>
 *</isu-grid-layout>
 *  部分定宽
 *<isu-grid-layout row-gap="20" class="layout" template-columns="200px 300px auto 100px">
 *  <div class="lay">Lorem ipsum dolor sit amet consectetur, adipisicing elit.  architecto. Eius, maiores ad?</div>
 *  <div class="lay">Quibusdam, eos esse dolorum facere voluptatem eius, dolore quas totam aspernatur obcaecati harum? Nihil eligendi eos minus odit minima earum incidunt rem fugit reprehenderit, molestiae possimus eveniet itaque laudantium excepturi.</div>
 *  <div class="lay">Ducimus quibusdam inventore</div>
 *  <div class="lay">Cumque aspernatur ex ipsum dolorum eius</div>
 *  <div class="lay">Recusandae tempora ab error omnis exercitationem</div>
 *  <div class="lay">Dolorem saepe accusamus sed placeat porro ex, ab, vel eaque libero incidunt facilis delectus, iure odio dicta error consequuntur perspiciatis quasi? Corrupti incidunt quia asperiores quo magnam at minima laudantium?</div>
 *  <div class="lay">Dolor ad saepe, nemo fugit tempora autem est fugiat quis porro atque nam repellendus maxime neque voluptatem rerum amet odit aspernatur voluptates iusto eos laboriosam enim vel. Eius, debitis beatae!</div>
 *</isu-grid-layout>
 * 横行合并
 *<isu-grid-layout column-gap="10" class="layout" template-columns="auto 20% 20%">
 *  <div class="lay">Lorem ipsum dolor sit amet consectetur, adipisicing elit.  architecto. Eius, maiores ad?</div>
 *  <div class="lay">Ducimus quibusdam inventore</div>
 *  <div class="lay">Cumque aspernatur ex ipsum dolorum eius</div>
 *  <div class="lay" full-colspan>Quibusdam, eos esse dolorum facere voluptatem eius, dolore quas totam aspernatur obcaecati harum? Nihil eligendi eos minus odit minima earum incidunt rem fugit reprehenderit, molestiae possimus eveniet itaque laudantium excepturi.</div>
 *  <div class="lay">Recusandae tempora ab error omnis exercitationem</div>
 *  <div class="lay">Dolorem saepe accusamus sed placeat porro ex, ab, vel eaque libero incidunt facilis delectus, iure odio dicta error consequuntur perspiciatis quasi? Corrupti incidunt quia asperiores quo magnam at minima laudantium?</div>
 *  <div class="lay">Dolor ad saepe, nemo fugit tempora autem est fugiat quis porro atque nam repellendus maxime neque voluptatem rerum amet odit aspernatur voluptates iusto eos laboriosam enim vel. Eius, debitis beatae!</div>
 *</isu-grid-layout>
 * ```
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * |Custom property | Description | Default|
 * |----------------|-------------|----------|
 * |`--isu-grid-layout` | Mixin applied to the grid layout | {}
 *
 * @customElement
 * @polymer
 * @demo demo/isu-grid-layout/index.html
 */
class IsuGridLayout extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }
      .isu-grid-layout {
        display: grid;
        max-height: 2000px;
        overflow: auto;
        @apply --isu-grid-layout;
      }
      
      .header {
        width: 100%;
        padding: 5px;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
        position: relative;
        font-size: 16px;
        font-weight: 700;
      }
      
      .header-btn {
        position: absolute;
        right: 50px;
        top: 0;
      }
      
      #caret {
        position: absolute;
        right: 10px;
        top: 0;
      }
      
      :host([opened]) #caret {
        transform: rotate(-90deg);
        transition: transform .2s ease-in-out;
      }
      
      :host([opened]) .isu-grid-layout {
        padding: 0;
        max-height: 0;
        transition: max-height .3s ease-in-out;
        overflow: hidden;
      }
      
    </style>
    <template is="dom-if" if="[[accordion]]">
      <div class="header" on-click="__handler">
        <div class="title">[[title]]</div>
        <div class="header-btn">
          <slot name="header"></slot>
        </div>
        <iron-icon id="caret" icon="icons:expand-more"></iron-icon>
      </div>
    </template>
    <div class="isu-grid-layout" id="isu-grid-layout">
      <slot id="layout"></slot>
    </div>
    `
  }

  static get properties () {
    return {
      /**
       * Number of columns
       * @type {number}
       * @default 4
       * */
      columns: {
        type: Number,
        value: 4
      },
      /**
       * The column spacing
       * @type {number}
       * @default 20
       * */
      columnGap: {
        type: Number,
        value: 20
      },
      /**
       * The row spacing
       * @type {number}
       * @default 20
       * */
      rowGap: {
        type: Number,
        value: 20
      },
      /**
       * Customize the width of each section
       * @type {string}
       * @default
       * */
      templateColumns: {
        type: String
      },
      /**
       * Is accordion or not
       * @type {boolean}
       * @default
       * */
      accordion: {
        type: Boolean
      },
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * The title of the grid layout
       * @type {string}
       * @default 标题
       * */
      title: {
        type: String,
        value: '标题'
      }

    }
  }

  static get observers () {
    return [
      '__columnsChange(columns)',
      '__columnGapChange(columnGap)',
      '__rowGapChange(rowGap)',
      '__templateColumnsChange(templateColumns)'
    ]
  }

  __columnsChange (columns) {
    if (!this.templateColumns) {
      this.$['isu-grid-layout'].style['grid-template-columns'] = `repeat(${columns}, 1fr)`
    }
  }

  __columnGapChange (columnGap) {
    this.$['isu-grid-layout'].style['grid-column-gap'] = `${columnGap}px`
  }

  __rowGapChange (rowGap) {
    this.$['isu-grid-layout'].style['grid-row-gap'] = `${rowGap}px`
  }

  __templateColumnsChange (templateColumns) {
    if (this.templateColumns) {
      this.$['isu-grid-layout'].style['grid-template-columns'] = templateColumns
    }
  }

  __handler () {
    this.opened = !this.opened
  }

  connectedCallback () {
    super.connectedCallback()
    this.$.layout.addEventListener('slotchange', e => {
      const assignedElements = e.target.assignedElements()

      assignedElements.filter(_ => _.hasAttribute('layout-colspan')).forEach(item => {
        item.style['grid-column-end'] = `span ${item.getAttribute('layout-colspan')}`
      })

      assignedElements.filter(_ => _.hasAttribute('layout-rowspan')).forEach(item => {
        item.style['grid-row-end'] = `span ${item.getAttribute('layout-rowspan')}`
      })

      const columnSpans = !this.templateColumns ? this.columns : this.templateColumns.split(/\s+/g).length
      assignedElements.filter(_ => _.hasAttribute('full-colspan')).forEach(item => {
        item.style['grid-column-end'] = `span ${columnSpans}`
      })
    })
  }

  static get is () {
    return 'isu-grid-layout'
  }
}

window.customElements.define(IsuGridLayout.is, IsuGridLayout)
