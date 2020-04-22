import { html, PolymerElement } from '@polymer/polymer'
import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-icons/iron-icons.js'

/**
 
 Example:
 ```html
  <isu-avatar size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></isu-avatar>
  <isu-avatar size="large" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></isu-avatar>
  <isu-avatar size="medium" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></isu-avatar>
  <isu-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></isu-avatar>
  <isu-avatar shape="square" size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></isu-avatar>
  <isu-avatar shape="square" size="large" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></isu-avatar>
  <isu-avatar shape="square" size="medium" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></isu-avatar>
  <isu-avatar shape="square" size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></isu-avatar>
  <isu-avatar icon="search"></isu-avatar>
  <isu-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></isu-avatar>
  <isu-avatar>user</isu-avatar>
  <isu-avatar shape="square" size="100" fit="fit" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></isu-avatar>
  <isu-avatar shape="square" size="100" fit="contain" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></isu-avatar>
  <isu-avatar shape="square" size="100" fit="cover" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></isu-avatar>
  <isu-avatar shape="square" size="100" fit="none" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></isu-avatar>
  <isu-avatar shape="square" size="100" fit="scale-down" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></isu-avatar>
 ```
 * @customElement
 * @polymer
 * @demo demo/isu-avatar/index.html
 */
class IsuAvatar extends PolymerElement {
  static get is () {
    return 'isu-avatar'
  }

  static get template () {
    return html`
      <style>
        :host .isu-avatar {
          display: inline-block;
          box-sizing: border-box;
          text-align: center;
          overflow: hidden;
          color: #fff;
          background: #C0C4CC;
          width: 40px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
        }
        :host .isu-avatar img {
          display: inline-block;
          height: 100%;
          vertical-align: middle;
        }
        :host .isu-avatar-circle {
          border-radius: 50%;
        }
        :host .isu-avatar-square {
          border-radius: 4px;
        }
        :host .isu-avatar-large {
          width: 40px;
          height: 40px;
          line-height: 40px;
        }
        :host .isu-avatar-medium {
          width: 36px;
          height: 36px;
          line-height: 36px;
        }
        :host .isu-avatar-small {
          width: 28px;
          height: 28px;
          line-height: 28px;
        }
      </style>
      <span class$="[[getAvatarClass(size, shape)]]" style$="[[getAvatarStyle(size)]]">
        <template is="dom-if" if="[[showSrc(src)]]">
          <img src="[[src]]" alt="[[alt]]" style$="[[getImgStyle(fit)]]" />
        </template>
        <template is="dom-if" if="[[showIcon(icon)]]">
          <iron-icon style$="[[setIronIconStyle(size)]]" icon="[[icon]]"></iron-icon>
        </template>
        <template is="dom-if" if="[[showSlot(src, icon)]]">
          <slot></slot>
        </template>
      </span>
    `
  }

  static get properties () {
    return {
      /**
       * Icon type, refer to the icon type of iron-icon
       * @type {string}
       */
      icon: {
        type: String,
        value: ''
      },
      /**
       * Icon source
       * @type {string}
       */
      src: {
        type: String,
        value: ''
      },
      /**
       * Avatar size, the value can be a numeric string or one of large, medium, small
       * @type {string}
       * @default large
       */
      size: {
        value: 'large',
        observer: 'onSizeChange'
      },
      /**
       * Avatar shape, the value can be one of circle or square
       * @type {string}
       * @default circle
       */
      shape: {
        type: String,
        value: 'circle',
        observer: 'onShapeChange'
      },
      /**
       * Image adaptation type, type refer to https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit
       * @type {string}
       * @default cover
       */
      fit: {
        type: String,
        value: 'cover'
      },
      /**
       * Alt text for unsuccessful image loading
       * @type {string}
       */
      alt: {
        type: String
      }
    }
  }

  setIronIconStyle (size) {
    const sizeMap = {
      small: '--iron-icon-height: 28px; --iron-icon-width: 28px;',
      medium: '--iron-icon-height: 36px; --iron-icon-width: 36px;',
      large: '--iron-icon-height: 40px; --iron-icon-width: 40px;'
    }
    return sizeMap[size] || `--iron-icon-height: ${size}px; --iron-icon-width: ${size}px;`
  }

  getImgStyle (fit) {
    return `object-fit: ${fit}`
  }

  showSlot (src, icon) {
    return src === '' && icon === ''
  }

  showIcon (icon) {
    return icon !== '' && this.src === ''
  }

  showSrc (src) {
    return src !== ''
  }

  getAvatarStyle (size) {
    if (!isNaN(+size)) {
      return `width: ${size}px; height: ${size}px; line-height: ${size}px;`
    }
  }

  getAvatarClass (size, shape) {
    const sizeClass = size && isNaN(+size) ? `isu-avatar-${size}` : ''
    const shapeClass = shape ? `isu-avatar-${shape}` : ''
    const avatarClass = `isu-avatar ${sizeClass} ${shapeClass}`
    return avatarClass
  }

  onSizeChange (size) {
    const sizeArray = ['large', 'medium', 'small']
    if (isNaN(+size) && sizeArray.indexOf(size) === -1) {
      throw new Error('The size value must be one of large, medium, small or a numeric string.')
    }
  }

  onShapeChange (shape) {
    const shapeArray = ['circle', 'square']
    if (shapeArray.indexOf(shape) === -1) {
      throw new Error('The shape value must be one of circle and square.')
    }
  }
}

window.customElements.define(IsuAvatar.is, IsuAvatar)
