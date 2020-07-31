import '@polymer/polymer/polymer-legacy.js'
import { html } from '@polymer/polymer/lib/utils/html-tag.js'
import { IronFitBehavior } from '@polymer/iron-fit-behavior/iron-fit-behavior.js'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import { PolymerElement } from '@polymer/polymer'

class IsuIronFit extends mixinBehaviors([IronFitBehavior], PolymerElement) {
  static get template () {
    return html`
    <style>
      :host {
        overflow: hidden;
        display: inline-block;
        background-color: white;
        width: max-content;
      }
    </style>
    <slot></slot>
`
  }

  static get properties () {
    return {
      scrollDomX: { // X轴滚动条所在的dom
        type: Element
      },
      scrollDomY: { // Y轴滚动条所在的dom
        type: Element
      },
      scrollDomList: { // 全部滚动条dom
        type: Array,
        value () {
          return []
        }
      },
      _raf: {
        type: Element
      },
      hidden: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    }
  }

  /**
   * 1. 查找  Y 与 X  滚动条 在哪里
   * 2. 绑定 Y 与 X 滚动事件（触发更新位置）
   * @param {Element} e dom
   */
  scrollAddEvent (e) {
    let parent = e.parentNode || e.getRootNode().host

    if (parent && parent.toString() === '[object ShadowRoot]') parent = e.getRootNode().host

    // isu Dialog 组件兼容
    const isIsuDialog = parent && parent.tagName === 'ISU-DIALOG'
    if (isIsuDialog) parent = parent.root.querySelector('.scrollable-container')

    if (parent && parent !== document) {
      const style = window.getComputedStyle(parent, null)

      if (this.ifOverflow(style)) {
        parent.addEventListener('scroll', e => { this.scrollOrResizeRefit() })
        parent.addEventListener('resize', e => { this.scrollOrResizeRefit() })

        this.push('scrollDomList', parent)

        // 只要最近的一级
        if (!this.scrollDomY && this.ifOverflow(style, 'Y')) this.set('scrollDomY', parent)
        if (!this.scrollDomX && this.ifOverflow(style, 'X')) this.set('scrollDomX', parent)
      }

      // isu Dialog 组件兼容
      isIsuDialog ? this.scrollAddEvent(e.getRootNode().host) : this.scrollAddEvent(parent)
    }
  }

  /**
   * 判断是否有滚动条
   * 不用e.scrollHeight > e.clientHeight 是因为我节点设了overflow=auto 内容没超会不显示滚动条。但是我要绑定最近的一级的
   * @param {Object} style window.getComputedStyle Object
   * @param {string} key Y=overflowY or X=overflowX
   * @return {boolean} 该节点是否有滚动条
   * */
  ifOverflow (style, key) {
    let data = style.overflow || ''
    if (key === 'X') data = style.overflowX
    if (key === 'Y') data = style.overflowY
    if (key) {
      return data === 'scroll' ||
        (
          data === 'auto' && (
            (key === 'X' ? style.maxWidth !== 'none' : style.maxHeight !== 'none') ||
            style.flex !== '0 1 auto'
          )
        )
    }
    return data.includes('scroll') || data.includes('auto')
  }

  scrollOrResizeRefit () {
    const self = this
    // 取消动画
    this._raf && window.cancelAnimationFrame(this._raf)
    this._raf = window.requestAnimationFrame(() => {
      this._raf = null
      if (!self.hidden) {
        // 附着的元素位置
        const positionTargetDom = self.positionTarget ? self.positionTarget : self
        const positionTargetRect = positionTargetDom.getBoundingClientRect()

        // Y轴（上下）
        const scrollDomYRect = self.scrollDomY.getBoundingClientRect()
        // Y轴 最大的坐标
        const maxY = positionTargetRect.top + positionTargetRect.height
        // Y轴滚动条 最大的坐标
        const sMaxY = scrollDomYRect.top + scrollDomYRect.height

        // X轴（左右）
        const scrollDomXRect = self.scrollDomX.getBoundingClientRect()
        // X轴 最大的坐标
        const maxX = positionTargetRect.left + positionTargetRect.width
        // X轴滚动条 最大的坐标
        const sMaxX = scrollDomXRect.left + scrollDomXRect.width

        // console.group(self)
        // console.log('附着元素', positionTargetRect)
        // console.log('scrollDomYRect', scrollDomYRect)
        // console.log('scrollDomXRect', scrollDomXRect)
        //
        // console.log('maxY', maxY, 'sMaxY', sMaxY, 'scrollDomYRect.top', scrollDomYRect.top)
        // console.log('在顶部↑被遮挡', maxY < scrollDomYRect.top, 'maxY < scrollDomYRect.top')
        // console.log('在底部↓遮挡', positionTargetRect.top > sMaxY, 'positionTargetRect.top > sMaxY')
        // console.log('maxX', maxX, 'sMaxX', sMaxX, 'scrollDomXRect.left', scrollDomXRect.left)
        // console.log('在左边←被遮挡', maxX < scrollDomXRect.left, 'maxX < scrollDomXRect.left')
        // console.log('在右边→被遮挡', positionTargetRect.left > sMaxX, 'positionTargetRect.left > sMaxX')
        // console.groupEnd()
        // document.documentElement.getBoundingClientRect()
        // document.documentElement.scrollWidth
        // document.documentElement.clientWidth

        const oclude = {
          // 滚动条Y是根节点 并且 附着元素被遮挡
          YDE: positionTargetRect.top < -positionTargetRect.height || positionTargetRect.top > self.scrollDomX.clientHeight,
          //  top 超过 Y 最大内容展示位置
          // 1. 下 滚动的时候 输入框 的 top + height （就是顶部的位置） 小于 Y轴滚动条的 top
          // 2. 上 滚动的时候 输入框 的 top 大于 Y轴滚动条的 top + height (就是等于到底部的位置)
          Y: maxY < scrollDomYRect.top || positionTargetRect.top > sMaxY,
          // 滚动条X是根节点 并且 附着元素被遮挡
          XDE: positionTargetRect.left < -positionTargetRect.width || positionTargetRect.left > self.scrollDomX.clientWidth,
          //  left 超过 X 最大内容展示位置
          // 1. 右 滚动的时候 输入框 的 left + width （就是左边←的位置） 小于 X轴滚动条的 left
          // 2. 左 滚动的时候 输入框 的 left 大于 X轴滚动条的 left + width (就是等于到右边→的位置)
          X: maxX < scrollDomXRect.left || positionTargetRect.left > sMaxX
        }

        // 滚动条X是否包含根节点
        if (self.isDocumentElement(self.scrollDomY) && oclude.YDE) {
          self.visibility(false)
        } else if (self.isDocumentElement(self.scrollDomX) && oclude.XDE) {
          self.visibility(false)
        } else if (!self.isDocumentElement(self.scrollDomY) && oclude.Y) {
          self.visibility(false)
        } else if (!self.isDocumentElement(self.scrollDomX) && oclude.X) {
          self.visibility(false)
        } else {
          self.visibility(true)
          self.fit()
        }
      } else {
        self.visibility(true)
      }
    })
  }

  /**
   * 设置可见
   * @param {boolean} isVisibility 是否可见
   * */
  visibility (isVisibility) {
    // this.style.background = isVisibility?'':'red'
    this.style.visibility = isVisibility ? 'visible' : 'hidden'
  }

  /**
   *是否是根节点
   *@param {Element} e dom
   *@return {boolean} 是否是根节点
   * */
  isDocumentElement (e) {
    return e === document.documentElement
  }

  connectedCallback () {
    const self = this
    self.sizingTarget = self.children[0]
    window.addEventListener('resize', e => { this.scrollOrResizeRefit() })
    window.addEventListener('scroll', e => { this.scrollOrResizeRefit() })
  }

  static get observers () {
    return ['_positionTargetChanged(positionTarget)', '_hidden(hidden)']
  }

  /**
   * 绑定节点发生变化
   * @param {Element} e 附着的元素的dom
   * */
  _positionTargetChanged (e) {
    if (!e) return
    this._minWidth(e)
    this.destroy()
    this.scrollAddEvent(this)
    if (!this.scrollDomY) this.set('scrollDomY', document.documentElement)
    if (!this.scrollDomX) this.set('scrollDomX', document.documentElement)
  }

  /**
   * 设置最小宽度
   * @param {Element} e dom
   * */
  _minWidth (e) {
    if (!e) return
    this.style.minWidth = `${e.offsetWidth}px`
  }

  _hidden () {
    this.visibility(true)
  }

  /**
   * 销毁全部绑定的事件
   * @param {boolean} d 彻底销毁全部绑定事件包括 window的滚动事件
   * */
  destroy (d = false) {
    this.scrollDomList.forEach(function (item, index, array) {
      item.removeEventListener('scroll', e => { this.scrollOrResizeRefit() }, true)
      item.removeEventListener('resize', e => { this.scrollOrResizeRefit() }, true)
    })
    this.set('scrollDomList', [])
    if (d) {
      window.removeEventListener('scroll', e => { this.scrollOrResizeRefit() }, true)
      window.removeEventListener('resize', e => { this.scrollOrResizeRefit() }, true)
    }
  }

  /**
   * 修正位置
   * */
  fixPosition () {
    if (this.positionTarget) {
      this.refit()
      this._minWidth(this.positionTarget)
    }
  }
}

window.customElements.define('isu-iron-fit', IsuIronFit)
