import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import { html, PolymerElement } from '@polymer/polymer'
import { IronOverlayBehavior } from '@polymer/iron-overlay-behavior'

import './behaviors/isu-elements-shared-styles.js'

/**
 * `isu-loading`
 *
 * Example:
 * ```html
 * <isu-loading opened></isu-loading>
 * <isu-loading text="加载中..."></isu-loading>
 * <isu-loading id="loading4" text="加载中..." background="rgba(0, 0, 0, 0.8)" target="#table" style="display: none"></isu-loading>
 * <div id="table" style="width: 400px; height: 600px; border: 1px solid red;"></div>
 *
 * ```
 *
 * @customElement
 * @polymer
 * @demo demo/isu-loading/index.html
 */
class IsuLoading extends mixinBehaviors([IronOverlayBehavior], PolymerElement) {
  static get template () {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        position: fixed;
        top: 0;
        left: 0;
        background: white;
        opacity: 0.7;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        position: absolute;
      }

      .loading-container {
        width: 80px;
        height: 80px;
        margin: auto;
        border-radius: 6px;
        display: flex;
        position: relative;
      }
      
      svg {
        margin: auto;
      }
      svg path,
      svg rect{
        fill: var(--isu-ui-color_skyblue);
      }
      
      .span-text {
        position: absolute;
        bottom: 0px;
        text-align: center;
        display: inline-block;
        width: 100%;
        font-size: 12px;
        font-family: 微软雅黑;
        letter-spacing: 1px;
        color: #61B3F4;
      }
      
    </style>
    <div class="loading-container">
      <svg version="1.1" id="loader-1" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;">
        <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.6s"
            repeatCount="indefinite"/>
        </path>
      </svg>
      <template is="dom-if" if="[[text]]">
        <span class="span-text">[[text]]</span>
      </template>
    </div>
 `
  }

  static get properties () {
    return {
      /**
       * 遮罩背景色
       * */
      background: {
        type: String,
        value: 'rgba(0, 0, 0, 0.6)'
      },
      /**
       * 加载文案
       * */
      text: {
        type: String,
        notify: true
      },
      /**
       * 需要显示loading的节点名称
       * */
      target: {
        type: String,
        notify: true
      }
    }
  }

  static get is () {
    return 'isu-loading'
  }

  static get observers () {
    return ['_backgroundChanged(background)', '_targetChanged(target)']
  }

  _backgroundChanged (background) {
    if (background && document.querySelector('isu-loading')) document.querySelector('isu-loading').style.backgroundColor = background
  }

  _targetChanged (target) {
    const loading = document.createElement('isu-loading')
    if (this.background) loading.style.backgroundColor = this.background
    loading.text = this.text
    document.querySelector(target).appendChild(loading)
    if (this.opened) {
      document.querySelector(target).lastChild.style.display = ''
      this.set('opened', false)
    }
  }
}

window.customElements.define(IsuLoading.is, IsuLoading)
