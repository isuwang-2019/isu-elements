import { html, PolymerElement } from '@polymer/polymer'
import './isu-input.js'

/**
 * @customElement
 * @polymer
 * @demo demo/isu-slider/index.html
 */
class IsuSlider extends PolymerElement {
  static get is () {
    return 'isu-slider'
  }

  static get template () {
    return html`
      <style>
        :host {
          --slider-height: 6px;
        }
        :host .isu-slider {
          position: relative;
        }
        :host .isu-slider::after {
          display: table;
          content: "";
        }
        :host .isu-slider::before {
          display: table;
          content: "";
        }
        :host .isu-slider-runway {
          width: 100%;
          height: var(--slider-height);
          margin: 16px 0;
          background-color: #e4e7ed;
          border-radius: 3px;
          position: relative;
          cursor: pointer;
          vertical-align: middle;
        }
        :host .isu-slider.is-vertical .isu-slider-runway {
          width: 6px;
          height: 100%;
          margin: 0 16px;
        }
        :host .isu-slider-runway.disabled {
          cursor: default;
        }
        :host .isu-slider-runway.hasInput {
          width: calc(100% - 80px);
        }
        :host .isu-slider-bar {
          height: 6px;
          background-color: #409eff;
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
          position: absolute;
        }
        :host .isu-slider.is-vertical .isu-slider-bar {
          width: 6px;
          height: auto;
          border-radius: 0 0 3px 3px;
        }
        :host .isu-slider-runway.disabled .isu-slider-bar {
          background-color: #c0c4cc;
        }
        :host .isu-slider-button-wrapper {
          height: 36px;
          width: 36px;
          position: absolute;
          z-index: 1001;
          top: -15px;
          transform: translateX(-50%);
          background-color: transparent;
          text-align: center;
          user-select: none;
          line-height: normal;
        }
        :host .isu-slider.is-vertical .isu-slider-button-wrapper {
          top: auto;
          left: -15px;
          transform: translateY(50%);
        }
        :host .isu-slider-button {
          width: 16px;
          height: 16px;
          border: 2px solid #409eff;
          background-color: #fff;
          border-radius: 50%;
          transition: .2s;
          user-select: none;
          margin: 8px auto;
        }
        :host .isu-slider-runway.disabled .isu-slider-button {
          border-color: #c0c4cc;
        }
        :host .isu-slider-button:hover {
          cursor: grab;
          transform: scale(1.2);
        }
        :host .isu-slider-runway.disabled .isu-slider-button:hover {
          cursor: not-allowed;
          transform: scale(1);
        }
        :host .isu-slider-tooltip {
          position: absolute;
          top: -100%;
          left: 0;
          z-index: 1001;
          padding: 10px;
          border-radius: 4px;
          font-size: 12px;
          background: #303133;
          color: #FFF;
          text-align: center;
          min-width: 100%;
          box-sizing: border-box;
        }
        :host .isu-slider-tooltip-arrow {
          position: absolute;
          display: inline-block;
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-top: 6px solid #303133;
          top: 100%;
          left: 50%;
          transform: translate(-50%);
        }
        :host .isu-slider-input {
          width: 120px;
          position: absolute;
          right: 0;
          top: 0;
          height: 34px;
        }
        :host .isu-slider.is-vertical .isu-slider-input {
          position: static;
          margin-top: 10px;
        }
      </style>
      <div class$="[[getIsuSliderClass(vertical)]]">
        <div id="slider" 
          class$="[[getSliderRunwayClass(disabled)]]"
          style$="[[getHasInputStyle(showInput, inputSize)]] [[getVerticalStyle(vertical, height)]]"
          on-click="onSliderClick"
          >
          <div class="isu-slider-bar" style$="[[barStyle]]"></div>
          <div 
            id="sliderButtonWrapper" 
            class="isu-slider-button-wrapper" 
            style$="[[buttonStyle]]" 
            on-mousedown="handleMouseDown"
            on-mouseenter="handleMouseEnter"
            on-mouseleave="handleMouseLeave"
            >
            <div class="isu-slider-button"></div>
            <template is="dom-if" if="[[isShowToolTip(showTooltip, dragging, hovering)]]">
              <div class="isu-slider-tooltip">
                [[value]]
                <div class="isu-slider-tooltip-arrow"></div>
              </div>
            </template>
          </div>
        </div>
        <template is="dom-if" if="[[showInput]]">
          <isu-input class="isu-slider-input" style$=[[getInputStyle(inputSize)]] type="number" min="{{min}}" max="{{max}}" value={{value}}></isu-input>
        </template>
      </div>
    `
  }

  static get properties () {
    return {
      /**
       * 最小值
       */
      min: {
        type: Number,
        value: 0
      },
      /**
       * 最大值
       */
      max: {
        type: Number,
        value: 100
      },
      /**
       * 滑动值
       */
      value: {
        type: Number,
        value: 0,
        observer: 'onValueChange'
      },
      /**
       * 是否禁用
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * 步长
       */
      step: {
        type: Number,
        value: 1
      },
      /**
       * 是否显示输入框
       */
      showInput: {
        type: Boolean,
        value: false
      },
      /**
       * 输入框大小
       */
      inputSize: {
        type: String,
        value: 'small',
        observer: 'onInputSizeChange'
      },
      /**
       * 是否显示提示框
       */
      showTooltip: {
        type: Boolean,
        value: false
      },
      /**
       * 是否垂直
       */
      vertical: {
        type: Boolean,
        value: false
      },
      /**
       * 垂直高度
       */
      height: {
        type: String
      },
      barStyle: {
        type: String,
        value: ''
      },
      buttonStyle: {
        type: String,
        value: ''
      },
      dragging: {
        type: Boolean,
        value: false
      },
      hovering: {
        type: Boolean,
        value: false
      },
      sliderSize: {
        type: Number,
        value: 0
      },
      startPosition: {
        type: Number,
        value: 0,
        readOnly: true
      },
      startX: {
        type: Number,
        value: 0,
        readOnly: true
      },
      startY: {
        type: Number,
        value: 0,
        readOnly: true
      },
      precision: {
        type: Number,
        readOnly: true
      }
    }
  }

  static get observers () {
    return [
      'computeValue(min, max)'
    ]
  }

  getIsuSliderClass (vertical) {
    return vertical ? 'isu-slider is-vertical' : 'isu-slider'
  }

  getVerticalStyle (vertical, height) {
    if (vertical) {
      return `height: ${height};`
    }
  }

  isShowToolTip (showTooltip, dragging, hovering) {
    if (!showTooltip) {
      return false
    }
    if (dragging || hovering) {
      return true
    }
  }

  handleMouseDown (e) {
    if (this.disabled) return
    e.preventDefault()
    this.onDragStart(e)
    window.addEventListener('mousemove', this.onDragging.bind(this))
    window.addEventListener('mouseup', this.onDragEnd.bind(this))
    window.addEventListener('contextmenu', this.onDragEnd.bind(this))
  }

  handleMouseEnter () {
    this.hovering = true
  }

  handleMouseLeave () {
    this.hovering = false
  }

  onDragStart (e) {
    this.dragging = true
    const { clientX, clientY } = e
    if (this.vertical) {
      this._setStartY(clientY)
    } else {
      this._setStartX(clientX)
    }
    const currentPosition = `${(this.value - this.min) / (this.max - this.min) * 100}%`
    this._setStartPosition(parseFloat(currentPosition))
  }

  onDragEnd () {
    this.dragging = false
    window.removeEventListener('mousemove', this.onDragging.bind(this))
    window.removeEventListener('mouseup', this.onDragEnd.bind(this))
    window.removeEventListener('contextmenu', this.onDragEnd.bind(this))
  }

  onDragging (e) {
    if (this.dragging) {
      if (!this.sliderSize) {
        this.setSliderSize()
      }
      const { clientX, clientY } = e
      let diff = 0
      if (this.vertical) {
        diff = (this.startY - clientY) / this.sliderSize * 100
      } else {
        diff = (clientX - this.startX) / this.sliderSize * 100
      }
      const newPosition = this.startPosition + diff
      this.setValue(newPosition)
    }
  }

  getSliderRunwayClass (disabled) {
    return disabled ? 'isu-slider-runway disabled' : 'isu-slider-runway'
  }

  getHasInputStyle (showInput, inputSize) {
    if (!showInput) return ''
    if (this.vertical) return ''
    const styleText = 'margin-right: 20px'
    const sizeMap = {
      large: 'calc(100% - 160px)',
      medium: 'calc(100% - 140px)',
      small: 'calc(100% - 100px)',
      mini: 'calc(100% - 80px)'
    }
    return `width: ${sizeMap[inputSize]}; ${styleText}`
  }

  getInputStyle (inputSize) {
    const sizeMap = {
      large: '140px',
      medium: '120px',
      small: '80px',
      mini: '60px'
    }
    return `width: ${sizeMap[inputSize]}`
  }

  computeValue (min, max) {
    this.value = this.value < min ? min : this.value > max ? max : this.value
  }

  onValueChange () {
    const position = 100 * (this.value - this.min) / (this.max - this.min)
    this.setBarAndButtonStyle(position)
  }

  setBarAndButtonStyle (position) {
    position = position < 0 ? 0 : position > 100 ? 100 : position
    position = `${position}%`
    this.barStyle = this.vertical ? `height: ${position}; bottom: 0%;` : `width: ${position}`
    this.buttonStyle = this.vertical ? `bottom: ${position}` : `left: ${position}`
  }

  onSliderClick (e) {
    if (this.disabled) return
    if (!this.sliderSize) {
      this.setSliderSize()
    }
    const { bottom, left } = this.$.slider.getBoundingClientRect()
    if (this.vertical) {
      this.setValue((bottom - e.clientY) / this.sliderSize * 100)
    } else {
      this.setValue((e.clientX - left) / this.sliderSize * 100)
    }
  }

  setValue (newPosition) {
    if (newPosition === null || isNaN(newPosition)) return
    if (newPosition < 0) {
      newPosition = 0
    } else if (newPosition > 100) {
      newPosition = 100
    }
    if (!this.precision) {
      this.setPrecision()
    }
    const lengthPerStep = 100 / ((this.max - this.min) / this.step)
    const steps = Math.round(newPosition / lengthPerStep)
    let value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min
    value = parseFloat(value.toFixed(this.precision))
    this.value = value
  }

  setSliderSize () {
    this.sliderSize = this.vertical ? this.$.slider.clientHeight : this.$.slider.clientWidth
  }

  setPrecision () {
    const value = [this.min, this.max, this.step].map(item => {
      const decimal = ('' + item).split('.')[1]
      return decimal ? decimal.length : 0
    })
    this._setPrecision(Math.max.apply(null, value))
  }

  onInputSizeChange (size) {
    const sizeArray = ['large', 'medium', 'small', 'mini']
    if (sizeArray.indexOf(size) === -1) {
      throw new Error('The "inputSize" value must be one of large, medium, small, and mini.')
    }
  }
}

window.customElements.define(IsuSlider.is, IsuSlider)
