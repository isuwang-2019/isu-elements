/**
`h2-pagination`

Example:
```html
<h2-pagination total="30" limit="5" paging="{{paging}}"></h2-pagination>
```
*/
import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/iron-icon';
import '@polymer/iron-icons';

import './behaviors/h2-elements-shared-styles';
import './h2-select';

/**
 * @customElement
 * @polymer
 * @demo demo/h2-pagination/index.html
 */
class H2Pagination extends PolymerElement {
  static get template() {
    return html`
    <style include="h2-elements-shared-styles">
      :host {
        display: inline-block;
        --page_height: 38px;
        height: var(--page_height);
        line-height: var(--page_height);
        font-family: var(--h2-ui-font-family), sans-serif;
        font-size: var(--h2-ui-font-size);
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
        color: var(--h2-ui-color_skyblue);
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
        border-top-left-radius: var(--h2-ui-border-radius);
        border-bottom-left-radius: var(--h2-ui-border-radius);
      }

      li:last-of-type > div {
        border-top-right-radius: var(--h2-ui-border-radius);
        border-bottom-right-radius: var(--h2-ui-border-radius);
        border-right: 1px solid #f0f0f0;
      }

      #inner-input {
        width: 50px;
        font-size: inherit;
        padding: var(--h2-ui-border-radius);
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
        
        border-top-right-radius: var(--h2-ui-border-radius);
        border-bottom-right-radius: var(--h2-ui-border-radius);
        
        --h2-select__container: {
          border: none;
        }
        --h2-select-tag: {
          background: #fff;
          border: none;
          line-height: 27px;
          padding: 0;
          color: var(--h2-ui-color_skyblue);
        }
        
        --h2-select-tag-deleter: {
          display: none;
        }
        
        --h2-label: {
           width: 100px;
           font-size: 12px;
        }
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
        --h2-select-tag-name: {
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
        --h2-select-tag-name: {
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
        <div>共 <div class="page-count">[[ totalPageSize ]]</div>页 [[ total ]] 条</div>
      </li>
      <template is="dom-if" if="[[!hidePageSelect]]">
        <li>
          <h2-select class="size-selector" value="{{ __limit }}" items="[[ __pageSize ]]"></h2-select>
        </li>
      </template>
      
    </ul>
`;
  }

  static get is() {
    return "h2-pagination";
  }

  static get properties() {
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
       */
      hidePageSelect: {
        type: Boolean,
        value: false
      },

      pageSizes: {
        type: Array,
        value: function () {
          return [20, 40, 60];
        }
      },

      __pageIndex: {
        type: Number,
      },

      start: {
        type: Number,
        observer: '_pageStartChanged'
      },

      __pageSize: {
        type: Array,
        computed: '__computedPageSize(pageSizes)'
      },

      __limit: {
        type: String
      }
    };
  }

  __computedPageSize(pageSizes = []) {
    return pageSizes.map(ps => ({value: ps, label: `${ps}条/页`}))
  }

  static get observers() {
    return [
      '_pageIndexChanged(__pageIndex)',
      '__limitChanged(__limit)',
      '_totalChanged(total)'
      // '_pageStartChanged(start)',
    ];
  }

  _pageStartChanged(start, oldStart) {
    if(start >= 0) {
      const pageIndex = Math.floor(start / this.limit) + 1;
      if (pageIndex !== this.__pageIndex) {
        this.__pageIndex = pageIndex;
      }

      // would not dispatch event when at initial phase
      if (oldStart !== undefined) {
        this.dispatchEvent(new CustomEvent("start-changed", {detail: {value: start}}));
      }
    }
  }

  _totalChanged(total) {
    if (total <=1 && this.hideOnSinglePage) {
      this.style.display = 'none'
    }
  }

  _pageIndexChanged() {
    this.start = (this.__pageIndex - 1) * this.limit;
  }

  _limitChanged(limit, oldLimit) {
    const totalPage = Math.floor(this.total / limit) + 1;
    if (totalPage < this.__pageIndex) {
      this.__pageIndex = totalPage;
    } else {
      this.start = (this.__pageIndex - 1) * limit || 0;
    }

    // would not dispatch event when at initial phase
    if (oldLimit !== undefined) {
      this.dispatchEvent(new CustomEvent("limit-changed", {detail: {value: limit}}));
    }

    this.__limit = limit.toString();
  }

  __limitChanged(limit) {
    this.limit = parseInt(limit);
  }

  _calTotalPageSize(total, limit) {
    return Math.ceil((total || 0) / limit);
  }

  /**
   * Go to the first page.
   */
  first() {
    this.__pageIndex = 1;
  }

  /**
   * Go to previous page.
   */
  prev() {
    if (this.__pageIndex > 1) {
      this.__pageIndex--;
    }
  }

  /**
   * Go to next page.
   */
  next() {
    if (this.__pageIndex < this.totalPageSize) {
      this.__pageIndex++;
    }
  }

  /**
   * Go to the last page.
   */
  last() {
    this.__pageIndex = this.totalPageSize;
  }

  isMini(size) {
    return size === 'mini'
  }
}

window.customElements.define(H2Pagination.is, H2Pagination);
