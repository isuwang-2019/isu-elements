
import {html, PolymerElement} from "@polymer/polymer"
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class"
import '@polymer/paper-tabs/paper-tabs'
import '@polymer/paper-tabs/paper-tab'

class H2PaperTabs extends mixinBehaviors([],PolymerElement) {
  static get template() {
    return html`
      <style include="h2-elements-shared-styles">
        paper-tab {
            position: relative;
            padding: 0 12px;
            overflow: hidden;
            cursor: pointer;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            border-top: 1px solid #ddd;
            background-color: #f0f0f0;
        }
        paper-tab.iron-selected {
            color: #337ab7;
            font-weight: bold;
            background-color: #ffffff;
        }
    </style>
        <paper-tabs selected="[[selected]]" attr-for-selected="[[attrForSelected]]" no-bar="[[noBar]]" 
        no-slide="[[noSlide]]" scrollable="[[scrollable]]" fit-container="[[fitContainer]]" align-bottom="[[alignBottom]]"
        autoselect="[[autoSelect]]" autoselect-delay="[[autoSelectDelay]]" noink="[[noink]]">
            <template is="dom-repeat" items="[[tabList]]">
                <paper-tab name="[[item.name]]" disabled="[[item.disabled]]">[[item.name]]</paper-tab>
            </template>
        </paper-tabs>
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

  ready() {
    super.ready();
      this.setScrollDirection('y', this.$['tabsContainer']);
  }
}

window.customElements.define(H2PaperTabs.is, H2PaperTabs);

