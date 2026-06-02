/* eslint-disable */
/*
* type: normal / promise 使用promise调用必须用await
*
* */
function wuDialog(msg) {
    const WU_DIALOG_WRAPPER_ID = 'wu-dialog-pop';
    const WU_DIALOG_ID = 'wu-dialog';
    const WU_DIALOG_MESSAGE_ID = 'wu-dialog-message';
    const WU_DIALOG_TIPS_ID = 'wu-dialog-tips';
    // 动画执行时间
    const ANIMATE_DURING = 400;
    let removeTimer = null;
    let removeMessageTimer = null;
    let messageVisableTimer = null;
    let removeTipsTimer = null;

    const isMobile = (() => {
        if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
            return true;
        } else {
            return false;
        }
    })();

    function message() {
        if (messageVisableTimer || removeMessageTimer) {
            return;
        }
        if (document.getElementById(WU_DIALOG_MESSAGE_ID)) {
            return;
        }
        const tpl = _getMessageTpl();
        _appendToBody(tpl);
        messageVisableTimer = setTimeout(() => {
            _closeMessage();
            messageVisableTimer = null;
        }, 1500)
    }

    function tips() {
        const tpl = _getTipsTpl();
        _appendToBody(tpl);
        _clickTipsClose();
    }

    function alert() {
        const tpl = _getACtpl('alert');
        _appendToBody(tpl);
        _clickClose();
        _clickSure();
    }

    function alertPromise() {
        const tpl = _getACtpl('alert');
        _appendToBody(tpl);
        return new Promise((resolve) => {
            _clickSure('promise', () => {
                resolve(true);
            });
            _clickClose('promise', () => {
                resolve(false);
            });
        });
    }

    function confirmPromise() {
        const tpl = _getACtpl('confirm');
        _appendToBody(tpl);
        return new Promise((resolve) => {
            _clickSure('promise', () => {
                resolve(true);
            });
            _clickClose('promise', () => {
                resolve(false);
            });
            _clickCancel('promise', () => {
                resolve(false);
            });
        });
    }


    // 私有
    function _clickTipsClose() {
        const tipsEl = document.getElementById(WU_DIALOG_TIPS_ID);
        const closeEl = document.getElementById(WU_DIALOG_TIPS_ID + '-close');
        closeEl.addEventListener('click', () => {
            _addClass(tipsEl, 'out');
            clearTimeout(removeTipsTimer);
            removeTipsTimer = setTimeout(() => {
                _removeDialog();
            }, ANIMATE_DURING);
        });
    }

    function _closeMessage() {
        const msgEl = document.getElementById(WU_DIALOG_MESSAGE_ID);
        _addClass(msgEl, 'out');
        clearTimeout(removeMessageTimer);
        removeMessageTimer = setTimeout(() => {
            _removeDialog();
        }, ANIMATE_DURING);
    }

    function _close() {
        const dialogEl = document.getElementById(WU_DIALOG_ID);
        _addClass(dialogEl, 'out');
        clearTimeout(removeTimer);
        removeTimer = setTimeout(() => {
            _removeDialog();
        }, ANIMATE_DURING);
    }

    function _clickClose(type = 'normal', callback) {
        const closeEl = document.getElementById('wu-dialog-close');
        if (type === 'promise') {
            return new Promise(resolve => {
                closeEl.addEventListener('click', () => {
                    _close();
                    if (callback) {
                        callback();
                    }
                });
            });
        } else {
            closeEl.addEventListener('click', () => {
                _close();
            });
        }
    }

    function _clickCancel(type = 'normal', callback = null) {
        const cancelEl = document.getElementById('wu-dialog-cancel');
        if (type === 'promise') {
            return new Promise(resolve => {
                cancelEl.addEventListener('click', () => {
                    _close();
                    if (callback) {
                        callback();
                    }
                });
            });
        }  else {
            cancelEl.addEventListener('click', () => {
                _close();
            });
        }
    }

    function _clickSure(type = 'normal', callback = null) {
        const sureEl = document.getElementById('wu-dialog-sure');
        if (type === 'promise') {
            return new Promise((resolve) => {
                sureEl.addEventListener('click', () => {
                    // console.log(111)
                    _close();
                    if (callback) {
                        callback();
                    }
                });
            });
        } else {
            sureEl.addEventListener('click', () => {
                _close();
            });
        }
    }

    function _hasClass(el, className) {
        let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
        return reg.test(el.className)
    }

    // 给dom添加样式名称，元素，要添加的样式名
    function _addClass(el, className) {
        if (_hasClass(el, className)) {
            return
        }
        // 先将传入el原来的class拆分成数组
        let newClass = el.className.split(' ');
        // 再将函数传递进来的要添加的className加入到数组末尾
        newClass.push(className);
        // 再将数组使用join方法转化拼接为字符串，并赋值给el元素的className属性
        el.className = newClass.join(' ')
    }

    function _removeDialog() {
        const elementToDelete = document.getElementById(WU_DIALOG_WRAPPER_ID);
        if (!elementToDelete) {
            return;
        }
        const parentNode = elementToDelete.parentNode;
        parentNode.removeChild(elementToDelete);
    }

    function _appendToBody(tplStr) {
        if (document.getElementById(WU_DIALOG_WRAPPER_ID)) {
            _removeDialog();
        }
        const wrapperEl = document.createElement('div');
        wrapperEl.className = WU_DIALOG_WRAPPER_ID;
        wrapperEl.id = WU_DIALOG_WRAPPER_ID;
        wrapperEl.innerHTML = tplStr;
        document.body.appendChild(wrapperEl);
    }

    // 获得alert confirm弹窗
    function _getACtpl(type = 'alert') {
        let cancelBtn = '';
        let clsName = 'wu-dialog';
        if (isMobile) {
            clsName = 'wu-dialog is-phone';
        }
        if (type === 'confirm') {
            cancelBtn = '<button type="button" class="wu-dialog-btn cancel" id="wu-dialog-cancel">取消</button>';
        }
        return `
            <div class="${clsName}" id="${WU_DIALOG_ID}">
              <div class="wu-dialog-inner">
                  <div class="wu-dialog-body">
                    <h2 class="wu-dialog-h2">
                        提示 <span class="wu-dialog-close" id="wu-dialog-close">×</span>
                    </h2>
                    <div class="wu-dialog-msg">${msg}</div>
                    <div class="wu-dialog-control">
                      ${cancelBtn}
                      <button type="button" class="wu-dialog-btn sure" id="wu-dialog-sure">确定</button>
                    </div>
                  </div>
              </div>
            </div>
        `;
    }

    function _getMessageTpl() {
        let clsName = isMobile ? `${WU_DIALOG_MESSAGE_ID} is-phone` : WU_DIALOG_MESSAGE_ID;
        return `
              <div class="${clsName}" id="${WU_DIALOG_MESSAGE_ID}">
                 <p class="wu-dialog-message-p">${msg}</p>
              </div>
        `;
    }

    function _getTipsTpl() {
        let clsName = isMobile ? `${WU_DIALOG_TIPS_ID} is-phone` : WU_DIALOG_TIPS_ID;
        const closeClsName = `${WU_DIALOG_TIPS_ID}-close`;
        return `
            <div class="${clsName}" id="${WU_DIALOG_TIPS_ID}">
              <div class="wu-dialog-tips-body">
                  <p class="wu-dialog-tips-p">${msg}</p>
                  <div class="close ${closeClsName}" id="${closeClsName}">×</div>
              </div>
            </div>
        `;
    }

    return {
        alert,
        alertPromise,
        confirmPromise,
        message,
        tips
    }
}
