import { html, PolymerElement } from '@polymer/polymer'
import '@polymer/paper-dialog'
import './behaviors/isu-elements-shared-styles.js'
import './isu-grid-layout'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import { BaseBehavior } from './behaviors/base-behavior'
import '@polymer/iron-icon'
import '@polymer/iron-icons'
import './isu-select'
import './utils/jedate/js/jedate'
import { FormatBehavior } from './behaviors/format-behavior'

/**
 *
 * `isu-input-jedate`
 *
 * Example:
 * ```html
 * if you want to use this component, you need to import jedate.css in the host html document manually. It`s relative path is ./utils/jedate/skin/jedate.css
 *
 * <isu-input-jedate class="input-date multi" label="年选择" format="YYYY" placeholder="YYYY" required></isu-input-jedate>
 * <isu-input-jedate class="input-date multi" label="年月选择" format="YYYY-MM" placeholder="YYYY-MM"></isu-input-jedate>
 * <isu-input-jedate class="input-date multi" label="年月日选择" format="MM-DD-YYYY" placeholder="MM-DD-YYYY"></isu-input-jedate>
 * <isu-input-jedate class="input-date multi" label="年月日时分秒选择" festival min="1900-01-01" max="2099-12-31"
 * format="YYYY-MM-DD hh:mm:ss" placeholder="YYYY-MM-DD hh:mm:ss"></isu-input-jedate>
 * <isu-input-jedate class="input-date multi" label="时分秒选择" format="hh:mm:ss" min="01:02:08" max="15:25:35" placeholder="hh:mm:ss"></isu-input-jedate>
 *
 * <isu-input-jedate class="input-date multi" label="年月日选择" format="YYYY-MM-DD" placeholder="YYYY-MM-DD" language="en"></isu-input-jedate>
 *<isu-input-jedate class="input-date multi" id="testBlue" label="蓝色主题" format="YYYY-MM-DD hh:mm:ss"
 *  placeholder="YYYY-MM-DD hh:mm:ss"></isu-input-jedate>
 *<script>
 *  testBlue.theme = {bgcolor:'#00A1CB',pnColor:'#00CCFF'}
 *</script>
 *<isu-input-jedate label="年范围选择" format="YYYY" placeholder="YYYY" range=" ~ "></isu-input-jedate>
 *<isu-input-jedate label="年月范围选择" format="YYYY-MM" placeholder="YYYY-MM" range=" To "></isu-input-jedate>
 *<isu-input-jedate label="日范围选择" format="YYYY-MM-DD" placeholder="YYYY-MM-DD" range=" 至 "></isu-input-jedate>
 *<isu-input-jedate label="年范围选择" format="YYYY" placeholder="YYYY" range=" ~ " multi-pane="false"></isu-input-jedate>
 *<isu-input-jedate label="年月范围选择" format="YYYY-MM" placeholder="YYYY-MM" range=" To " ></isu-input-jedate>
 *<isu-input-jedate label="日范围选择" format="YYYY-MM-DD" placeholder="YYYY-MM-DD" range=" 至 " ></isu-input-jedate>
 *<isu-input-jedate label="日时分秒范围选择" format="YYYY-MM-DD hh:mm:ss" placeholder="YYYY-MM-DD hh:mm:ss" range=" ~ "></isu-input-jedate>
 *<isu-input-jedate label="时分秒范围选择" format="hh:mm:ss" placeholder="hh:mm:ss" range=" To "></isu-input-jedate>
 *<isu-input-jedate label="时分范围选择" format="hh:mm" placeholder="hh:mm" range=" 至 "></isu-input-jedate>
 *<isu-input-jedate label="自定义格式" format="YYYY年MM月DD日" placeholder="YYYY年MM月DD日"></isu-input-jedate>
 *<isu-input-jedate label="自定义格式" format="MM-DD-YYYY" placeholder="MM-DD-YYYY"></isu-input-jedate>
 *<isu-input-jedate label="自定义格式" format="DD/MM/YYYY" placeholder="DD/MM/YYYY"></isu-input-jedate>
 *<isu-input-jedate id="multiPane7" label="自定义格式（双面板）" format="DD/MM/YYYY" placeholder="DD/MM/YYYY" range=" 至 " multi-pane="false"></isu-input-jedate>
 *<isu-input-jedate label="默认初始赋值" format="YYYY-MM-DD" placeholder="YYYY年MM月DD日" isinit-val></isu-input-jedate>
 *<isu-input-jedate label="只读" format="YYYY年MM月DD日" placeholder="YYYY年MM月DD日" bind-data="1517760000000" readonly></isu-input-jedate>
 * ```
 *
 * @customElement
 * @polymer
 * @demo demo/isu-input-jedate/index.html
 */
class IsuInputJedate extends mixinBehaviors([BaseBehavior, FormatBehavior], PolymerElement) {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: flex;
        width: var(--isu-input-jedate-width, 300px);
        height: var(--isu-input-jedate-height, 34px);
        line-height: var(--isu-input-jedate-height, 34px);
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }
      :host .jeinpbox{
        width: 200px;
        margin-right: 10px;
        vertical-align: middle;
        flex: 1;
        display: flex;
        line-height: inherit;
        position: relative;
      }
      :host .jeinput{
        display: block;
        width: 100%;
        padding-left: 10px; 
        height: var(--isu-input-jedate-height, 34px);
        float:left;
        line-height: var(--isu-input-jedate-height, 34px);
        border: 1px solid #e6e6e6;
        border-radius: 3px;
        background-color: #fcfcfc;
        box-sizing: border-box;
      }
      :host .input__container {
        flex: 1;
        display: flex;
        line-height: inherit;
        min-width: 0;
        position: relative;
        }
        .isu-label {
        position: relative;
      }
      :host([data-invalid]) .jeinput {
        border-color: var(--isu-ui-color_pink)!important;
      }
      :host([required]) .input__container::before {
        content: "*";
        color: red;
        position: absolute;
        left: -8px;
        line-height: inherit;
        @apply --isu-required
      }
      :host([readonly]) .jeinput {
        cursor: default;
      }
      .view-text {
        @apply --isu-view-text
      }
    </style>
    <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class$="isu-label [[fontSize]]">[[label]]</div>
      </template>
    <div class$="input__container [[fontSize]]" id="input__jedate">
       <div class="jeinpbox"><input type="text" id$="[[id]]" class$="jeinput [[fontSize]]" readonly$="[[readonly]]" placeholder$="[[placeholder]]" value$="{{value}}"></div>
      <div class="prompt-tip__container" data-prompt$="[[prompt]]">
          <div class="prompt-tip">
            <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
            [[prompt]]
          </div>
      </div>
    </div>
    <template is="dom-if" if="[[_isView(isView, readonly)]]">
      <div class$="view-text [[fontSize]]">
         <span>{{value}}</span>
      </div>
    </template>
  `
  }

  static get properties () {
    return {
      /**
       * The value of the input, return a date string format to `yyyy-MM-dd`.
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * The value of the input, return a timestamp
       * @type {Number}
       */
      timestamp: {
        type: String,
        notify: true
      },
      /**
       * The label of the input.
       */
      label: {
        type: String
      },
      /**
       * The placeholder of the input.
       */
      placeholder: {
        type: String,
        value: '请输入'
      },
      /**
       * Set to true, if the input is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Set to true, if the input is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * The minimum date which can be chosen. It should be a string format to `YYYY-MM-DD`.
       * @type {string}
       */
      min: {
        type: String
      },
      /**
       * The maximum date which can be chosen. It should be a string format to `YYYY-MM-DD`.
       * @type {string}
       */
      max: {
        type: String
      },
      /**
       * The format of the date
       * @type {string}
       * @default 'YYYY-MM-DD'
       */
      format: {
        type: String,
        value: 'YYYY-MM-DD'
      },
      /**
       * Double panel or not, show double panel if multiPane is false
       * @type {boolean}
       * @default true
       */
      multiPane: {
        type: Boolean,
        value: true
      },
      /**
       * Whether it is displayed as a fixed calender or not, if false, displayed as a fixed calender
       * @type {boolean}
       * @default true
       */
      isShow: {
        type: Boolean,
        value: true
      },
      /**
       * Close the shell layer after selecting date, if false, close the shell layer after selecting date
       * @type {boolean}
       * @default true
       */
      onClose: {
        type: Boolean,
        value: true
      },
      /**
       * If it is not empty and not false, a range selection will be made. eg: " 至 "，" ~ "，" To "
       * @type {string}
       * @default false
       */
      range: {
        type: String,
        value: false
      },
      /**
       * Whether it is an internal event or not. It is an internal event by default.
       * @type {string}
       * @default 'click'
       */
      trigger: {
        type: String,
        value: 'click'
      },
      /**
       * Custom date bouncer`s offset position,the length is 0, bouncer will automactically find the position.
       * @type {array}
       * @default []
       */
      position: {
        type: Array,
        value: []
      },
      /**
       * Whether initialize the time or not. Does not initialize the time by default.
       * @type {boolean}
       * @default false
       */
      isinitVal: {
        type: Boolean,
        value: false
      },
      /**
       * Initialize the date, add or minus the day, time, minute
       * @type {boolean}
       * @default false
       */
      initDate: {
        type: Object,
        value: {}
      },
      /**
       * Whether to turn on the time selection or not
       * @type {boolean}
       * @default true
       */
      isTime: {
        type: Boolean,
        value: true
      },
      /**
       * Whether to display the clear button
       * @type {boolean}
       * @default true
       */
      isClear: {
        type: Boolean,
        value: true
      },
      /**
       * Whether to display the today or this mounth button
       * @type {boolean}
       * @default true
       */
      isToday: {
        type: Boolean,
        value: true
      },
      /**
       * Whether to display the ok button
       * @type {boolean}
       * @default true
       */
      isYes: {
        type: Boolean,
        value: true
      },
      /**
       * Whether to display the lunar festival
       * @type {boolean}
       * @default false
       */
      festival: {
        type: Boolean,
        value: false
      },
      /**
       * Valid date and non-valid date. eg: ["0[4-7]$,1[1-5]$,2[58]$",true]
       * @type {array}
       * @default []
       */
      valiDate: {
        type: Array,
        value: []
      },
      /**
       * Whether the position is fixed or not. The position is located in the input box when it is true, and the position is centered when it is false
       * @type {boolean}
       * @default true
       */
      fixed: {
        type: Boolean,
        value: true
      },
      /**
       * Custom theme colors
       * @type {object}
       * @default {}
       */
      theme: {
        type: Object,
        value: {}
      },
      /**
       * language，'en'/'cn'
       * @type {string}
       * @default 'cn'
       */
      language: {
        type: String,
        value: 'cn'
      },
      /**
       * Custom methods
       * @type {object}
       * @default {}
       */
      method: {
        type: Object,
        value: {}
      },
      /**
       * Methods executed before the interface loads
       * @type {function}
       * @default null
       */
      before: {
        type: Function,
        value: null
      },
      /**
       * Methods executed after the interface loads
       * @type {function}
       * @default null
       */
      succeed: {
        type: Function,
        value: null
      },
      /**
       * The level height of the pop-up layer
       * @type {number}
       * @default 2099
       */
      zIndex: {
        type: Number,
        value: 2099
      },
      /**
       * The shortcut to date selection
       * @type {array}
       * @default []
       */
      shortcut: {
        type: Array,
        value: []
      },
      /**
       * The set of selected values, if there is a range there are two values in the set, if there is no range, there is only one value. Each value in the set is timestamp.
       * @type {array}
       * @default []
       */
      selectedItems: {
        type: Array,
        value: []
      },
      id: {
        type: String,
        value: 'test' + Math.floor(Math.random() * 10000)
      },
      dateArray: {
        type: Array,
        value: []
      },
      /**
       * The prompt tip to show when input is invalid.
       * @type String
       */
      prompt: {
        type: String
      },
      /**
       * The prompt tip's position. top/bottom
       * @type String
       * @default ''
       */
      promptPosition: {
        type: String,
        value: ''
      },
      /**
       * The text mode display requires readonly=true to take effect
       * @type {boolean}
       * @default false
       * */
      isView: {
        type: Boolean,
        value: false
      },
      _jedate: {
        type: Object
      }
    }
  }

  static get observers () {
    return [
      '_idChanged(id)',
      '_valueChanged(value)',
      '_timestampChanged(timestamp)',
      'getInvalidAttribute(required, value)',
      '__isViewChanged(isView,readonly)'
    ]
  }

  static get is () {
    return 'isu-input-jedate'
  }

  _valueChanged (value) {
    if (this.format.indexOf('YYYY') !== -1) {
      if (this.dateArray.length > 0) {
        const dateArray = this.dateArray.map(item => {
          let date = `${item.YYYY}-${item.MM}`
          date += this.format.indexOf('DD') !== -1 ? `-${item.DD}` : ''
          date += this.format.indexOf('hh') !== -1 ? ` ${item.hh}` : ''
          date += this.format.indexOf('mm') !== -1 ? `:${item.mm}` : ''
          date += this.format.indexOf('ss') !== -1 ? `:${item.ss}` : ''
          return +new Date(date)
        })
        this.set('timestamp', dateArray[0])
        this.set('selectedItems', dateArray)
      } else if (!this.isEmptyObject(value)) {
        this.set('timestamp', this.dateToTimestamp(value))
      } else if (this.value === '') {
        this.set('timestamp', '')
      }
    }
    if (this._jedate && value !== undefined && value != null) {
      // 手动清空输入框的值，否则的话无法清除
      if (this.timestamp === '') {
        this._jedate.valCell.value = ''
      }
      this._jedate.setValue(value)
    }
  }

  donefun (e) {
    this.set('dateArray', e.date)
    this.set('value', e.val)
  }

  clearfun () {
    this.set('dateArray', [])
    this.set('value', null)
  }

  before () {
  }

  succeed () {
  }

  _timestampChanged (timestamp) {
    const convertDate = this.timestamp ? FormatBehavior.formatDate(this.timestamp, this.format) : ''
    if (this._jedate && this.timestamp != null && this.timestamp !== undefined) {
      this._jedate.setValue(convertDate)
      // 手动清空输入框的值，否则的话无法清除
      if (this.timestamp === '') {
        this._jedate.valCell.value = ''
      }
      this.set('dateArray', [])
    }
    this.set('value', convertDate)
  }

  _idChanged (id) {
    const convertDate = this.timestamp ? FormatBehavior.formatDate(this.timestamp, this.format) : (this.value ? this.value : null)
    if (!this.readonly) {
      const self = this
      const enLang = {
        name: 'en',
        month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        weeks: ['SUN', 'MON', 'TUR', 'WED', 'THU', 'FRI', 'SAT'],
        times: ['Hour', 'Minute', 'Second'],
        timetxt: ['Time', 'Start Time', 'End Time'],
        backtxt: 'Back',
        clear: 'Clear',
        today: 'Now',
        yes: 'Confirm',
        close: 'Close'
      }
      const options = {
        minDate: this.min, // 最小日期
        maxDate: this.max, // 最大日期
        format: this.format,
        isShow: this.isShow, // 是否显示为固定日历，为false的时候固定显示
        multiPane: this.multiPane, // 是否为双面板，为false是展示双面板
        onClose: this.onClose, // 是否为选中日期后关闭弹层，为false时选中日期后关闭弹层
        range: this.range, // 如果不为空且不为false，则会进行区域选择，例如 " 至 "，" ~ "，" To "
        trigger: this.trigger, // 是否为内部触发事件，默认为内部触发事件
        position: this.position, // 自定义日期弹层的偏移位置，长度为0，弹层自动查找位置
        valiDate: this.valiDate, // 有效日期与非有效日期，例如 ["0[4-7]$,1[1-5]$,2[58]$",true]
        isinitVal: this.isinitVal, // 是否初始化时间，默认不初始化时间
        initDate: this.initDate, // 初始化时间，加减 天 时 分
        isTime: this.isTime, // 是否开启时间选择
        isClear: this.isClear, // 是否显示清空按钮
        isToday: this.isToday, // 是否显示今天或本月按钮
        isYes: this.isYes, // 是否显示确定按钮
        festival: this.festival, // 是否显示农历节日
        fixed: this.fixed, // 是否静止定位，为true时定位在输入框，为false时居中定位
        zIndex: this.zIndex, // 弹出层的层级高度
        method: this.method, // 自定义方法
        theme: this.theme, // 自定义主题色
        shortcut: this.shortcut, // 日期选择的快捷方式
        donefun: this.donefun.bind(this), // 选中日期完成的回调
        clearfun: this.clearfun.bind(this), // 清空日期后的回调
        before: this.before, // 在界面加载之前执行
        succeed: this.succeed // 在界面加载之后执行
      }
      if (this.language === 'en') {
        options.language = enLang
      }
      this._jedate = jeDate(self.root.querySelector(`#${self.id}`), options)
      if (this.timestamp) {
        this._jedate.setValue(convertDate)
      }
    }
    this.set('value', convertDate)
  }

  validate () {
    super.validate()
    return this.required ? this.value && this.value.length > 0 : true
  }

  __isViewChanged (isView, readonly) {
    this.$.input__jedate.style.display = (this.readonly && isView) ? 'none' : 'flex'
  }

  _isView (isView, readonly) {
    return isView && readonly
  }

  ready () {
    super.ready()
    const links = [...document.getElementsByTagName('link')]
    const isJedateLink = links.some(item => item.href.includes('/utils/jedate/skin/jedate.css'))
    if (!isJedateLink) {
      const link = document.createElement('link')
      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.href = '/utils/jedate/skin/jedate.css'
      const head = document.getElementsByTagName('head')[0]
      head.appendChild(link)
    }
  }
}

window.customElements.define(IsuInputJedate.is, IsuInputJedate)
