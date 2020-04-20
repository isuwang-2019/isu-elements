

import './behaviors/base-behavior.js';

import {html, PolymerElement} from "@polymer/polymer";
import {BaseBehavior} from "./behaviors/base-behavior";
import {TipBehavior} from "./behaviors/tip-behavior";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import '@polymer/paper-dialog';
import './behaviors/isu-elements-shared-styles.js';
import './isu-button.js';
import './isu-dialog';
import './isu-tip';
/**
 * `isu-image-upload`
 *
 * Example:
 * ```html
 * <isu-image-upload label="上河图" value="{{file}}"></isu-image-upload>
 * <isu-image-upload size-limit="1.4M" value="{{file}}"></isu-image-upload>
 * <isu-image-upload label="上河图" type="view" src="https://d1.awsstatic.com/product-marketing/Elastic%20Beanstalk/ElasticBeanstalk_Benefit_Productivity.5cd0e6aedfa2e3b2c05ed7f5faeb0fd215c9742b.png"></isu-image-upload>
 *
 * ```
 * ## Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * |Custom property | Description | Default|
 * |----------------|-------------|----------|
 * |`--isu-label` | Mixin applied to the label of image uploader | {}
 * |`--isu-image-upload-width` | The width of image uploader | 140px
 * |`--isu-image-upload-height` | The height of image uploader | 180px
 * |`--isu-image-upload-buttons` | Mixin applied to tool buttons of the uploader if type is edit | {}
 * |`--isu-image-view-button` | Mixin applied to tool buttons of the uploader if type is view | {}
 *
 *
 * @customElement
 * @polymer
 * @demo demo/isu-image-upload/index.html
 */
class IsuImageUpload extends mixinBehaviors([BaseBehavior, TipBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="isu-elements-shared-styles">
      :host {
        display: inline-block;
        font-family: var(--isu-ui-font-family), sans-serif;
        font-size: var(--isu-ui-font-size);
      }

      #main-container {
        display: flex;
        height: inherit;
      }

      #inner-container {
        display: flex;
        flex-flow: column nowrap;
        border: 1px dashed #ccc;
        font-size: inherit;
        width: var(--isu-image-upload-width, 140px);
        height: var(--isu-image-upload-height, 180px);
        background: #fafafa;
        position: relative;
        border-radius: 5px;
      }

      #img__container {
        flex: 1;
        cursor: zoom-in;
        display: flex;
      }

      .toolbar {
        display: flex;
        background: #f0f0f0;
        height: 36px;
        justify-content: space-evenly;
        align-items: center;
        padding: 0 2px;
      }

      .toolbar isu-button {
        height: 26px;
        width: 42px;
        --isu-button: {
          background-color: #5cb85c;
          @apply --isu-image-upload-buttons;
        };
      }
      
       .toolbar isu-button.isu-button-view {
        height: 26px;
        width: 72px;
        --isu-button: {
          background-color: #5cb85c;
          @apply --isu-image-view-button;
        }
      }

      #viewer-dialog {
        display: flex;
        overflow: hidden;
        width: 90%;
        height: 90%;
        padding: 0;
      }

      #viewer-img {
        cursor: zoom-out;
        display: flex;
        padding: 0;
        margin: auto;
        width: 100%;
        height: 100%;
      }

      #file-chooser {
        display: none;
      }

      #paste-panel {
        flex: 1;
        outline: 1px dashed #aeaeae;
        outline-offset: -10px;
        text-align: center;
        padding: 20px;

        display: flex;
        justify-content: center;
        align-items: center;
      }

      #paste-panel[hidden] {
        display: none;
      }

      :host([data-has-src]) #paste-panel,
      :host(:not([data-has-src])) #cancel-btn {
        display: none;
      }

      :host(:not([data-has-src])) #img__container {
        cursor: default;
      }
      :host([size=small]) #inner-container {
        width: var(--isu-image-upload-width, 100px);
        height: var(--isu-image-upload-height, 128px);
      }
       
      :host([size=large]) #inner-container {
        width: var(--isu-image-upload-width, 170px);
        height: var(--isu-image-upload-height, 218px);
      }
      
      
    </style>

    <div id="main-container">
      <template is="dom-if" if="[[ toBoolean(label) ]]">
        <div class="isu-label">[[label]]</div>
      </template>
      
      <div id="inner-container">
        <div id="img__container" on-click="openViewZoom">
          <div id="paste-panel">拖拽或者粘贴图片到这里</div>
        </div>

        <div class="toolbar">
          <template is="dom-if" if="[[__isEdit(type)]]">
            <isu-button title="点击选择文件" on-click="_triggerChooseFile">选择</isu-button>
            <isu-button id="cancel-btn" type="warning" on-click="cancelSelection">取消</isu-button>
          </template>
          <input type="file" on-change="_chooseFile" id="file-chooser" accept$="[[accept]]">
          <template is="dom-if" if="[[!__isEdit(type)]]">
            <isu-button class="isu-button-view" on-click="openViewZoom">查看大图</isu-button>
          </template>
        </div>
        <div class="mask"></div>
      </div>
    </div>
    <paper-dialog id="viewer-dialog" on-click="closeViewZoom">
      <div id="viewer-img"></div>
    </paper-dialog>
`;
  }

  static get properties() {
    return {
      /**
       * The remote uri of image.
       */
      src: {
        type: String
      },
      /**
       * The file object of the image. It will be `undefined` when image is from remote server.
       */
      value: {
        type: Object,
        notify: true
      },

      /**
       * The label of the uploader.
       */
      label: {
        type: String
      },

      /**
       * Set to true, if the select is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false
      },
      /**
       * Set to true, if the select is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false
      },

      /**
       * The max size/length of image allowed to upload.
       * Support pattern:  /^((?:\d*\.)?\d+)([GgMmKk][Bb]?$)/
       * i.e 1M, 1Mb, 2Kb
       * @type string
       */
      sizeLimit: {
        type: String
      },

      __byteSize: {
        type: Number,
        computed: '__parseSizeLimit(sizeLimit)'
      },

      /**
       * Bound to input's `accept` attribute.
       * @default 'image/gif, image/jpeg, image/png'
       */
      accept: {
        type: String,
        value: 'image/gif, image/jpeg, image/png'
      },
      /**
       * 模式：edit/view
       * */
      type: {
        type: String,
        value: 'edit'
      }
    };
  }

  static get is() {
    return "isu-image-upload";
  }

  static get observers() {
    return [
      '__srcChanged(src)'
    ]
  }

  connectedCallback() {
    super.connectedCallback();
    const ele = this.$['paste-panel'];

    const dragHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (this.readonly) return;
      if (e.type === "drop") {
        this.__readDataTransfer(e.dataTransfer);
      } else if (e.type === 'paste') {
        this.__readDataTransfer(e.clipboardData);
      }
    };

    ele.addEventListener("dragenter", dragHandler, false);
    ele.addEventListener("dragleave", dragHandler, false);
    ele.addEventListener('dragover', dragHandler, false);
    ele.addEventListener('drop', dragHandler, false);
    ele.addEventListener('paste', dragHandler, false);
  }

  __isEdit(type) {
    return type === 'edit'
  }
  __srcChanged(src) {
    const style = this.$["img__container"].style;
    const viewerStyle = this.$['viewer-img'].style;

    if (src) {
      this.setAttribute('data-has-src', '');

      style.background = `url(${src}) no-repeat center`;
      style.backgroundSize = "contain";
      viewerStyle.background = `url(${src}) no-repeat center`;
      viewerStyle.backgroundSize = "contain";

    } else {
      this.removeAttribute('data-has-src');

      style.background = "none";
      viewerStyle.background = "none";
    }
  }

  __parseSizeLimit(sizeLimit) {
    const reg = /^((?:\d*\.)?\d+)([GgMmKk][Bb]?$)/g;

    if (!reg.test(sizeLimit)) return 0;

    const bits = sizeLimit.replace(reg, (match, size, unit) => {
      switch (unit.toUpperCase()) {
        case 'GB':
        case 'G':
          return size * Math.pow(1024, 3);
        case 'MB':
        case 'M':
          return size * Math.pow(1024, 2);
        case 'KB':
        case 'K':
          return size * 1024;
      }
    });

    return bits | 0;
  }

  _triggerChooseFile() {
    const fileChooser = this.$['file-chooser'];
    fileChooser && fileChooser.click();
  }

  _chooseFile(e) {
    const file = e.target.files[0];
    file && this.__loadFileData(file);
  }

  __readDataTransfer(dataTransfer) {
    const source = [].find.call(dataTransfer.items, item => item.kind === 'file' && item.type.startsWith("image"));
    source && this.__loadFileData(source.getAsFile());
  }

  __loadFileData(blob) {
    if (this.__byteSize > 0 && blob.size > this.__byteSize) {
      this.h2Tip.error(`上传图片不能超过${this.sizeLimit}`, 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.src = e.target.result;
      this.value = blob;
    };
    reader.readAsDataURL(blob);
  }

  /**
   * Cancel selection of the image.It will clear the `src` and `value`.
   * */
  cancelSelection() {
    this.src = null;
    this.value = null;
    this.$['file-chooser'].value = '';
  }

  /**
   * Open the view zoom
   */
  openViewZoom() {
    if (this.src) {
      this.$['viewer-dialog'].open();
    }
  }

  /**
   * Close the view zoom.
   */
  closeViewZoom() {
    this.$['viewer-dialog'].close();
  }

  /**
   * Validate, true if the select is set to be required and this.value is a truth-value or else false.
   * @returns {boolean}
   */
  validate() {
    return this.required ? !!this.value : true;
  }
}

window.customElements.define(IsuImageUpload.is, IsuImageUpload);
