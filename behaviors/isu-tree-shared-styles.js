import '@polymer/polymer/polymer-legacy';
import {html} from "@polymer/polymer";

const template = html`
  <dom-module id="isu-tree-shared-styles">
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
      
      .dht-tree-main {
        position: relative;
      }
      
      .dht-tree-twig-one {
        position: relative;
        overflow: hidden;
      }
      .dht-tree-twig-one .dht-tree-node-content {
        display: flex;
        flex-flow: row;
        align-items: center;
        height: 25px;
        overflow: hidden;
      }
      .dht-tree-twig-one .dht-tree-node-content:hover,
      .dht-tree-twig-one .dht-tree-node-content:active {
        background: rgba(15, 128, 255, 0.1);
      }
      .dht-tree-twig-one .dht-tree-node-content .arrow {
        font-size: 12px;
        margin-right: 5px;
        transition: transform 0.5s ease;
      }
      .dht-tree-twig-one .dht-tree-node-content .icon {
        margin-right: 5px;
      }
      .dht-tree-twig-one  .dht-tree-node-enter-active, .dht-tree-node-leave-active {
        transition: opacity .5s;
      }
      .dht-tree-twig-one .dht-tree-node-enter, .dht-tree-node-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
      }
    </style>
  </template>
  </dom-module>
`;
template.setAttribute("style", 'display: none;');
document.head.appendChild(template.content);

