import { html, PolymerElement } from '@polymer/polymer'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import '@polymer/paper-dialog'
import './isu-grid-layout'
import './behaviors/isu-elements-shared-styles'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import { BaseBehavior } from './behaviors/base-behavior'
import '@polymer/iron-icon'
import '@polymer/iron-icons'
import './isu-iron-fit'
import { FormatBehavior } from './behaviors/format-behavior'

class IsuInputYear extends mixinBehaviors([BaseBehavior, FormatBehavior], PolymerElement) {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: flex;
        width: var(--isu-input-year-width, 320px);
        height: var(--isu-input-year-height, var(--isu-default-line-height, 34px));
        line-height: var(--isu-input-year-height, var(--isu-default-line-height, 34px));
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }
      
      :host([readonly]) input {
        cursor: default;
      }

      :host([required]) .input__container::before {
        content: "*";
        color: red;
        position: absolute;
        left: -8px;
        line-height: inherit;
        @apply --isu-required
      }
      
      :host([readonly]) .input__container {
        pointer-events: none;
        cursor: default;
      }

      :host([data-invalid]) .input__container {
        border-color: var(--isu-ui-color_pink)!important;
      }
      
      .input__container {
        flex: 1;
        display: flex;
        align-items: center;
        line-height: inherit;
        width: 300px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 2px 5px;
        position: relative;
        cursor: pointer;
        @apply --isu-input-date-contaniner
      }
      
      
      .date-range {
        width: 16px;
        height: 16px;
        color: #ccc;
      }
      
      .clear {
        width: 12px;
        padding: 0 5px;
        z-index: 1;
      }
      
      .icon-clear {
        width: 12px;
        height: 12px;
        border: 1px solid #ccc;
        border-radius: 50%;
        color: #ccc;
        display: none;
      }
      
      .input__container:hover .icon-clear {
        display: inline-block;
      }
      
      .box-value {
        flex: 1;
        padding: 0 5px;
      }
      
      #input__date {
          display: flex;
          height: var(--isu-input-date-height, 34px);
          line-height: 20px;
          margin-top: 1px;
          border-radius: 4px;
          padding: 0;
          background: white;
          color: black;
          box-sizing: border-box;
          visibility: visible;
          opacity: 1;
          @apply --isu-picker-dropdown;
        }
      
      #dateBox {
        border-radius: 4px;
        width: 300px;
        line-height: 20px;
        z-index: 101;
      }
      

      .date-body {
        height: 340px;
        margin: 0;
        padding: 5px;
      }
      
      .date-header {
        display: flex;
        justify-content: space-around;
        font-size: 18px;
        height: 40px;
        align-items: center;
      }
      
      .chevron-iron {
        width: 30px;
        height: 30px;
        color: var(--isu-ui-color_skyblue);
      }
      
      .box-today {
        padding: 0 5px;
        height: 24px;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        color: var(--isu-ui-color_skyblue);
      }

            
      .date-content {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
        text-align: center;
      }
      
      .item-y-m {
        margin: 15px;
        height: 34px;
        line-height: 34px;
      }
      
      .select-item {
        background-color: var(--isu-ui-color_skyblue);
        color: #fff;
        border-radius: 20px;
      }
      
      .disabled {
        background-color: #f1f6fa;
        cursor: not-allowed;
        color: #000!important;
      }
      
      .disabled > div {
        pointer-events: none;
      }
     
      .view-text {
         @apply --isu-input-date-view-text
      }
      
      #dateBox[hidden] {
          display: none;
        }

    </style>
    <template is="dom-if" if="[[ toBoolean(label) ]]">
       <div class="isu-label-div"><span class$="isu-label [[fontSize]]">[[label]]</span><span class="isu-label-after-extension"></span></div>
    </template>
    <div id="input__date" class$="input__container [[fontSize]]" on-click="openDialog">
      <iron-icon class="date-range" icon=icons:date-range></iron-icon>
      <div class="box-value">
        <template is="dom-if" if="[[ !isExistTruthy(value, timestamp) ]]"><span>选择年份</span></template>
        <template is="dom-if" if="[[ isExistTruthy(value, timestamp) ]]">[[value]]</template>
      </div>
      <div class="clear">
        <template is="dom-if" if="[[ isExistTruthy(value, timestamp) ]]">
          <iron-icon class="icon-clear" icon=icons:clear on-click="clear"></iron-icon>
        </template>
      </div>
    </div>
    <isu-iron-fit id="dateBox" hidden auto-fit-on-attach vertical-align="auto" horizontal-align="auto" class="selected" no-overlap dynamic-align>
      <div class$="date-body [[fontSize]]" on-click="_clickDateBody">
        <div class="date-header">
          <div class="box-chevron">
            <iron-icon class="chevron-iron" icon="icons:chevron-left" on-click="yearMinus"></iron-icon>
            <span on-click="yearOpen">[[year]]年</span>
            <iron-icon class="chevron-iron" icon="icons:chevron-right" on-click="yearAdd"></iron-icon>
          </div>
          <div class="box-today" on-click="selectToday">今年</div>
        </div>
        <div class="date-content">
          <template is="dom-if" if="[[isOneOf(showDashboard, 'year', 'month')]]">
            <isu-grid-layout columns="3" column-gap="0" row-gap="0">
              <template is="dom-repeat" items="[[yearList]]">
                <div class$="[[optionalClassY(item, year)]]">
                  <div on-click="selectYearOrMonth">[[item]]</div>
                </div>
              </template>
            </isu-grid-layout>
          </template>
        </div>
      </div>
    </isu-iron-fit>
    <template is="dom-if" if="[[_isView(isView, readonly)]]">
      <div class$="view-text [[fontSize]]">
         <span>[[value]]</span>
      </div>
    </template>
`
  }

  static get properties () {
    return {
      value: {
        type: String,
        notify: true
      },
      label: {
        type: String
      },
      required: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      min: {
        type: String
      },
      max: {
        type: String
      },
      yearList: Array,
      year: Number,
      showDashboard: {
        type: String,
        value: ''
      },
      type: {
        type: String,
        value: 'date',
        reflectToAttribute: true
      },
      rangeList: {
        type: Array,
        value: ['dateRange', 'datetimeRange']
      },
      isView: {
        type: Boolean,
        value: false
      }
    }
  }

  static get is () {
    return 'isu-input-year'
  }

  static get observers () {
    return [
      '_valueChanged(value)',
      '__isViewChanged(isView,readonly)'
    ]
  }

  connectedCallback () {
    super.connectedCallback()
    this.$.dateBox.positionTarget = this.$.input__date
    document.addEventListener('click', e => {
      let target = e.target
      e.stopPropagation()
      while (target && target.tagName !== 'BODY' && target.tagName !== 'ISU-INPUT-DATE' && target.tagName !== 'ISU-IRON-FIT') {
        target = target.parentElement
      }
      if (!this.$.dateBox.hidden && target && target.tagName !== 'ISU-INPUT-DATE' && target.tagName !== 'ISU-IRON-FIT') {
        this.$.dateBox.hidden = true
      }
    })
  }

  /**
     * @param value
     * @private
     */
  _valueChanged (value) {
    this.yearOpen()
  }

  clear (e) {
    e.stopPropagation()
    this.value = ''
  }

  /**
     * 前置填充
     * @param {*} str
     * @param {number} totalLen 填充后的长度
     * @param {string} replenisher 填充的字符
     */
  _preReplenish (str, totalLen = 0, replenisher = '') {
    return `${String(replenisher).repeat(Number(totalLen) - String(str).length)}${String(str)}`
  }

  openDialog (e) {
    e.stopPropagation()
    if (this.rangeList.includes(this.type)) return
    const date = this.value ? new Date(`${this.value}-1-1`) : new Date()
    this.year = date.getFullYear()
    this.yearOpen()
    this.$.dateBox.hidden = false
  }

  yearOpen () {
    const yearList = []
    const year = this.year
    for (let i = year - 5, max = year + 6; i <= max; i++) {
      yearList.push(i)
    }
    this.set('showDashboard', 'year')
    this.set('yearList', yearList)
  }

  yearMinus () {
    const min = this.min ? this.min.split('-')[0] : 1970
    this.year > min && this.year--
    if (this.showDashboard === 'year' && this.yearList[0] > this.year) this.yearOpen()
  }

  yearAdd () {
    const max = this.max ? this.max.split('-')[0] : 9999
    this.year < max && this.year++
    if (this.showDashboard === 'year' && this.yearList[11] < this.year) this.yearOpen()
  }

  optionalClassY (item, year) {
    let str = 'item-y-m'
    if (this.min) {
      str += item <= 12 && item < this.min.split('-')[1] && this.year <= this.min.split('-')[0] ? ' disabled' : ''
      str += item > 12 && item < this.min.split('-')[0] ? ' disabled' : ''
    }
    if (this.max) {
      str += item <= 12 && item > this.max.split('-')[1] && this.year >= this.max.split('-')[0] ? ' disabled' : ''
      str += item > 12 && item > this.max.split('-')[0] ? ' disabled' : ''
    }
    str += item === year ? ' select-item' : ''
    return str
  }

  selectYearOrMonth (e) {
    e.stopPropagation()
    this[this.showDashboard] = e.model.item
    this.set('value', this.year)
    this.$.dateBox.hidden = true
  }

  selectToday (e) {
    e.stopPropagation()
    const date = new Date()
    this.year = date.getFullYear()
    this.set('value', this.year)
    this.$.dateBox.hidden = true
  }

  _isView (isView, readonly) {
    return isView && readonly
  }

  __isViewChanged (isView, readonly) {
    this.$.input__date.style.display = (this.readonly && isView) ? 'none' : 'flex'
  }

  _clickDateBody (e) {
    e.stopPropagation()
    this.$.dateBox.hidden = false
  }
}

window.customElements.define(IsuInputYear.is, IsuInputYear)
