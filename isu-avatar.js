import { html, PolymerElement } from '@polymer/polymer'
import '@polymer/iron-icon/iron-icon.js'
import '@polymer/iron-icons/iron-icons.js'

/**
 * `isu-avatar`
 *
 * Example:
 * ```html
 *
 * ```
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
       * icon，参照iron-icon的icon类型
       */
      icon: {
        type: String,
        value: ''
      },
      /**
       * 图片地址
       */
      src: {
        type: String,
        value: ''
      },
      /**
       * 头像大小，可以是数字字符串或者large、medium、small中的一个
       */
      size: {
        value: 'large',
        observer: 'onSizeChange'
      },
      /**
       * 头像形状，可以是circle或者square
       */
      shape: {
        type: String,
        value: 'circle',
        observer: 'onShapeChange'
      },
      /**
       * 图片适应类型，类型参照https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit
       */
      fit: {
        type: String,
        value: 'cover'
      },
      /**
       * 图片加载不成功的替代文字
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
