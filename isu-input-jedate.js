/**
 `isu-input-date`

 Example:
 ```html
 <isu-input-date class="input-date" label="日期"></isu-input-date>
 <isu-input-date class="input-date" label="默认value" value="2017-10-26"></isu-input-date>
 <isu-input-date class="input-date" label="默认time" timestamp="1509008130349"></isu-input-date>

 ```
 ## Styling

 The following custom properties and mixins are available for styling:

 |Custom property | Description | Default|
 |----------------|-------------|----------|
 |`--isu-input-date-label` | Mixin applied to the label of input | {}


 */
import {html, PolymerElement} from "@polymer/polymer";
import '@polymer/paper-dialog';
import './behaviors/isu-elements-shared-styles.js';
import './isu-grid-layout';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {BaseBehavior} from "./behaviors/base-behavior";
import '@polymer/iron-icon';
import '@polymer/iron-icons';
import './isu-select';
import './utils/jedate/js/jedate'
import {FormatBehavior} from "./behaviors/format-behavior";

/**
 * @customElement
 * @polymer
 * @demo demo/isu-input-date/index.html
 */
class H2InputDate extends mixinBehaviors([BaseBehavior, FormatBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: flex;
        width: 300px;
        height: 34px;
        line-height: 34px;
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
        height: 30px;
        float:left;
        line-height: 30px;
        border: 1px solid #e6e6e6;
        background-color: #fff;
        border-radius: 3px;
        background-color: #fcfcfc;
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
        left: -10px;
        line-height: inherit;
      }
      /*:host([required]) .input__container {*/
        /*border: 1px solid red;*/
      /*}*/
      :host([readonly]) .jeinput {
        cursor: default;
      }
    </style>
    <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class="isu-label">[[label]]</div>
      </template>
    <div class="input__container">
       <div class="jeinpbox"><input type="text" id$="[[id]]" class="jeinput" readonly$="[[readonly]]" placeholder$="[[placeholder]]" value$="{{value}}"></div>
      <div class="prompt-tip__container" data-prompt$="[[prompt]]">
          <div class="prompt-tip">
            <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
            [[prompt]]
          </div>
      </div>
    </div>
  `;
  }

  static get properties() {
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
      bindData: {
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
        value: false
      },
      /**
       * Set to true, if the input is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false
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
       * 日期格式
       * */
      format: {
        type: String,
        value: 'YYYY-MM-DD'
      },
      /**
       * 是否为双面板，为false是展示双面板
       * */
      multiPane: {
        type: Boolean,
        value: true
      },
      /**
       * 是否显示为固定日历，为false的时候固定显示
       * */
      isShow: {
        type: Boolean,
        value: true
      },
      /**
       * 是否为选中日期后关闭弹层，为false时选中日期后关闭弹层
       * */
      onClose: {
        type: Boolean,
        value: true
      },
      /**
       * 如果不为空且不为false，则会进行区域选择，例如 " 至 "，" ~ "，" To "
       * */
      range: {
        type: String,
        value: false
      },
      /**
       * 是否为内部触发事件，默认为内部触发事件
       * */
      trigger: {
        type: String,
        value: 'click'
      },
      /**
       * 自定义日期弹层的偏移位置，长度为0，弹层自动查找位置
       * */
      position: {
        type: Array,
        value: []
      },
      /**
       * 是否初始化时间，默认不初始化时间
       * */
      isinitVal: {
        type: Boolean,
        value: false
      },
      /**
       * 初始化时间，加减 天 时 分
       * */
      initDate: {
        type: Object,
        value: {}
      },
      /**
       * 是否开启时间选择
       * */
      isTime: {
        type: Boolean,
        value: true
      },
      /**
       * 是否显示清空按钮
       * */
      isClear: {
        type: Boolean,
        value: true
      },
      /**
       * 是否显示今天或本月按钮
       * */
      isToday: {
        type: Boolean,
        value: true
      },
      /**
       * 是否显示确定按钮
       * */
      isYes: {
        type: Boolean,
        value: true
      },
      /**
       * 是否显示农历节日
       * */
      festival: {
        type: Boolean,
        value: false
      },
      /**
       * 有效日期与非有效日期，例如 ["0[4-7]$,1[1-5]$,2[58]$",true]
       * */
      valiDate: {
        type: Array,
        value: []
      },
      /**
       * 是否静止定位，为true时定位在输入框，为false时居中定位
       * */
      fixed: {
        type: Boolean,
        value: true
      },
      /**
       * 自定义主题色
       * */
      theme: {
        type: Object,
        value: {}
      },
      /**
       * 语言，'en'/'cn'
       * */
      language: {
        type: String,
        value: 'cn'
      },
      /**
       * 自定义方法
       * */
      method: {
        type: Object,
        value: {}
      },
      /**
       * 在界面加载之前执行
       * */
      before: {
        type: Object,
        value: null
      },
      /**
       * 在界面加载之后执行
       * */
      succeed: {
        type: Object,
        value: null
      },
      /**
       * 弹出层的层级高度
       * */
      zIndex: {
        type: Number,
        value: 2099
      },
      /**
       * 日期选择的快捷方式
       * */
      shortcut: {
        type: Array,
        value: []
      },
      /**
       * 选中的值的集合，如果有范围时集合里有两个值，没有范围则只有一个值，都是时间戳
       * */
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
      prompt: {
        type: String
      }

    };
  }

  static get observers() {
    return [
      '_idChanged(id)',
      '_valueChanged(value)',
      'getInvalidAttribute(required, value)'
    ]
  }

  static get is() {
    return "isu-input-jedate";
  }

  _valueChanged(value) {
    if (this.format.indexOf('YYYY') !== -1) {
      const dateArray = this.dateArray.map(item => {
        let date = `${item.YYYY}-${item.MM}`
        date += this.format.indexOf('DD') !== -1 ? `-${item.DD}` : ''
        date += this.format.indexOf('hh') !== -1 ? ` ${item.hh}` : ''
        date += this.format.indexOf('mm') !== -1 ? `:${item.mm}` : ''
        date += this.format.indexOf('ss') !== -1 ? `:${item.ss}` : ''
        return +new Date(date)
      })
      this.set('bindData', dateArray[0])
      this.set('selectedItems', dateArray)
    }
  }

  donefun(e) {
    this.set('dateArray', e.date)
    this.set('value', e.val)
  }

  clearfun() {
    this.set('dateArray', [])
    this.set('value',null)
  }

  before() {
  }

  succeed() {
  }

  _idChanged(id) {
    const convertDate = this.bindData ? FormatBehavior.formatDate(this.bindData, this.format) : null
    if (!this.readonly) {
      const self = this
      const enLang = {
        name: "en",
        month: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        weeks: ["SUN", "MON", "TUR", "WED", "THU", "FRI", "SAT"],
        times: ["Hour", "Minute", "Second"],
        timetxt: ["Time", "Start Time", "End Time"],
        backtxt: "Back",
        clear: "Clear",
        today: "Now",
        yes: "Confirm",
        close: "Close"
      }
      const options = {
        festival: this.festival,
        minDate: this.min,              //最小日期
        maxDate: this.max,              //最大日期
        format: this.format,
        isShow: this.isShow,                //是否显示为固定日历，为false的时候固定显示
        multiPane: this.multiPane,             //是否为双面板，为false是展示双面板
        onClose: this.onClose,               //是否为选中日期后关闭弹层，为false时选中日期后关闭弹层
        range: this.range,                //如果不为空且不为false，则会进行区域选择，例如 " 至 "，" ~ "，" To "
        trigger: this.trigger,            //是否为内部触发事件，默认为内部触发事件
        position: this.position,                //自定义日期弹层的偏移位置，长度为0，弹层自动查找位置
        valiDate: this.valiDate,                //有效日期与非有效日期，例如 ["0[4-7]$,1[1-5]$,2[58]$",true]
        isinitVal: this.isinitVal,            //是否初始化时间，默认不初始化时间
        initDate: this.initDate,                //初始化时间，加减 天 时 分
        isTime: this.isTime,                //是否开启时间选择
        isClear: this.isClear,               //是否显示清空按钮
        isToday: this.isToday,               //是否显示今天或本月按钮
        isYes: this.isYes,                 //是否显示确定按钮
        festival: this.festival,             //是否显示农历节日
        fixed: this.fixed,                 //是否静止定位，为true时定位在输入框，为false时居中定位
        zIndex: this.zIndex,                //弹出层的层级高度
        method: this.method,                 //自定义方法
        theme: this.theme,                   //自定义主题色
        shortcut: this.shortcut,                //日期选择的快捷方式
        donefun: this.donefun.bind(this),                //选中日期完成的回调
        clearfun: this.clearfun.bind(this),     // 清空日期后的回调
        before: this.before,                //在界面加载之前执行
        succeed: this.succeed                //在界面加载之后执行
      }
      if (this.language === 'en') {
        options.language = enLang
      }
      const jeDateObj = jeDate(self.root.querySelector(`#${self.id}`), options)
      this.bindData ? jeDate(self.root.querySelector(`#${self.id}`), options).setValue(convertDate) : jeDate(self.root.querySelector(`#${self.id}`), options)
    }
    this.set('value', convertDate)
  }

  validate() {
    super.validate()
    return this.required ? this.value && this.value.length > 0 : true
  }
}

window.customElements.define(H2InputDate.is, H2InputDate);
