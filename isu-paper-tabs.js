
import {html, PolymerElement} from "@polymer/polymer"
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class"
import '@polymer/paper-tabs/paper-tabs'
import '@polymer/paper-tabs/paper-tab'

class H2PaperTabs extends mixinBehaviors([],PolymerElement) {
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
       
        #rightSelectionBar {
        position: absolute;
        height: 48px;
        top:0;
        right: 0;
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
      .tab-position-left{
        position: relative;
      }
      #rightSelectionBar{
        display:none;
      }
    </style>
<!--        <paper-tabs selected="{{selected}}" attr-for-selected="[[attrForSelected]]" no-bar="[[noBar]]" -->
<!--        no-slide="[[noSlide]]" scrollable="[[scrollable]]" fit-container="[[fitContainer]]" align-bottom="[[alignBottom]]"-->
<!--        autoselect="[[autoSelect]]" autoselect-delay="[[autoSelectDelay]]" noink="[[noink]]">-->
        <div class="tab-position-left">
            <paper-tabs selected="{{selected}}" attr-for-selected="[[attrForSelected]]"  
            selected-item="{{selectedItem}}" noink align-bottom="[[alignBottom]]" no-bar="[[noBar]]">
                <template is="dom-repeat" items="[[tabList]]">
                    <paper-tab name="[[item.name]]" disabled="[[item.disabled]]" class$="[[getTabType(tabType)]]">[[item.name]]123</paper-tab>
                </template>
            </paper-tabs>
            <div id="rightSelectionBar"></div>
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
        value:'border-card',
        notify:true,
        observer:'_tabTypeChange'
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
    return 'h2-paper-tabs'
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
      this.shadowRoot.querySelector('paper-tabs').shadowRoot.querySelector('#tabsContent').setAttribute('style','display: grid;line-height: 48px;')
      this.$.rightSelectionBar.setAttribute('style','display:block')
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
      this.transform( `translateY(${ translateTop }px)scaleY(1)`,this.shadowRoot.querySelector("#rightSelectionBar"))
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
  getTabType(type){
    if(type === 'widthBar'){
      return this.noBar = false
    }
    const typeClassObj = {
      'card':'paper-tab paper-tab-card',
      'border-card':'paper-tab paper-tab-card-border-card',
      'widthBar':''
    }
    return typeClassObj[type]
  }
}

window.customElements.define(H2PaperTabs.is, H2PaperTabs);

