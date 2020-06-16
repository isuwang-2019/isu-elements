import { html, PolymerElement } from '@polymer/polymer'
import '@polymer/iron-icon'
import '@polymer/iron-icons'

import './behaviors/isu-elements-shared-styles'
import './isu-select'

/**
 * `isu-pagination`
 *
 * Example:
 * ```html
 * <isu-pagination total="5000" start="0" limit="20"></isu-pagination>
 * <isu-pagination total="50" page-sizes='[10,20,30]' start="0" limit="10"></isu-pagination>
 * <isu-pagination id="page2" total="5000" start="0" limit="20" size="small"></isu-pagination>
 * <isu-pagination id="page3" total="5000" start="0" limit="20" size="mini" hide-page-select></isu-pagination>
 * <isu-pagination id="pageSingle2" total="1" start="0" limit="20" hide-on-single-page></isu-pagination>
 * <isu-pagination id="pageSelect" total="5000" start="0" limit="20" hide-page-select></isu-pagination>
 *
 * ```
 *
 * ### Styling
 *
 * `<isu-button>` provides the following custom properties and mixins
 * for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--isu-pagination-size-selector` | Mixin applied to the page size selector | {}
 * @customElement
 * @polymer
 * @demo demo/isu-pagination/index.html
 */
class IsuPagination extends PolymerElement {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: inline-block;
        --page_height: 38px;
        height: var(--page_height);
        line-height: var(--page_height);
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }

      .pagination {
        display: flex;
        margin: 0;
        padding: 0;
        list-style: none;
        height: var(--page_height);
        line-height: 38px;
      }

      li > div {
        padding: 0 8px;
        color: var(--isu-ui-color_skyblue);
        background-color: #fff;
        border: 1px solid #f0f0f0;
        border-right: none;
        line-height: var(--page_height);
        white-space: nowrap;
        cursor: pointer;
        text-decoration: none;
        user-select: none;
      }
      
      li:first-of-type > div {
        border-top-left-radius: var(--isu-ui-border-radius);
        border-bottom-left-radius: var(--isu-ui-border-radius);
      }

      li:last-of-type > div {
        border-top-right-radius: var(--isu-ui-border-radius);
        border-bottom-right-radius: var(--isu-ui-border-radius);
        border-right: 1px solid #f0f0f0;
      }

      #inner-input {
        width: 50px;
        font-size: inherit;
        padding: var(--isu-ui-border-radius);
        outline: none;
        border-radius: 2px;
        border: 1px solid #6fa5d3;
      }
      
      input[type=number] {
          -moz-appearance:textfield;
      }
      
      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
      }
      
      .size-selector {
        width: 120px;
        height: var(--page_height);
        line-height: var(--page_height);
        border: 1px solid #f0f0f0;
        
        border-top-right-radius: var(--isu-ui-border-radius);
        border-bottom-right-radius: var(--isu-ui-border-radius);
        
        --isu-select__container: {
          border: none;
        }
        --isu-select-tag: {
          background: #fff;
          border: none;
          line-height: 27px;
          padding: 0;
          color: var(--isu-ui-color_skyblue);
        }
        
        --isu-select-tag-deleter: {
          display: none;
        }
        
        --isu-label: {
           width: 100px;
           font-size: 12px;
        }
        @apply --isu-pagination-size-selector
      }
      
      .page-count {
        display: inline-block;
        width: 30px;
        text-align: center;
      }
      
      :host([size=small]) .pagination > *{
        font-size: 12px;
        padding: 0px;
      }
      :host([size=small]) li > div {
        padding: 0 4px;
      }
      :host([size=small]) .size-selector {
        width: 80px;
        --isu-select-tag-name: {
          font-size: 12px;
        }
      }
      :host([size=mini]) .pagination > *{
        font-size: 12px;
        padding: 0px;
      }
      :host([size=mini]) li > div {
        padding: 0 2px;
      }
      :host([size=mini]) .size-selector {
        width: 78px;
        --isu-select-tag-name: {
          font-size: 12px;
        }
      }
      :host([size=mini]) #inner-input {
        width: 30px;
      }
      :host([size=mini]) iron-icon {
        width: 20px;
      }
    </style>
    <ul class="pagination">
      <li>
        <div on-click="first" id="first"><iron-icon icon="icons:first-page"></iron-icon><template is="dom-if" if="[[!isMini(size)]]">第一页</template></div>
      </li>
      <li>
        <div on-click="prev" id="prev"><iron-icon icon="icons:chevron-left"></iron-icon><template is="dom-if" if="[[!isMini(size)]]">上一页</template></div>
      </li>
     
      <li>
        <div>第 <input id="inner-input" value="{{ __pageIndex::input }}" type="number" maxlength="10" min="1">
          页
        </div>
      </li>
       <li>
        <div on-click="next" id="next"><template is="dom-if" if="[[!isMini(size)]]">下一页</template><iron-icon icon="icons:chevron-right"></iron-icon></div>
      </li>
       <li>
        <div on-click="last" id="last"><template is="dom-if" if="[[!isMini(size)]]">最后一页</template><iron-icon icon="icons:last-page"></iron-icon></div>
      </li>
      <li>
        <div>共 <div class="page-count">[[ totalPageSize ]]</div>页 [[ total ]] 条,每页 [[ limit ]] 条</div>
      </li>
      <template is="dom-if" if="[[!hidePageSelect]]">
        <li>
          <isu-select class="size-selector" value="{{ __limit }}" items="[[ __pageSize ]]"></isu-select>
        </li>
      </template>
      
    </ul>
`
  }

  static get is () {
    return 'isu-pagination'
  }

  static get properties () {
    return {
      /**
       * Max count of single page.
       * @type {number}
       * @default 10
       */
      limit: {
        type: Number,
        observer: '_limitChanged'
      },
      /**
       * Total count.
       * @type {number}
       * @default 0
       */
      total: {
        type: Number,
        value: 0
      },
      /**
       * Size of the pagination, small/mini
       * @type {string}
       * @default 0
       */
      size: {
        type: String,
        value: ''
      },
      /**
       * Total count.
       * @type {boolean}
       * @default false
       */
      hideOnSinglePage: {
        type: Boolean,
        value: false
      },

      /**
       * Total page sizes
       */
      totalPageSize: {
        type: Number,
        computed: '_calTotalPageSize(total, limit)'
      },

      /**
       * Whether or not show the page select items
       * @type {boolean}
       * @default false
       */
      hidePageSelect: {
        type: Boolean,
        value: false
      },
      /**
       * The number of items that are displayed per page
       * @type {array}
       * @default [20, 40, 60]
       */
      pageSizes: {
        type: Array,
        value: function () {
          return [20, 40, 60]
        }
      },

      __pageIndex: {
        type: Number
      },
      /**
       * The start page of the pagination
       * @type {number}
       * @default
       */
      start: {
        type: Number,
        notify: true
      },

      __pageSize: {
        type: Array,
        computed: '__computedPageSize(pageSizes)'
      },

      __limit: {
        type: String
      }
    }
  }

  __computedPageSize (pageSizes = []) {
    return pageSizes.map(ps => ({ value: ps, label: `${ps}条/页` }))
  }

  static get observers () {
    return [
      '_pageIndexChanged(__pageIndex)',
      '__limitChanged(__limit)',
      '_totalChanged(total)',
      '_pageStartChanged(start)'
    ]
  }

  _pageStartChanged (start) {
    if (start >= 0) {
      const pageIndex = Math.floor(start / this.limit) + 1
      if (pageIndex !== this.__pageIndex) {
        this.__pageIndex = pageIndex
      }

      // would not dispatch event when at initial phase
      this.dispatchEvent(new CustomEvent('start-changed', { detail: { value: start }, bubbles: true, composed: true }))
    }
  }

  _totalChanged (total) {
    if (total <= 1 && this.hideOnSinglePage) {
      this.style.display = 'none'
    }
  }

  _pageIndexChanged() {
    this.start = (this.__pageIndex - 1) * this.limit;
  }

  _limitChanged (limit, oldLimit) {
    const totalPage = Math.floor(this.total / limit) + 1
    if (totalPage < this.__pageIndex) {
      this.__pageIndex = totalPage
    } else {
      this.start = (this.__pageIndex - 1) * limit || 0
    }

    // would not dispatch event when at initial phase
    if (oldLimit !== undefined) {
      this.dispatchEvent(new CustomEvent('limit-changed', { detail: { value: limit } }))
    }

    this.__limit = limit.toString()
  }

  __limitChanged (limit) {
    if (limit) {
      this.limit = parseInt(limit)
    }
  }

  _calTotalPageSize (total, limit) {
    return Math.ceil((total || 0) / limit)
  }

  /**
   * Go to the first page.
   */
  first () {
    this.__pageIndex = 1
  }

  /**
   * Go to previous page.
   */
  prev () {
    if (this.__pageIndex > 1) {
      this.__pageIndex--
    }
  }

  /**
   * Go to next page.
   */
  next () {
    if (this.__pageIndex < this.totalPageSize) {
      this.__pageIndex++
    }
  }

  /**
   * Go to the last page.
   */
  last () {
    this.__pageIndex = this.totalPageSize
  }

  isMini (size) {
    return size === 'mini'
  }
}

window.customElements.define(IsuPagination.is, IsuPagination)
