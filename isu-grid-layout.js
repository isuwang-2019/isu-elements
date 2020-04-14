import {html, PolymerElement} from "@polymer/polymer";
import './behaviors/isu-elements-shared-styles.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';

/**
 * `isu-grid-layout`
 *
 * Example:
 * ```html
 *
 * ```
 * @customElement
 * @polymer
 * @demo demo/isu-grid-layout/index.html
 */
class IsuGridLayout extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template() {
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

  static get properties() {
    return {
      /**
       * 列数量
       * */
      columns: {
        type: Number,
        value: 4
      },
      /**
       * 列间隔
       * */
      columnGap: {
        type: Number,
        value: 20
      },
      /**
       * 行间隔
       * */
      rowGap: {
        type: Number,
        value: 20
      },
      /**
       * 部分定宽
       * */
      templateColumns: {
        type: String
      },
      /**
       * 是否可折叠
       * */
      accordion: {
        type: Boolean
      },
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      title: {
        type: String,
        value: '标题'
      }

    }
  }

  static get observers() {
    return [
      '__columnsChange(columns)',
      '__columnGapChange(columnGap)',
      '__rowGapChange(rowGap)',
      '__templateColumnsChange(templateColumns)'
    ]
  }

  __columnsChange(columns) {
    if (!this.templateColumns) {
      this.$['isu-grid-layout'].style['grid-template-columns'] = `repeat(${columns}, 1fr)`;
    }
  }

  __columnGapChange(columnGap) {
    this.$['isu-grid-layout'].style['grid-column-gap'] = `${columnGap}px`;
  }

  __rowGapChange(rowGap) {
    this.$['isu-grid-layout'].style['grid-row-gap'] = `${rowGap}px`;
  }

  __templateColumnsChange(templateColumns) {
    if (this.templateColumns) {
      this.$['isu-grid-layout'].style['grid-template-columns'] = templateColumns;
    }
  }

  __handler() {
    this.opened = !this.opened;
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.layout.addEventListener('slotchange', e => {
      const assignedElements = e.target.assignedElements();

      assignedElements.filter(_ => _.hasAttribute('layout-colspan')).forEach(item => {
        item.style['grid-column-end'] = `span ${item.getAttribute('layout-colspan')}`
      });

      assignedElements.filter(_ => _.hasAttribute('layout-rowspan')).forEach(item => {
        item.style['grid-row-end'] = `span ${item.getAttribute('layout-rowspan')}`
      });

      const columnSpans = !this.templateColumns ? this.columns : this.templateColumns.split(/\s+/g).length;
      assignedElements.filter(_ => _.hasAttribute('full-colspan')).forEach(item => {
        item.style['grid-column-end'] = `span ${columnSpans}`
      });

    });
  }

  static get is() {
    return "isu-grid-layout";
  }
}

window.customElements.define(IsuGridLayout.is, IsuGridLayout);
