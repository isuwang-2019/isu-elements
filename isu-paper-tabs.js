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
            border-bottom: 1px solid #ddd;
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
       
        :host([tab-position=right]) #positionSelectionBar {
        display:block;
        left: -2px;
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

        @apply --paper-tabs-position-selection-bar-right;
      }
      :host([tab-position=left]) #positionSelectionBar {
        display:block;
        right: -2px;
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

        @apply --paper-tabs-position-selection-bar-left;
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
      :host .tab-position-right {
        border-left: 2px solid #cccccc;
        right: calc(-100% + 120px);
      }
      :host .paper-tab-iron-icon{
        @apply --paper-tab-iron-icon
      }
      :host .paper-tab-clear-icon{
        font-size: 10px;
        width: 18px;
        height: 18px;
        margin-left: 15px;
        margin-bottom: 2px;
        border-radius: 10px;
        @apply --paper-tab-clear-icon
      }
      :host .paper-tab-clear-icon:hover{
        background-color: #dddddd;
        @apply --paper-tab-clear-icon-hover
      }
    </style>
        <div class$="[[getTabPositionClass(tabPosition)]] [[getTabTypeClass(tabType)]]">
            <paper-tabs selected="{{value}}" attr-for-selected="[[__attrForSelected]]"  
            selected-item="{{selectedItem}}" noink="[[noink]]" align-bottom="[[alignBottom]]" no-bar="[[noBar]]" no-slide="[[noSlide]]"
            scrollable="[[scrollable]]" autoselect="[[autoSelect]]" autoselect-delay="[[autoSelectDelay]]"
            hide-scroll-buttons="[[hideScrollButtons]]" disable-drag="[[disableDrag]]">
                <template is="dom-repeat" items="[[tabList]]">
                    <template is="dom-if" if="[[item.permission]]">
                        <paper-tab name="[[__getForSelectedName(item, attrForSelected)]]" disabled="[[item.disabled]]">
                            <template is="dom-if" if="[[item.iconName]]">
                                <iron-icon icon="[[item.iconName]]" class="paper-tab-iron-icon"></iron-icon>             
                            </template>
                            [[item.label]]
                            <template is="dom-if" if="[[_isAppearClearIcon(isClear,tabType)]]">
                                <iron-icon icon="icons:clear" class="paper-tab-clear-icon" on-click="clearPaperTab" 
                                data-args="[[item]]"></iron-icon>
                            </template>
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
       * requirements:{label:String,value:Number||String,permission:Boolean,iconName:String, disabled:Boolean}.
       * if permission === false ,paper-tab hidden.
       * if disabled === false,paper-tab can't click.
       */
      tabList: {
        type: Array,
        value: [
          {label:'Paper-tab',value:0,permission:true,disabled:false}
        ],
        notify: true
      },
      /**
       * The selected value, if attrForSelected === 'name',the name of the selectedItem is returned,
       * otherwise the number is returned, the default value is 0
       */
      value: {
        type: String | Number,
        value: '0',
        notify: true
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
      /**
       * If you want to use an attribute value or property of an element for
       * `selected` instead of the index, set this to the name of the attribute
       * or property. Hyphenated values are converted to camel case when used to
       * look up the property of a selectable element. Camel cased values are
       * *not* converted to hyphenated values for attribute lookup. It's
       * recommended that you provide the hyphenated form of the name so that
       * selection works in both cases. (Use `attr-or-property-name` instead of
       * `attrOrPropertyName`.)
       */
      attrForSelected:{type:String, notify:true},

      __attrForSelected:{type: String, computed: '__attrForSelectedChanged(attrForSelected)'},
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
      /**
       * If true, the paper-tab will have clear icon.On click it,can clear this paper-tab.
       */
      isClear:{type:Boolean, value:false}
    }
  }

  static get is() {
    return 'isu-paper-tabs'
  }

  __attrForSelectedChanged(attrForSelected) {
    return attrForSelected ? 'name' : undefined
  }
  _selectedItemChange(newVal){
    if(newVal && ['left','right'].includes(this.tabPosition)){
      return Promise.resolve(this._computedPositionSelectionBarHeight(newVal))
    }
  }
  _computedPositionSelectionBarHeight(selectedItem){
    const tab = selectedItem.offsetTop
    const paperTabs = this.shadowRoot.querySelector('paper-tabs').offsetTop
    const translateTop = tab-paperTabs
    return this.transform( `translateY(${ translateTop }px)scaleY(1)`,this.shadowRoot.querySelector("#positionSelectionBar"))
  }

  _tabPositionChange(newVal){
    if(newVal !== 'top'){
      this.set('tabType','')
    }
    if(newVal === 'bottom'){
      this.set('alignBottom',true)
      this.set('noBar',false)
    }
    if(['left','right'].includes(newVal)){
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
  _isAppearClearIcon(isClear,tabType){
    return isClear && tabType === 'card'
  }
  clearPaperTab(e){
    const data = e.currentTarget.dataArgs
    this.set('tabList',this.tabList.filter(item => { return item.value !== data.value }))
    if(this.tabList.indexOf(item=>{item.value = this.selectedItem.value}) === -1){
      this.set('selected',this.attrForSelected?this.tabList[0].value:0)
    }
  }
  __getForSelectedName(item, attrForSelected){
    if(!item || !attrForSelected){
      return undefined
    } else {
      return item[attrForSelected]
    }
  }
}

window.customElements.define(IsuPaperTabs.is, IsuPaperTabs);

