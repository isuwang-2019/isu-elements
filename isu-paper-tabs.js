import {html, PolymerElement} from "@polymer/polymer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/paper-tabs/paper-tabs';
import '@polymer/paper-tabs/paper-tab';
import '@polymer/paper-styles/color.js';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';


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
        --paper-tabs:{
                height: 100%;
            }
        --paper-tab-content:{
                height: 48px;
                line-height: 48px;
           }
        --paper-tabs-selection-bar:{
            border-bottom-color: var(--paper-blue-a200);
        }
        }
        :host paper-tab{
           color:#6a6969;
        }
        :host .paper-tabs-card paper-tab {
            position: relative;
            padding: 0 12px;
            overflow: hidden;
            cursor: pointer;
            color:#6a6969;
            background-color: #f5f7fa;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border:1px solid #dddddd;
            border-bottom: none;
            @apply --paper-tabs-card-paper-card
        }
        :host .paper-tabs-card {
            --layout-horizontal: {
                display: inline-flex;
            }
            @apply --paper-tabs-card
        }
        :host .iron-selected{
            color:var(--paper-blue-a200);
        }
        :host .paper-tabs-card paper-tab.iron-selected {
            color: #337ab7;
            background-color: #ffffff;
            @apply --paper-tabs-card-paper-tab-selected
        }
        :host .paper-tabs-card-border-card{
            --layout-horizontal: {
                display: inline-flex;
            }
            border: 1px solid #dddddd;
            background-color: #f5f7fa;
            @apply paper-tabs-card-border-card
        }
        :host .paper-tabs-card-border-card paper-tab{
            position: relative;
            padding: 0 12px;
            overflow: hidden;
            cursor: pointer;
            background-color: #f5f7fa;
            @apply paper-tabs-card-border-card-paper-tab
        }
        :host .paper-tabs-card-border-card paper-tab:first-child.iron-selected{
            border-left: none;
        }
        :host .paper-tabs-card-border-card paper-tab:last-child.iron-selected{
            border-right: none;
        }
        :host .paper-tabs-card-border-card paper-tab.iron-selected {
            color: #337ab7;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            background-color: #ffffff;
            @apply --paper-tabs-card-border-card-selected
        }
        :host paper-tab[disabled]{
               opacity: 0.5;
        }
       
        :host #positionSelectionBar {
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

        @apply --paper-tabs-position-selection-bar;
      }
      :host .tab-position-left-right{
        position: relative;
        display: inline-block;
        --layout-horizontal: {
                display: inline-grid;
            }
      }
      :host .tab-position-left {
        border-right: 2px solid #cccccc;
      }
      :host .tab-position-left #positionSelectionBar{
        display:block;
        right: -2px;
      }
      :host .tab-position-right {
        border-left: 2px solid #cccccc;
        right: calc(-100% + 120px);
      }
      :host([tab-position=right]) .tab-position-right #positionSelectionBar{
        display:block;
        left: -2px;
      }
      :host .paper-tab-iron-icon{
        @apply --paper-tab-iron-icon
      }
    </style>
        <div class$="[[getTabPositionClass(tabPosition)]] [[getTabTypeClass(tabType)]]">
            <paper-tabs selected="{{selected}}" attr-for-selected="[[attrForSelected]]"  
            selected-item="{{selectedItem}}" noink="[[noink]]" align-bottom="[[alignBottom]]" no-bar="[[noBar]]" no-slide="[[noSlide]]"
            scrollable="[[scrollable]]" autoselect="[[autoSelect]]" autoselect-delay="[[autoSelectDelay]]"
            hide-scroll-buttons="[[hideScrollButtons]]" disable-drag="[[disableDrag]]">
                <template is="dom-repeat" items="[[tabList]]">
                    <template is="dom-if" if="[[item.permission]]">
                        <paper-tab name="[[item.value]]" disabled="[[item.disabled]]">
                            <template is="dom-if" if="[[item.iconName]]">
                                <iron-icon icon="[[item.iconName]]" class="paper-tab-iron-icon"></iron-icon>             
                            </template>
                            [[item.name]]
                        </paper-tab>
                    </template>
                </template>
            </paper-tabs>
            <div id="positionSelectionBar"></div>
        </div>
      `
  }

  static get properties() {

    return {
      /**
       * TabList:Must-Pass,is a Array.
       * Child element
       * requirements:{name:String,value:Number||String,permission:Boolean,iconName:String, disabled:Boolean}.
       * if permission === false ,paper-tab hidden.
       * if disabled === false,paper-tab can't click.
       */
      tabList: {
        type: Array,
        value: [
          {name:'Paper-tab',value:0,permission:true,disabled:false}
        ],
        notify: true
      },
      /**
       * The selected value, if attrForSelected === 'name',the name of the selectedItem is returned,
       * otherwise the number is returned, the default value is 0
       */
      selected: {
        type: String,
        value: '0',
        notify: true,
      },
      /**
       * selectedItem
       */
      selectedItem:{
        type:Object,
        observer:'_selectedItemChange'
      },
      /**
       * Tab position, the default value is top, there are three types:top/left/right/bottom
       */
      tabPosition:{
        type:String,
        value:'top',
        notify:true,
        observer: '_tabPositionChange'
      },
      /**
       * tab type, the default value is card, there are three types:card/border-card/width-bar
       */
      tabType:{
        type:String,
        value:'card',
        notify:true,
        observer:'_tabTypeChange'
      },
      attrForSelected:{type:String, value:'', notify:true},
      /**
       * If true, ink ripple effect is disabled. When this property is changed,
       * all descendant `<paper-tab>` elements have their `noink` property
       * changed to the new value as well.
       */
      noink:{type:Boolean, value:true, notify:true},
      /**
       * If true, the bottom bar to indicate the selected tab will not be shown.
       */
      noBar:{type:Boolean, value:true, notify:true},
      /**
       * If true, the slide effect for the bottom bar is disabled.
       */
      noSlide:{type:Boolean, value:true, notify:true},
      /**
       * If true, tabs are scrollable and the tab width is based on the label
       * width.
       */
      scrollable:{type:Boolean, value:false, notify:true},
      /**
       * If true, tabs expand to fit their container. This currently only applies
       * when scrollable is true.
       */
      fitContainer:{type:Boolean, value:false, notify:true},
      /**
       * If true, the tabs are aligned to bottom (the selection bar appears at the
       * top).
       */
      alignBottom:{type:Boolean, value:false, notify:true},
      /**
       * If true, tabs are automatically selected when focused using the
       * keyboard.
       */
      autoSelect:{type:Boolean, value:false, notify:true},
      /**
       * The delay (in milliseconds) between when the user stops interacting
       * with the tabs through the keyboard and when the focused item is
       * automatically selected (if `autoselect` is true).
       */
      autoSelectDelay:{type:Number, value:0, notify:true},
      /**
       * If true, dragging on the tabs to scroll is disabled.
       */
      disableDrag: {type: Boolean, value: false},

      /**
       * If true, scroll buttons (left/right arrow) will be hidden for scrollable
       * tabs.
       */
      hideScrollButtons: {type: Boolean, value: false},
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
    if(newVal !== 'top'){
      this.set('tabType','')
    }
    if(newVal === 'bottom'){
      this.set('alignBottom',true)
      this.set('noBar',false)
    }
    if(newVal === ('left' || 'right')){
      this.set('noBar',true)
    }
  }

  _tabTypeChange(newVal){
    if(newVal === 'width-bar'){
      return this.noBar = false
    }
  }
  getTabPositionClass(type){
    const tabPositionObj = {
      left:'tab-position-left-right tab-position-left',
      right:'tab-position-left-right tab-position-right',
      top:'tab-position-top'
    }
    return typeof tabPositionObj[type] !== 'undefined'? tabPositionObj[type] :''
  }
  getTabTypeClass(type){
    const typeClassObj = {
      'card':'paper-tabs-card',
      'border-card':'paper-tabs-card-border-card',
      'width-bar':''
    }
    return typeClassObj[type]
  }
}

window.customElements.define(IsuPaperTabs.is, IsuPaperTabs);

