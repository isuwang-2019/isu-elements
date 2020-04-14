import {html, PolymerElement} from "@polymer/polymer"
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class"
import '@polymer/paper-tabs/paper-tabs'
import '@polymer/paper-tabs/paper-tab'

/**
 * `isu-paper-tabs`
 *
 * Example:
 * ```html
 * ```
 * @customElement
 * @polymer
 * @demo demo/isu-paper-tabs/index.html
 */
class IsuPaperTabs extends mixinBehaviors([],PolymerElement) {
  static get template() {
    return html`
      <style include="h2-elements-shared-styles">
        :host {
        --layout-horizontal: {
                display: inline-flex;
            }
            --paper-tabs:{
                height: 100%;
            }
            --layout-inline_-_display:inline-flex;
            --paper-tab-content:{
                height: 48px;
                line-height: 48px;
           }
        }
        .paper-tab {
            position: relative;
            padding: 0 12px;
            overflow: hidden;
            cursor: pointer;
            color:#6a6969;
            border-top: 1px solid #ddd;
            background-color: #f5f7fa;
            @apply --paper-tab
        }
        .paper-tab-card {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }
        .paper-tab-card.iron-selected {
            color: #337ab7;
            font-weight: bold;
            /*border-right: 2px solid green;*/
            background-color: #ffffff;
        }
        .paper-tab-card-border-card.iron-selected {
            color: #337ab7;
            font-weight: bold;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            /*border-right: 2px solid green;*/
            background-color: #ffffff;
        }
        paper-tab[disabled]{
               opacity: 0.5;
        }
       
        #positionSelectionBar {
        display:none;
        position: absolute;
        height: 48px;
        top:0;
        border-right: 2px solid #337ab7;
          -webkit-transform: scale(0);
        transform: scale(0);
          -webkit-transform-origin: center top;
        transform-origin: center top;
          transition: -webkit-transform;
        transition: transform;
        transition-duration:1000ms;

        @apply --paper-tabs-selection-bar;
      }
      .tab-position-left-right{
        position: relative;
        display: inline-block;
        --layout-horizontal: {
                display: inline-grid;
            }
      }
      .tab-position-left {
        border-right: 2px solid #cccccc;
      }
      .tab-position-left #positionSelectionBar{
        display:block;
        right: -2px;
      }
      .tab-position-right {
        border-left: 2px solid #cccccc;
        right: calc(-100% + 120px);
      }
      .tab-position-right #positionSelectionBar{
        display:block;
        left: -2px;
      }
      
    </style>
<!--        <paper-tabs selected="{{selected}}" attr-for-selected="[[attrForSelected]]" no-bar="[[noBar]]" -->
<!--        no-slide="[[noSlide]]" scrollable="[[scrollable]]" fit-container="[[fitContainer]]" align-bottom="[[alignBottom]]"-->
<!--        autoselect="[[autoSelect]]" autoselect-delay="[[autoSelectDelay]]" noink="[[noink]]">-->
        <div class$="[[getTabPositionClass(tabPosition)]]">
            <paper-tabs selected="{{selected}}" attr-for-selected="[[attrForSelected]]"  
            selected-item="{{selectedItem}}" noink align-bottom="[[alignBottom]]" no-bar="[[noBar]]">
                <template is="dom-repeat" items="[[tabList]]">
                    <paper-tab name="[[item.name]]" disabled="[[item.disabled]]" class$="[[getTabType(tabType)]]">[[item.name]]123</paper-tab>
                </template>
            </paper-tabs>
            <div id="positionSelectionBar" ></div>
        </div>
      `
  }

  static get properties() {

    return {
      tabList: {
        type: Array,
        value: [],
        notify: true
      },
      selected: {
        type: String,
        value: '0',
        notify: true,
      },
      selectedItem:{
        type:Object,
        observer:'_selectedItemChange'
      },
      tabPosition:{ //设置标签位置 值：top/left/right/bottom
        type:String,
        value:'left',
        notify:true,
        observer: '_tabPositionChange'
      },
      tabType:{  //tab类型  值 card/border-card/widthBar
        type:String,
        value:'widthBar',
        notify:true,
        // observer:'_tabTypeChange'
      },
      attrForSelected:{
        type:String,
        value:'',
        notify:true
      },
      noink:{
        type:Boolean,
        value:true,
        notify:true
      },
      noBar:{
        type:Boolean,
        value:true,
        notify:true
      },
      noSlide:{
        type:Boolean,
        value:true,
        notify:true
      },
      scrollable:{
        type:Boolean,
        value:false,
        notify:true
      },
      fitContainer:{
        type:Boolean,
        value:false,
        notify:true
      },
      alignBottom:{
        type:Boolean,
        value:false,
        notify:true
      },
      autoSelect:{
        type:Boolean,
        value:false,
        notify:true
      },
      autoSelectDelay:{
        type:Number,
        value:0,
        notify:true
      }
    }
  }

  static get is() {
    return 'isu-paper-tabs'
  }

  connectedCallback(){
    super.connectedCallback()
  }

  created() {
    super.created();
  }
  attached(){
    super.attached()
    if(this.tabPosition === ('left' || 'right')){

    }
  }
  ready() {
    super.ready();
  }
  _selectedItemChange(newVal){
    if(newVal){
      const tab = newVal.offsetTop
      const paperTabs = this.shadowRoot.querySelector('paper-tabs').offsetTop
      const translateTop = tab-paperTabs
      this.transform( `translateY(${ translateTop }px)scaleY(1)`,this.shadowRoot.querySelector("#positionSelectionBar"))
    }
  }

  _tabPositionChange(newVal){
    if(newVal === 'bottom'){
      this.set('alignBottom',true)
    }
    if(newVal === ('left' || 'right')){
      this.set('noBar',true)
    }
  }
  getTabPositionClass(type){
    const tabPositionObj = {
      left:'tab-position-left-right tab-position-left',
      right:'tab-position-left-right tab-position-right'
    }
    return typeof tabPositionObj[type] !== 'undefined'? tabPositionObj[type] :''
  }
  getTabType(type){
    if(type === 'widthBar'){
      return this.noBar = false
    }
    const typeClassObj = {
      'card':'paper-tab paper-tab-card',
      'border-card':'paper-tab paper-tab-card-border-card',
      'widthBar':'',
      'otherBar':''
    }
    return typeClassObj[type]
  }
}

window.customElements.define(IsuPaperTabs.is, IsuPaperTabs);

