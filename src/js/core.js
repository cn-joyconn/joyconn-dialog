/**
 * dialog  v2.1.0
 * @date  2018-04-12
 * @author  eric
 * @home  https://github.com/sufangyu/dialog2
 * @bugs  https://github.com/sufangyu/dialog2/issues
 * Licensed under MIT
 */

import "../iconfont/font_1723954_2i2jtntm4tj/iconfont.css";
import "../css/dialog.css";
import JDZepto from "n-zepto"
import { clientUtil,ObjectAssign } from './util'

var clientObject = clientUtil(window);
/**
 * 插件默认值
 */
var dialog_defaults = {
    type: 'alert',   // 弹窗的类型 [ alert: 确定; confirm: 确定/取消; toast: 状态提示; notice: 提示信息 ]
    style: 'default', // alert 与 confirm 弹窗的风格 [ default: 根据访问设备平台; ios: ios 风格; android: MD design 风格 ]
    titleShow: true,      // 是否显示标题
    titleText: '提示',    // 标题文字
    bodyNoScroll: false,     // body内容不可以滚动
    closeBtnShow: false,     // 是否显示关闭按钮
    content: '',        // 弹窗提示内容, 值可以是 HTML 内容
    contentScroll: true,      // alert 与 confirm 弹窗提示内容是否限制最大高度, 使其可以滚动
    dialogClass: '',        // 弹窗自定义 class
    autoClose: 0,         // 弹窗自动关闭的延迟时间(毫秒)。0: 不自动关闭; 大于0: 自动关闭弹窗的延迟时间
    overlayShow: true,      // 是否显示遮罩层
    overlayClose: false,     // 是否可以点击遮罩层关闭弹窗

    buttonStyle: 'side',   // 按钮排版样式 [ side: 并排; stacked: 堆叠 ]
    buttonTextConfirm: '确定',   // 确定按钮文字
    buttonTextCancel: '取消',   // 取消按钮文字
    buttonClassConfirm: '',       // 确定按钮自定义 class
    buttonClassCancel: '',       // 取消按钮自定义 class
    buttons: [],       // confirm 弹窗自定义按钮组, 会覆盖"确定"与"取消"按钮; 单个 button 对象可设置 name [ 名称 ]、class [ 自定义class ]、callback [ 点击执行的函数 ]

    infoIcon: '',        // toast 与 notice 弹窗的提示图标, 值为图标的路径。不设置=不显示
    infoIconColor: '',        // toast 与 notice 弹窗的提示图标, 值为图标的路径。不设置=不显示
    infoText: '',        // toast 与 notice 弹窗的提示文字, 会覆盖 content 的设置
    infoColor: '',// toast 与 notice 弹窗的文字颜色,默认:#fff
    infoBgColor: '',// toast 与 notice 弹窗的背景颜色,默认:rgba(0, 0, 0, 0.8);
    position: 'center',  // notice 弹窗的位置, [ center: 居中; bottom: 底部 ]

    onClickConfirmBtn: function () { },  // “确定”按钮的回调函数
    onClickCancelBtn: function () { },  // “取消”按钮的回调函数
    onBeforeShow: function () { },  // 弹窗显示前的回调函数
    onShow: function () { },  // 弹窗显示后的回调函数
    onBeforeClosed: function () { },  // 弹窗关闭前的回调函数
    onClosed: function () { }   // 弹窗关闭后的回调函数
};
/**
         * 弹窗构造函数
         * @param {json obj}  options   弹窗配置项
         */
function Dialog(options) {
    // var defaultOptions = JSON.parse(JSON.stringify(dialog_defaults))
    this.userOptions=options;
    this.settings = ObjectAssign( {}, dialog_defaults, options);
}
Dialog.prototype = {
    /**
     * 初始化弹窗
     */
    _init: function () {
        var self = this;

        console.log('初始化弹窗');

        clearTimeout(self.autoCloseTimer);

        self.isHided = false;                   // 是否已经隐藏
        self.tapBug = self._hasTapBug();        // 是否有点透 BUG
        self.platform = clientObject.platform;    // 访问设备平台
        self.dislogStyle = self.settings.style === 'default' ? (clientObject.isMobile ? "default" : "pc") : self.settings.style;    // 弹窗风格, 默认自动判断平台; 否则, 为指定平台


        // 创建弹窗显示时, 禁止 body 内容滚动的样式并且添加到 head
        if (JDZepto('#dialog-body-no-scroll').length === 0) {
            var styleContent = '.body-no-scroll { position: absolute; overflow: hidden; width: 100%; }';
            JDZepto('head').append('<style id="dialog-body-no-scroll">' + styleContent + '</style>');
        }

        self._renderDOM();
        self._bindEvents();
    },

    /**
     * 渲染弹窗 DOM 结构
     */
    _renderDOM: function () {
        var self = this;

        self.settings.onBeforeShow();
        self._createDialogDOM(self.settings.type);
        self.settings.onShow();
        self._setNoticeContentMargin();
    },

    /**
     * 绑定弹窗相关事件
     */
    _bindEvents: function () {
        var self = this;

        // 确定按钮关闭弹窗
        self.jdz_confirmBtn.on(clientObject.tapEvent, function (ev) {
            var callback = self.settings.onClickConfirmBtn();
            if (callback || callback === undefined) {
                self.closeDialog();
            }
        }).on('touchend', function (ev) {
            ev.preventDefault();
        });
        function cancelCloseDialog() {
            var callback = self.settings.onClickCancelBtn();
            if (callback || callback === undefined) {
                self.closeDialog();
            }
        }
        // 取消按钮关闭弹窗
        self.jdz_cancelBtn.on(clientObject.tapEvent, function (ev) {
            cancelCloseDialog();
        }).on('touchend', function (ev) {
            ev.preventDefault();
        });

        // 关闭按钮关闭弹窗
        self.jdz_closeBtn.on(clientObject.tapEvent, function (ev) {
            cancelCloseDialog()
        }).on('touchend', function (ev) {
            ev.preventDefault();
        });

        // 遮罩层关闭弹窗
        if (self.settings.overlayClose) {
            JDZepto(document).on(clientObject.tapEvent, '.dialog-overlay', function (ev) {
                cancelCloseDialog()
            });
        }

        // 自动关闭弹窗
        if (self.settings.autoClose > 0) {
            console.log(self.settings.autoClose / 1000 + '秒后, 自动关闭弹窗');
            self._autoClose();
        }

        // 删除弹窗和 tap 点透 BUG 遮罩层, 在隐藏弹窗的动画结束后执行
        JDZepto(document).on('webkitAnimationEnd MSAnimationEnd animationend', '.dialog-content', function () {
            if (self.isHided) {
                self.removeDialog();

                if (self.tapBug) {
                    self._removeTapOverlayer();
                }
            }
        });

        // 为自定义按钮组绑定回调函数
        if (self.settings.buttons.length) {
            JDZepto.each(self.settings.buttons, function (index, item) {
                self.jdz_dialogContentFt.children('button').eq(index).on(clientObject.tapEvent, function (ev) {
                    ev.preventDefault();
                    var callback = item.callback();
                    if (callback || callback === undefined) {
                        self.closeDialog();
                    }
                });
            });
        }

        // 如果弹窗有最大高度设置项, 在窗口大小改变时, 重新设置弹窗最大高度
        JDZepto(window).on("onorientationchange" in window ? "orientationchange" : "resize", function () {
            if (self.settings.contentScroll) {
                setTimeout(function () {
                    self._resetDialog();
                }, 200);
            }
        });


        // 阻止 body 内容滑动
        JDZepto(document).on('touchmove', function (e) {
            if (self.jdz_dialog.find(JDZepto(e.target)).length) {
                return false;
            } else {
                return true;
            }
        });

        // 弹窗有最大高度设置项, 设置提示内容滑动
        if (self.settings.contentScroll) {
            self._contentScrollEvent();
        }


        // // 安卓风格的点击水波纹
        // if (self.dislogStyle === 'android') {
        //     JDZepto('.dialog-content-ft > .dialog-btn').ripple();
        // }

    },

    /**
     * 根据弹窗类型, 创建弹窗 DOM 结构
     * @param {string}  dialogType   弹窗类型
     */
    _createDialogDOM: function (dialogType) {
        var self = this;

        self.jdz_dialog = JDZepto('<div class="jdialog dialog-open ' + self.settings.dialogClass + '" data-style="' + self.dislogStyle + '"></div>');
        self.jdz_dialogOverlay = JDZepto('<div class="dialog-overlay"></div>');
        self.jdz_dialogContent = JDZepto('<div class="dialog-content"></div>');
        self.jdz_dialogTitle = JDZepto('<div class="dialog-content-hd"><h3 class="dialog-content-title">' + self.settings.titleText + '</h3></div>');
        self.jdz_dialogContentFt = JDZepto('<div class="dialog-content-ft"></div>');
        self.jdz_dialogContentBd = JDZepto('<div class="dialog-content-bd"></div>');
        self.jdz_closeBtn = JDZepto('<div class="dialog-btn-close"><span>close</span></div>');
        self.jdz_confirmBtn = JDZepto('<button class="dialog-btn dialog-btn-confirm ' + self.settings.buttonClassConfirm + '">' + self.settings.buttonTextConfirm + '</button>');
        self.jdz_cancelBtn = JDZepto('<button class="dialog-btn dialog-btn-cancel ' + self.settings.buttonClassCancel + '">' + self.settings.buttonTextCancel + '</button>');

        switch (dialogType) {
            case 'alert':
                self._createDialogAlertTypeDOM(self, dialogType);
                break;
            case 'toast':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_error':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_warning':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_info':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_success':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_question':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_busy':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'toast_wind':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'loading':
                self._createDialogToastTypeDOM(self, dialogType);
                break;
            case 'notice':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            case 'notice_error':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            case 'notice_warning':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            case 'notice_info':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            case 'notice_success':
                self._createDialogNoticeTypeDOM(self, dialogType);
                break;
            default:
                console.log('running default');
                break;
        }
    },
    //alert型显示
    _createDialogAlertTypeDOM:function(self, alertType){
        // 添加 alert 类型弹窗标识
        self.jdz_dialog.addClass('dialog-modal');

        // 显示遮罩层
        if (self.settings.overlayShow) {
            self.jdz_dialog.append(self.jdz_dialogOverlay);
        }
        // 显示标题
        if (self.settings.titleShow) {
            self.jdz_dialogContent.append(self.jdz_dialogTitle);
        }
        // 显示关闭按钮
        if (self.settings.closeBtnShow) {
            self.jdz_dialogTitle.append(self.jdz_closeBtn);
        }
        if (self.settings.buttons.length) {
            var buttonGroupHtml = '';
            JDZepto.each(self.settings.buttons, function (index, item) {
                buttonGroupHtml += '<button class="dialog-btn ' + item.class + '">' + item.name + '</button>';

            });
            self.jdz_dialogContentFt.append(buttonGroupHtml).addClass(self.settings.buttonStyle);
        }
        if (self.settings.buttonTextCancel) {
            self.jdz_dialogContentFt.append(self.jdz_cancelBtn).addClass(self.settings.buttonStyle);
        }
        if (self.settings.buttonTextConfirm) {
            self.jdz_dialogContentFt.append(self.jdz_confirmBtn).addClass(self.settings.buttonStyle);
        }

        self.jdz_dialogContentBd.append(self.settings.content);
        self.jdz_dialogContent.append(self.jdz_dialogContentBd).append(self.jdz_dialogContentFt);
        self.jdz_dialog.append(self.jdz_dialogContent);
        JDZepto('body').append(self.jdz_dialog);

        if (self.settings.bodyNoScroll) {
            JDZepto('body').addClass('body-no-scroll');
        }

        // 设置弹窗提示内容最大高度
        if (self.settings.contentScroll) {
            self._setDialogContentHeight();
        }

    },
    //toast型显示
    _createDialogToastTypeDOM:function(self, toastType) {
        // 添加 toast 类型弹窗标识
        self.jdz_dialog.addClass('dialog-toast');

        //自动关闭
        if (!self.settings.autoClose) {
            self.settings.autoClose=2000;
        }
        // 显示遮罩层
        if (self.settings.overlayShow) {
            self.jdz_dialog.append(self.jdz_dialogOverlay);
        }

        // 弹窗内容 HTML, 默认为 content; 如果设置 icon 与 text, 则覆盖 content 的设置

        var toastContentHtmlStr = ''
        if (self.settings.content) {
            toastContentHtmlStr = self.settings.content
        } else {
            var iconfontValue = "";
            var color = "#fff", infoBgColor = "rgba(0, 0, 0, 0.8);", infoColor = "fff";
            switch (toastType) {
                case 'toast_error':
                    iconfontValue = "icon-failure_toast";
                    color = "#d81e06";
                    break;
                case 'toast_warning':
                    iconfontValue = "icon-alert_toast";
                    color = "#f4ea2a";
                    break;
                case 'toast_info':
                    iconfontValue = "icon-info";
                    color = "#1296db";
                    break;
                case 'toast_success':
                    iconfontValue = "icon-success_toast";
                    color = "#58b20f";
                    break;
                case 'toast_question':
                    iconfontValue = "icon-question";
                    color = "#13227a";
                    break;
                case 'toast_busy':
                    iconfontValue = "icon-busy_toast";
                    color = "#d81e06";
                    break;
                case 'toast_wind':
                    iconfontValue = "icon-windcontrol";
                    color = "#d81e06";
                    console.info("wind")
                    break;
                case 'loading':
                    iconfontValue = "icon-loading jdialog-loading-route-animation";
                    color = "#1296db";
                    console.info("loading")
                    break;
                default:
                    break;
            }
            if (self.settings.infoColor) {
                infoColor = self.settings.infoColor;
            }
            if (self.settings.infoBgColor) {
                infoBgColor = self.settings.infoBgColor;
            }
            if (self.settings.infoIconColor) {
                color = self.settings.infoIconColor;
            }
            if (iconfontValue !== "") {
                toastContentHtmlStr += '<div><i class="info-icon JDialog-icon ' + iconfontValue + '" style="color:' + color + ';display: inline-block;"  ></i></div>';
            } else if (self.settings.infoIcon !== '') {
                toastContentHtmlStr += '<img class="info-icon" src="' + self.settings.infoIcon + '" />';
            }
            if (self.settings.infoText !== '') {
                toastContentHtmlStr += '<span class="info-text"  style="color:' + infoColor + ';">' + self.settings.infoText + '</span>';
            }
        }
        var toastContentHtml = JDZepto(toastContentHtmlStr);
        self.jdz_dialogContentBd.append(toastContentHtml);
        self.jdz_dialogContent.append(self.jdz_dialogContentBd);
        self.jdz_dialog.append(self.jdz_dialogContent);
        self.jdz_dialogContent.css("background-color", infoBgColor)
        JDZepto('body').append(self.jdz_dialog);

        if (self.settings.bodyNoScroll) {
            JDZepto('body').addClass('body-no-scroll');
        }
    },
    //notice型显示
    _createDialogNoticeTypeDOM:function(self, noticeType) {
        // 添加 toast 类型弹窗标识
        self.jdz_dialog.addClass('dialog-notice');
        // if(typeof self.userOptions.overlayShow == 'undefined'){
        //     self.settings.overlayShow=false;
        // }
        //自动关闭
        if (!self.settings.autoClose) {
            self.settings.autoClose=2000;
        }
        // 底部显示的 toast
        if (self.settings.position === 'bottom') {
            self.jdz_dialog.addClass('dialog-notice-bottom');
        } else if (self.settings.position === 'top') {
            self.jdz_dialog.addClass('dialog-notice-top');
        }else{            
            self.jdz_dialog.addClass('dialog-notice-center');
        }

        // 显示遮罩层
        if (self.settings.overlayShow) {
            self.jdz_dialog.append(self.jdz_dialogOverlay);
        }


        var toastContentHtmlStr = ''
        if (self.settings.content) {
            toastContentHtmlStr = self.settings.content
        } else {
            var iconfontValue = "";
            var color = "#fff", infoBgColor = "rgba(0, 0, 0, 0.8);", infoColor = "fff";

            switch (noticeType) {
                case 'notice_error':
                    iconfontValue = "icon-failure_toast";
                    color = "#d81e06";
                    infoColor = "#d81e06";
                    infoBgColor = "rgba(255, 130, 106, 0.6);";
                    break;
                case 'notice_warning':
                    iconfontValue = "icon-alert_toast";
                    color = "#DAA520";
                    infoColor = "#DAA520";
                    infoBgColor = "rgba(238,232,170, 0.6);";
                    break;
                case 'notice_info':
                    iconfontValue = "icon-info";
                    color = "#4682B4";
                    infoColor = "#4682B4";
                    infoBgColor = "rgba(175,238,238, 0.6);";
                    break;
                case 'notice_success':
                    iconfontValue = "icon-success_toast";
                    color = "#58b20f";
                    infoColor = "#58b20f";
                    infoBgColor = "rgba(148, 248, 85, 0.6);";
                    break;
            }
            if (self.settings.infoColor) {
                infoColor = self.settings.infoColor;
            }
            if (self.settings.infoBgColor) {
                infoBgColor = self.settings.infoBgColor;
            }
            if (self.settings.infoIconColor) {
                color = self.settings.infoIconColor;
            }

            if (iconfontValue !== "") {
                toastContentHtmlStr += '<i class="info-icon JDialog-icon ' + iconfontValue + '" style="color:' + color + ';display: inline-block;"  ></i>';
            } else if (self.settings.infoIcon !== '') {
                toastContentHtmlStr += '<img class="info-icon" src="' + self.settings.infoIcon + '" />';
            }
            if (self.settings.infoText !== '') {
                toastContentHtmlStr += '<span class="info-text"  style="color:' + infoColor + ';">' + self.settings.infoText + '</span>';
            }
        }

        // 弹窗内容 HTML, 默认为 content; 如果设置 icon 与 text, 则覆盖 content 的设置
        var noticeContentHtml = JDZepto(toastContentHtmlStr);

        self.jdz_dialogContentBd.append(noticeContentHtml);
        self.jdz_dialogContent.append(self.jdz_dialogContentBd);
        self.jdz_dialog.append(self.jdz_dialogContent);
        self.jdz_dialogContent.css("background-color", infoBgColor)
        JDZepto('body').append(self.jdz_dialog);

        if (self.settings.bodyNoScroll) {
            JDZepto('body').addClass('body-no-scroll');
        }
    },
    /**
     * 设置弹窗内容最大高度
     * 延迟执行, 避免获取相关尺寸不正确
     */
    _setDialogContentHeight: function () {
        var self = this;

        setTimeout(function () {
            var dialogDefaultContentHeight = self.jdz_dialogContentBd.height();
            var dialogContentMaxHeight = self._getDialogContentMaxHeight();

            self.jdz_dialogContentBd.css({
                'max-height': dialogContentMaxHeight,
            }).addClass('content-scroll');

            // 提示内容大于最大高度时, 添加底部按钮顶部边框线标识 class; 反之, 删除
            if (dialogDefaultContentHeight > dialogContentMaxHeight) {
                self.jdz_dialogContentFt.addClass('dialog-content-ft-border');
            } else {
                self.jdz_dialogContentFt.removeClass('dialog-content-ft-border');
            }

        }, 80);
    },
    /**
     * notice 弹出多个调整位置
     */
    _setNoticeContentMargin:function(){
        var positions=['top','center','bottom'];
        var height = 0;
        var win_height = $(window).height();
        var total_height = 0;
        var max_width = 0;
        $.each(positions,function(i,p){
            height=0;
            total_height = 0;
            max_width = 0;
            var notice_dialogs=$('.dialog-notice-'+p);
            if(notice_dialogs.length>0){
                $.each(notice_dialogs,function(j,d){
                    total_height += $(d).find('.dialog-content').height() + (j==0?0:10);
                    max_width = $(d).find('.dialog-content').width() > max_width? $(d).find('.dialog-content').width() :max_width;
                    // if($(d).find('.dialog-overlay').length==0){
                    //     $(d).height( $(d).find('.dialog-content').height())
                    // }
                })
                if(p=="center"){
                    console.info("total_height",total_height)
                }
                $.each(notice_dialogs,function(j,d){
                    if(p=='top'){
                        $(d).find('.dialog-content').css('top',height+'px;')
                    }else if(p=='bottom'){
                        $(d).find('.dialog-content').css('bottom',height+'px;')
                    }else if(p=='center'){
                        $(d).find('.dialog-content').css('top', ((win_height-total_height)/2 + height)+'px;')
                    }
                    // $(d).find('.dialog-content').width(max_width)//统一宽度，这个在IE下存在换行的bug。先搁置
                    height += $(d).find('.dialog-content').height() + 10;
                })
               
            }
        })
    },
    /**
     * 获取弹窗内容最大高度
     * @return height
     */
    _getDialogContentMaxHeight: function () {
        var self = this;
        var winHeight = JDZepto(window).height(),
            dialogContentHdHeight = self.jdz_dialogTitle.height(),
            dialogContentFtHeight = self.jdz_dialogContentFt.height(),
            dialogContentBdHeight = winHeight - dialogContentHdHeight - dialogContentFtHeight - 60;

        // 最大高度取偶数
        dialogContentBdHeight = dialogContentBdHeight % 2 === 0 ? dialogContentBdHeight : dialogContentBdHeight - 1;
        return dialogContentBdHeight;
    },

    /**
     * 重置弹窗, 在窗口大小发生变化时触发 
     */
    _resetDialog: function () {
        var self = this;
        self._setDialogContentHeight();
    },

    /**
     * 有最大高度弹窗的提示内容滑动
     */
    _contentScrollEvent: function () {
        var self = this;

        var isTouchDown = false;
        // 初始位置
        var position = {
            x: 0,
            y: 0,
            top: 0,
            left: 0
        };

        // 监听滑动相关事件
        JDZepto(document)
            .on('touchstart mousedown', '.content-scroll', function (ev) {
                var touch = ev.changedTouches ? ev.changedTouches[0] : ev;

                isTouchDown = true;
                position.x = touch.clientX;
                position.y = touch.clientY;
                position.top = JDZepto(this).scrollTop();
                position.left = JDZepto(this).scrollLeft();
                // return false;
            })
            .on('touchmove mousemove', '.content-scroll', function (ev) {
                var touch = ev.changedTouches ? ev.changedTouches[0] : ev;

                if (!isTouchDown) {
                    // 未按下
                    return false;
                } else {
                    // 要滑动的距离 = 已经滑动的距离 - (当前坐标 - 按下坐标)
                    var moveTop = position.top - (touch.clientY - position.y);
                    var moveLeft = position.left - (touch.clientX - position.x);

                    JDZepto(this).scrollTop(moveTop).scrollLeft(moveLeft);
                }
            })
            .on('touchend mouseup', '.content-scroll', function (ev) {
                ev.preventDefault();
                isTouchDown = false;
            });

    },

    /**
     * 自动关闭弹窗
     */
    _autoClose: function () {
        var self = this;

        self.autoCloseTimer = setTimeout(function () {
            self.closeDialog();
        }, self.settings.autoClose);
    },

    /**
     * 关闭弹窗
     */
    closeDialog: function () {
        var self = this;

        self.isHided = true;
        self.settings.onBeforeClosed();
        self.jdz_dialog.addClass('dialog-close').removeClass('dialog-open');
        if(!clientObject.animation){
            //兼容IE9
            self.removeDialog();    
            console.info('ie9');
        }
        if (self.tapBug) {
            self._appendTapOverlayer();
        }
    },

    /**
     * 删除弹窗
     * @public method
     */
    removeDialog: function () {
        var self = this;
        if($(self.jdz_dialog).length==0){
                return;
        }
        self.jdz_dialogContent.html('');
        self.jdz_dialog.remove();
        self.isHided = false;
        self.settings.onClosed();
        // 重新初始化默认配置
        self.settings = dialog_defaults;

        if (self.settings.bodyNoScroll) {
            JDZepto('body').removeClass('body-no-scroll');
        }
        
        self._setNoticeContentMargin();
    },

    /**
     * 更改 toast 和 notice 类型弹窗内容 
     * @public method
     * @param {string}  content          弹窗内容, 可以是HTML
     * @param {string}  infoIcon         弹窗提示图标
     * @param {string}  infoText         弹窗提示文字
     * @param {int}     autoClose        自动关闭的延迟时间
     * @param {fn}      onBeforeClosed   关闭前回调函数
     * @param {fn}      onClosed         关闭后回调函数
     */
    update: function (settings) {
        var self = this;

        clearTimeout(self.autoCloseTimer);

        // 设置默认值，并且指向给对象的默认值
        self.settings = ObjectAssign({},dialog_defaults, settings);
        console.info(self.settings)
        // 通过 content 更改弹窗内容
        if (self.settings.content !== '') {
            self.jdz_dialogContentBd.html('');
            self.jdz_dialogContentBd.append(self.settings.content);
        }

        // 通过设置 infoIcon 与 infoText 更改弹窗内容, 会覆盖 content 的设置
        var jdz_infoIcon = self.jdz_dialogContentBd.find('.info-icon');
        var jdz_infoText = self.jdz_dialogContentBd.find('.info-text');
        jdz_infoIcon.attr({ 'src': self.settings.infoIcon });
        jdz_infoText.html(self.settings.infoText);

        // 重新为更改后的 DOM 元素绑定事件
        self._bindEvents();        
        self._setNoticeContentMargin();
    },
    

    /**
     * 是否有点透 BUG 
     * 条件: 安卓手机并且版本号小于4.4
     * @return Boolean
     */
    _hasTapBug: function () {
        return false;// clientObject.isAndroid && (clientObject.version < 4.4);
    },

    /**
     * 添加点透遮罩层, 解决点透 BUG
     */
    _appendTapOverlayer: function () {
        var self = this;

        self.jdz_tapBugOverlayer = JDZepto('.solve-tap-bug');

        if (!self.jdz_tapBugOverlayer.length) {
            self.jdz_tapBugOverlayer = JDZepto('<div class="solve-tap-bug" style="margin:0;padding:0;border:0;background:rgba(0,0,0,0);-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;height:100%;position:fixed;top:0;left:0;"></div>');
            JDZepto('body').append(self.jdz_tapBugOverlayer);
        }
    },

    /**
     * 删除点透遮罩层, 延迟执行的时间大于移动端的 click 触发时间
     */
    _removeTapOverlayer: function () {
        var self = this;

        setTimeout(function () {
            self.jdz_tapBugOverlayer.remove();
        }, 350);
    }
};
export function dialogFunc(options) {

    var obj = new Dialog(options);
    obj._init();
    obj.close = function () {
        obj.closeDialog();
    }
    return obj;
}