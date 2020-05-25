import '../isu-tip.js'

/**
 * @polymerBehavior
 */
export const TipBehavior = {
  /**
   * isuTip提供了以下便捷方法来使用 `isu-tip`.
   * - `isuTip.success(message, duration = 1500)`
   * - `isuTip.success({message, title}, duration = 1500)`
   * - `isuTip.warn(message, duration = 5000)`
   * - `isuTip.warn({message, title}, duration = 5000)`
   * - `isuTip.error(message, duration = 600000)`
   * - `isuTip.error({message, title}, duration = 600000)`
   * - `isuTip.confirm(message, confirmCallback, cancelCallback)`
   * - `isuTip.confirm({message, title}, confirmCallback, cancelCallback)`
   * - `isuTip.prompt(message, confirmCallback, cancelCallback)`
   * - `isuTip.prompt({message, title}, confirmCallback, cancelCallback)`
   * - `isuTip.tip({message, type, duration = 0, confirmCallback, cancelCallback})`
   * - `isuTip.tip({{message, title}, type, duration = 0, confirmCallback, cancelCallback})`
   * @type {object}
   */
  isuTip: {
    /**
     * 成功提示框
     * @param {string|object} msgObj
     * @param {number=1500} duration
     */
    success(msgObj, duration = 1500) {
      this.tip({msgObj, duration, type: 'success'});
    },
    
    /**
     * 警告提示框
     * @param {string|object} msgObj
     * @param {number=5000} duration
     */
    warn(msgObj, duration = 5000) {
      this.tip({msgObj, duration, type: 'warn'});
    },
    
    /**
     * 错误提示框
     * @param {string|object} msgObj
     * @param {number=600000} duration
     */
    error(msgObj, duration = 5000) {
      this.tip({msgObj, duration, type: 'error'});
    },
    
    /**
     * 确认提示框
     * @param {string|object} msgObj
     * @param {function} confirmCallback
     * @param {function} cancelCallback
     */
    confirm(msgObj, confirmCallback, cancelCallback) {
      this.tip({msgObj, type: 'confirm', confirmCallback, cancelCallback});
    },
    
    
    /**
     * 确认提示框（带备注）
     * @param {string|object} msgObj
     * @param {function} confirmCallback
     * @param {function} cancelCallback
     */
    prompt(msgObj, confirmCallback, cancelCallback) {
      this.tip({msgObj, type: 'prompt', confirmCallback, cancelCallback});
    },
    
    /**
     * @param {{msgObj:string|object, type:string, duration:number = 0, confirmCallback:function, cancelCallback:function}}
     */
    tip({msgObj, type, duration = 0, confirmCallback, cancelCallback}) {
      
      let {message, title, width, height, cancelBtnLabel, confirmBtnLabel} = (typeof msgObj === 'object') ? msgObj : {message: msgObj};
      
      const tip = document.createElement('isu-tip');
      tip.setAttribute('type', type);
      tip.message = message;
      tip.title = title;
      tip.width = width;
      tip.height = height;
      tip.duration = duration;
      tip.autoDetach = true;
      tip.config = {cancelBtnLabel, confirmBtnLabel, title};
      document.body.appendChild(tip);
      tip.open(confirmCallback, cancelCallback);
    }
  }
};