import '@polymer/polymer/polymer-legacy'
import { html } from '@polymer/polymer'
import './isu-elements-shared-styles'

const template = html`
  <dom-module id="isu-tree-shared-styles">
  <template>
    <style include="base-style">
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
        text-decoration: underline;
        /*background: rgba(15, 128, 255, 0.1);*/
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
`
template.setAttribute('style', 'display: none;')
document.head.appendChild(template.content)
