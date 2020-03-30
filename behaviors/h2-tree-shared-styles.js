import '@polymer/polymer/polymer-legacy';
import {html} from "@polymer/polymer";

const template = html`
  <dom-module id="h2-tree-shared-styles">
  <template>
    <style>
      :host {
        --h2-ui-bg: linear-gradient(315deg, var(--h2-ui-color_lightblue)  0%, var(--h2-ui-color_skyblue) 100%);
        --h2-ui-red: linear-gradient(315deg, #f9a7c3 0%, var(--h2-ui-color_pink) 100%);
        --h2-ui-green: linear-gradient(315deg, #70dab3 0%, #199e30 100%);
        --h2-ui-orange: linear-gradient(315deg, #f9daac  0%, #fdb03d 100%);
        --h2-ui-border-radius: 4px;
        --h2-ui-color_yellow: #fdb03d;
        --h2-ui-color_pink: #e91d62;
        --h2-ui-color_white: white;
        --h2-ui-color_skyblue: #2196F3;
        --h2-ui-color_lightblue: #8FCDFF;
        --h2-ui-font-family: 'Microsoft YaHei';
        --h2-ui-font-size: 14px;
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
        padding-left: 18px;
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

