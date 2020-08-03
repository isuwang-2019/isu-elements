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
      },
      intersectionObserver: { // 监听是否可见
        type: IntersectionObserver
      },
      isVisible: { // 当前是否可见
        type: Boolean,
        value: false
      }
    }
  }

  /**
   * 1. 查找全部父级滚动条
   * 2. 绑定 Y 与 X 滚动事件（触发更新位置）
   * @param {Element} e dom
   */
  scrollAddEvent (e) {
    let parent = e.parentNode || e.getRootNode().host
    if (parent && parent.toString() === '[object ShadowRoot]') parent = e.getRootNode().host

    // isu Dialog 组件兼容
    const isIsuDialog = parent && parent.tagName === 'ISU-DIALOG'
    if (isIsuDialog) parent = parent.root.querySelector('.scrollable-container')

    if (parent) {
      if (this.ifOverflow(parent)) {
        // 需要预绑定。如果在_hidden那里监听。事件会有延迟。
        this.addEvent(parent)

        this.push('scrollDomList', parent)
      }
      // isu Dialog 组件兼容
      isIsuDialog ? this.scrollAddEvent(e.getRootNode().host) : this.scrollAddEvent(parent)
    }
  }

  /**
   * 绑定触发事件
   *  @param {Element} e dom
   * */
  addEvent (e) {
    e.addEventListener('scroll', e => { this.debounce('__scrollOrResizeRefit', this.scrollOrResizeRefit.bind(this), 10) })
    e.addEventListener('resize', e => { this.debounce('__scrollOrResizeRefit', this.scrollOrResizeRefit.bind(this), 10) })
  }

  /**
   * 判断是否有滚动条
   * 不用e.scrollHeight > e.clientHeight 是因为我节点设了overflow=auto 内容没超会不显示滚动条。但是我要绑定最近的一级的
   *  @param {Element} e dom
   * @return {boolean} 该节点是否有滚动条
   * */
  ifOverflow (e) {
    if (e === document) return true
    const data = window.getComputedStyle(e, null).overflow
    return data.includes('scroll') || data.includes('auto')
  }

  /**
   * 更新位置
   * */
  scrollOrResizeRefit () {
    if (!this.hidden && this.isVisible) {
      const self = this
      // 取消动画
      this._raf && window.cancelAnimationFrame(this._raf)
      this._raf = window.requestAnimationFrame(() => {
        this._raf = null
        self.fit()
      })
    }
  }

  /**
   * 设置可见
   * @param {boolean} isVisibility 是否可见
   * */
  visibility (isVisibility) {
    this.style.visibility = isVisibility ? 'visible' : 'hidden'
  }

  connectedCallback () {
    const self = this
    self.sizingTarget = self.children[0]
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
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      if ((entry.isIntersecting || entry.intersectionRatio > 0.0) && !this.isVisible) {
        this.set('isVisible', true)
        this.visibility(true)
        this.scrollOrResizeRefit()
      } else if (!(entry.isIntersecting || entry.intersectionRatio > 0.0) && this.isVisible) {
        this.set('isVisible', false)
        this.visibility(false)
      }
    }, {
      threshold: [0.0, 1.0]
    })
  }

  /**
   * 设置最小宽度
   * @param {Element} e dom
   * */
  _minWidth (e) {
    if (!e) return
    this.style.minWidth = `${e.offsetWidth}px`
  }

  /**
   * 被用hidden隐藏
   * 取消监听
   * */
  _hidden (hidden) {
    if (hidden === true) {
      if (this.intersectionObserver) this.intersectionObserver.unobserve(this.positionTarget)
    } else {
      if (this.intersectionObserver) this.intersectionObserver.observe(this.positionTarget)
    }
  }

  /**
   * 销毁全部绑定的事件
   * */
  destroy () {
    this.scrollDomList.forEach(function (item) {
      item.removeEventListener('scroll', e => { this.debounce('__scrollOrResizeRefit', this.scrollOrResizeRefit.bind(this), 10) }, true)
      item.removeEventListener('resize', e => { this.debounce('__scrollOrResizeRefit', this.scrollOrResizeRefit.bind(this), 10) }, true)
    })
    this.set('scrollDomList', [])
    if (this.intersectionObserver) {
      this.intersectionObserver = ''
    }
  }

  /**
   * 修正位置
   * */
  fixPosition () {
    this.refit()
    this._minWidth(this.positionTarget)
  }
}

window.customElements.define('isu-iron-fit', IsuIronFit)
