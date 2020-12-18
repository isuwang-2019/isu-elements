import '@polymer/polymer/polymer-legacy'
import { html } from '@polymer/polymer'

const template = html`
  <dom-module id="isu-elements-shared-styles">
  <template>
    <style>
      :host {
        --isu-ui-bg: linear-gradient(315deg, var(--isu-ui-color_lightblue)  0%, var(--isu-ui-color_skyblue) 100%);
        --isu-ui-red: linear-gradient(315deg, #f9a7c3 0%, var(--isu-ui-color_pink) 100%);
        --isu-ui-green: linear-gradient(315deg, #70dab3 0%, #199e30 100%);
        --isu-ui-orange: linear-gradient(315deg, #f9daac  0%, #fdb03d 100%);
        --isu-ui-border-radius: 4px;
        --isu-ui-color_yellow: #fdb03d;
        --isu-ui-color_pink: #e91d62;
        --isu-ui-color_white: white;
        --isu-ui-color_skyblue: #2196F3;
        --isu-ui-color_lightblue: #8FCDFF;
        --isu-ui-font-family: 'Microsoft YaHei';
        --isu-ui-font-size: 14px;
      }
      
      :host([hidden]) {
        display: none;
      }
      
      :host([readonly]) .mask,
      :host([disabled]) .mask {
        position: absolute;
        top: -1px;
        bottom: -1px;
        right: -1px;
        left: -1px;
        background-color: rgba(255, 255, 255, 0.3);
        z-index: 10;
      }

      :host([data-invalid]) .prompt-tip__container[data-prompt]:not([data-prompt=""]) {
        transform: translateX(5px);
        display: flex;
        opacity: 1;
      }

      .prompt-tip__container {
        -webkit-transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, -webkit-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
        -moz-transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, -moz-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
        -ms-transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, -ms-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
        -o-transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, -o-transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
        transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
        display: none;
        align-items: center;

        position: absolute;
        left: 100%;
        margin-left: 16px;
        /*height: 100%;*/

        opacity: 0;
        z-index: 9;

        pointer-events: none;
      }
      
      :host([prompt-position=bottom]) .prompt-tip__container {
        position: absolute;
        top: 110%;
        pointer-events: none;
        display: block;
        left: 0;
        margin-left: 0;
      }
      
      :host([prompt-position=top]) .prompt-tip__container {
        position: absolute;
        bottom: 108%;
        pointer-events: none;
        display: block;
        left: 0;
        margin-left: 0;
      }

      .prompt-tip {
        flex: 1;
        padding: 0 6px;
        background: var(--isu-prompt-tip-background-color, #aeaeae);
        color: var(--isu-prompt-tip-color, white);
        border-radius: 4px;
        font-size: 12px;
        line-height: 0px;
        position: relative;
        white-space: nowrap;
      }

      :host .prompt-tip {
        background: var(--isu-ui-color_lightblue);
      }
      
      :host .prompt-tip::before {
        position: absolute;
        content: '';
        border: 11px solid transparent;
        border-right: 14px solid;
        border-right-color: var(--isu-ui-color_lightblue);
        left: -18px;
      }
      
      :host .prompt-tip-icon {
        width: 20px;
      }
      
      .isu-label::after{
        content: ' :';
        position: absolute;
        right: -5px;
        @apply --isu-label--after;
      }
      .isu-label {
        position: relative;
        margin-right: 13px;
        white-space: nowrap;
        text-align: right;
        width: var(--isu-label-width, 120px);
        @apply --isu-label;
      }
      .ellipsis {
          white-space: nowrap;
          overflow: hidden;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
      }
      /*字体大小*/
      :host .x-small {
        font-size: 10px
      }
      :host .small {
        font-size: 12px
      }
      :host .medium {
        font-size: 14px
      }
      :host .large {
        font-size: 16px
      }
      :host .larger {
        font-size: 18px
      }
    </style>
  </template>
  </dom-module>
`
template.setAttribute('style', 'display: none;')
document.head.appendChild(template.content)
