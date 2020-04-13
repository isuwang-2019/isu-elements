import { html, PolymerElement } from '@polymer/polymer'

/**
 `isu-progress`

 Example:
 ```html
 ```
 * @customElement
 * @polymer
 * @demo demo/isu-progress/index.html
 */
class IsuProgress extends PolymerElement {
  static get is () {
    return 'isu-progress'
  }

  static get template () {
    return html`
      <style>
        :host .isu-progress {
          position: relative;
          line-height: 1;
        }
        :host .isu-progress-bar {
          padding-right: 50px;
          width: 100%;
          margin-right: -55px;
          box-sizing: border-box;
          display: inline-block;
          vertical-align: middle;
        }
        :host .isu-progress-bar-outer {
          height: 6px;
          border-radius: 100px;
          background-color: #EBEEF5;
          overflow: hidden;
          position: relative;
          vertical-align: middle;
        }
        :host .isu-progress-bar-inner {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background-color: #409EFF;
          text-align: right;
          border-radius: 100px;
          line-height: 1;
          white-space: nowrap;
          transition: width .6s ease;
        }
        :host .isu-progress-text {
          font-size: 14px;
          color: #606266;
          display: inline-block;
          vertical-align: middle;
          margin-left: 10px;
          line-height: 1;
        }
        :host .isu-icon-status {
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          border-radius: 50%;
          margin-left: 10px;
          overflow: hidden;
        }
        :host .isu-progress-circle,
        :host .isu-progress-dashboard {
          display: inline-block;
        }
        :host .isu-progress-circle .isu-progress-text,
        :host .isu-progress-dashboard .isu-progress-text {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          text-align: center;
          margin: 0;
          transform: translate(0,-50%);
        }
        :host .isu-progress-circle .isu-icon-status,
        :host .isu-progress-dashboard .isu-icon-status {
          margin-left: 0;
        }
      </style>
      <div class$="isu-progress {{getProgressClass(type, status)}}">
        <template is="dom-if" if="[[isShowProgress(type, 'line')]]">
          <div class="isu-progress-bar">
            <div class="isu-progress-bar-outer" style$="[[getOuterBarStyle(strokeWidth)]]">
              <div class="isu-progress-bar-inner" style$="[[getInnerBarStyle(percentage)]]"></div>
            </div>
          </div>
        </template>

        <template is="dom-if" if="[[isShowProgress(type, 'other')]]">
          <div class="isu-progress-circle" style$="[[getCircleStyle(width)]]">
            <svg viewBox="0 0 100 100">
              <path
                d$="[[trackPath()]]"
                stroke="#e5e9f2"
                stroke-width$="[[relativeStrokeWidth]]"
                fill="none"
                style$="[[trailPathStyle()]]"></path>
              <path
                d$="[[trackPath()]]"
                stroke$="[[getStrokeColor(color, status)]]"
                fill="none"
                stroke-linecap$="round"
                stroke-width$="[[relativeStrokeWidth]]"
                style$="[[circlePathStyle()]]"></path>
            </svg>
          </div>
        </template>

        <template is="dom-if" if="[[showText]]">
          <div class="isu-progress-text">
            <template is="dom-if" if="[[isShowStatus(status, 'icon')]]">
              <span style$="[[getStatusIconStyle(status)]]" class="isu-icon-status">[[getStatusIconText(status)]]</span>
            </template>
            <template is="dom-if" if="[[isShowStatus(status, 'text')]]">
              <div>[[percentage]]%</div>
            </template>
          </div>
        </template>
      </div>
    `
  }

  static get properties () {
    return {
      /**
       * 进度条类型，可以是line、dashboard、circle中的一个
       */
      type: {
        type: String,
        value: 'line',
        observer: 'onTypeChange'
      },
      /**
       * 进度值
       */
      percentage: {
        type: Number,
        value: 0,
        observer: 'onPercentageChange'
      },
      /**
       * 进度条宽度
       */
      strokeWidth: {
        type: Number,
        value: 6
      },
      /**
       * 状态，可以是success/exception/warning中的一个
       */
      status: {
        type: String,
        value: '',
        observer: 'onStatusChange'
      },
      /**
       * 进度条的背景色
       */
      color: {
        type: String
      },
      /**
       * 环形进度条画布宽度
       */
      width: {
        type: Number,
        value: 126
      },
      /**
       * 是否显示进度条文字内容
       */
      showText: {
        type: Boolean,
        value: false
      },
      relativeStrokeWidth: {
        type: Number,
        computed: 'computedWidth(width, strokeWidth)'
      }
    }
  }

  getProgressClass (type, status) {
    return `isu-progress-${type} is-${status}`
  }

  getStrokeColor (color, status) {
    const colorMap = {
      success: '#13ce66',
      exception: '#ff4949',
      warning: '#e6a23c'
    }
    if (color) {
      return color
    } else {
      return colorMap[status] || '#20a0ff'
    }
  }

  getCircleParameter () {
    const radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10)
    const perimeter = 2 * Math.PI * radius
    const rate = this.type === 'dashboard' ? 0.75 : 1
    const strokeDashoffset = -1 * perimeter * (1 - rate) / 2
    return {
      perimeter,
      rate,
      strokeDashoffset: `${strokeDashoffset}px`
    }
  }

  trailPathStyle () {
    const paraObj = this.getCircleParameter()
    return `stroke-dasharray: ${(paraObj.perimeter * paraObj.rate)}px, ${paraObj.perimeter}px; stroke-dashoffset: ${paraObj.strokeDashoffset}`
  }

  circlePathStyle () {
    const paraObj = this.getCircleParameter()
    return `
      stroke-dasharray: ${paraObj.perimeter * paraObj.rate * (this.percentage / 100)}px, ${paraObj.perimeter}px;
      stroke-dashoffset: ${paraObj.strokeDashoffset};
      transition: stroke-dasharray 0.6s ease 0s, stroke 0.6s ease
    `
  }

  computedWidth (width, strokeWidth) {
    return (strokeWidth / width * 100).toFixed(1)
  }

  trackPath () {
    const radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10)
    const isDashboard = this.type === 'dashboard'
    return `
      M 50 50
      m 0 ${isDashboard ? '' : '-'}${radius}
      a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '-' : ''}${radius * 2}
      a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '' : '-'}${radius * 2}
      `
  }

  getCircleStyle (width) {
    return `width: ${width}px; height: ${width}px;`
  }

  getStatusIconStyle (status) {
    const width = this.strokeWidth < 14 ? '14' : this.strokeWidth - 6
    let style = `width: ${width}px; height: ${width}px; line-height: ${width}px; font-size: ${width}px;`
    const iconStyleMap = {
      warning: 'background-color: #e6a23c; color: #fff;',
      success: 'border: 1px solid #13ce66; color: #13ce66;',
      exception: 'border: 1px solid #ff4949; color: #ff4949;'
    }
    style += iconStyleMap[status]
    return style
  }

  getStatusIconText (status) {
    const textMap = {
      warning: '!',
      success: '✓',
      exception: 'x'
    }
    return textMap[status]
  }

  getInnerBarStyle (percentage) {
    const colorMap = {
      success: '#13ce66',
      exception: '#ff4949',
      warning: '#e6a23c'
    }
    const color = this.color ? this.color : colorMap[this.status]
    return `width: ${percentage}%; background-color: ${color}`
  }

  getOuterBarStyle (strokeWidth) {
    return `height: ${strokeWidth}px`
  }

  isShowStatus (status, showType) {
    const statusArray = ['success', 'exception', 'warning']
    return showType === 'icon' ? statusArray.indexOf(status) > -1 : statusArray.indexOf(status) === -1
  }

  isShowProgress (type, showType) {
    return type === showType || (showType === 'other' && (type === 'circle' || type === 'dashboard'))
  }

  onTypeChange (type) {
    const typeArray = ['line', 'circle', 'dashboard']
    if (typeArray.indexOf(type) === -1) {
      throw new Error('The type value must be one of line, circle, and dashboard.')
    }
  }

  onPercentageChange (percentage) {
    if (percentage < 0 || percentage > 100) {
      throw new Error('The percentage value must be between 0 and 100.')
    }
  }

  onStatusChange (status) {
    const statusArray = ['success', 'exception', 'warning']
    if (statusArray.indexOf(status) === -1 && status !== '') {
      throw new Error('The status value must be one of success, exception, and warning.')
    }
  }
}

window.customElements.define(IsuProgress.is, IsuProgress)
