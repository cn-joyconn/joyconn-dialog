/**
 * dialog  v2.1.0
 * @date  2018-04-12
 * @author  eric
 * @home  https://github.com/sufangyu/dialog2
 * @bugs  https://github.com/sufangyu/dialog2/issues
 * Licensed under MIT
 */

import "../iconfont/font_1723954_2i2jtntm4tj/iconfont.css";
export function dialogFunc($, window, document) {
    'use strict';

    var Dialog = (function () {

        /**
         * 弹窗构造函数
         * @param {dom obj}   element   调用对象 
         * @param {json obj}  options   弹窗配置项
         */
        function Dialog(element, options) {
            this.$element = $(element);
            this.settings = Object.assign(dialog_defaults, options);
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
                self.platform = mobileUtil.platform;    // 访问设备平台
                self.dislogStyle = self.settings.style === 'default' ? (mobileUtil.isMobile ? "default" : "pc") : self.settings.style;    // 弹窗风格, 默认自动判断平台; 否则, 为指定平台


                // 创建弹窗显示时, 禁止 body 内容滚动的样式并且添加到 head
                if ($('#dialog-body-no-scroll').length === 0) {
                    var styleContent = '.body-no-scroll { position: absolute; overflow: hidden; width: 100%; }';
                    $('head').append('<style id="dialog-body-no-scroll">' + styleContent + '</style>');
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
            },

            /**
             * 绑定弹窗相关事件
             */
            _bindEvents: function () {
                var self = this;

                // 确定按钮关闭弹窗
                self.$confirmBtn.on(mobileUtil.tapEvent, function (ev) {
                    var callback = self.settings.onClickConfirmBtn();
                    if (callback || callback === undefined) {
                        self.closeDialog();
                    }
                }).on('touchend', function (ev) {
                    ev.preventDefault();
                });

                // 取消按钮关闭弹窗
                self.$cancelBtn.on(mobileUtil.tapEvent, function (ev) {
                    var callback = self.settings.onClickCancelBtn();
                    if (callback || callback === undefined) {
                        self.closeDialog();
                    }
                }).on('touchend', function (ev) {
                    ev.preventDefault();
                });

                // 关闭按钮关闭弹窗
                self.$closeBtn.on(mobileUtil.tapEvent, function (ev) {
                    var callback = self.settings.onClickCloseBtn();
                    if (callback || callback === undefined) {
                        self.closeDialog();
                    }
                }).on('touchend', function (ev) {
                    ev.preventDefault();
                });

                // 遮罩层关闭弹窗
                if (self.settings.overlayClose) {
                    $(document).on(mobileUtil.tapEvent, '.dialog-overlay', function (ev) {
                        self.closeDialog();
                    });
                }

                // 自动关闭弹窗
                if (self.settings.autoClose > 0) {
                    console.log(self.settings.autoClose / 1000 + '秒后, 自动关闭弹窗');
                    self._autoClose();
                }

                // 删除弹窗和 tap 点透 BUG 遮罩层, 在隐藏弹窗的动画结束后执行
                $(document).on('webkitAnimationEnd MSAnimationEnd animationend', '.dialog-content', function () {
                    if (self.isHided) {
                        self.removeDialog();

                        if (self.tapBug) {
                            self._removeTapOverlayer();
                        }
                    }
                });

                // 为自定义按钮组绑定回调函数
                if (self.settings.buttons.length) {
                    $.each(self.settings.buttons, function (index, item) {
                        self.$dialogContentFt.children('button').eq(index).on(mobileUtil.tapEvent, function (ev) {
                            ev.preventDefault();
                            var callback = item.callback();
                            if (callback || callback === undefined) {
                                self.closeDialog();
                            }
                        });
                    });
                }

                // 如果弹窗有最大高度设置项, 在窗口大小改变时, 重新设置弹窗最大高度
                $(window).on("onorientationchange" in window ? "orientationchange" : "resize", function () {
                    if (self.settings.contentScroll) {
                        setTimeout(function () {
                            self._resetDialog();
                        }, 200);
                    }
                });


                // 阻止 body 内容滑动
                $(document).on('touchmove', function (e) {
                    if (self.$dialog.find($(e.target)).length) {
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
                //     $('.dialog-content-ft > .dialog-btn').ripple();
                // }

            },

            /**
             * 根据弹窗类型, 创建弹窗 DOM 结构
             * @param {string}  dialogType   弹窗类型
             */
            _createDialogDOM: function (dialogType) {
                var self = this;

                self.$dialog = $('<div class="dialog dialog-open ' + self.settings.dialogClass + '" data-style="' + self.dislogStyle + '"></div>');
                self.$dialogOverlay = $('<div class="dialog-overlay"></div>');
                self.$dialogContent = $('<div class="dialog-content"></div>');
                self.$dialogTitle = $('<div class="dialog-content-hd"><h3 class="dialog-content-title">' + self.settings.titleText + '</h3></div>');
                self.$dialogContentFt = $('<div class="dialog-content-ft"></div>');
                self.$dialogContentBd = $('<div class="dialog-content-bd"></div>');
                self.$closeBtn = $('<div class="dialog-btn-close"><span>close</span></div>');
                self.$confirmBtn = $('<button class="dialog-btn dialog-btn-confirm ' + self.settings.buttonClassConfirm + '">' + self.settings.buttonTextConfirm + '</button>');
                self.$cancelBtn = $('<button class="dialog-btn dialog-btn-cancel ' + self.settings.buttonClassCancel + '">' + self.settings.buttonTextCancel + '</button>');

                switch (dialogType) {
                    case 'alert':
                        self._createDialogAlertTypeDOM(self, dialogType);                        
                        break;
                    case 'confirm':
                        self._createDialogConfirmTypeDOM(self, dialogType);                       
                        break;
                    case 'toast':
                        self._createDialogToastTypeDOM(self, dialogType);
                        break;
                    case 'error':
                        self._createDialogToastTypeDOM(self, dialogType);
                        break;
                    case 'warning':
                        self._createDialogToastTypeDOM(self, dialogType);
                        break;
                    case 'info':
                        self._createDialogToastTypeDOM(self, dialogType);
                        break;
                    case 'success':
                        self._createDialogToastTypeDOM(self, dialogType);
                        break;
                    case 'question':
                        self._createDialogToastTypeDOM(self, dialogType);
                        break;
                    case 'busy':
                        self._createDialogToastTypeDOM(self, dialogType);
                        break;
                    case 'wind':
                        self._createDialogToastTypeDOM(self, dialogType);
                        break;
                    case 'notice':
                        self._createDialogNoticeTypeDOM(self, dialogType);
                        break;
                    default:
                        console.log('running default');
                        break;
                }
            },
            //alert型显示
            _createDialogAlertTypeDOM(self, alertType) {
               // 添加 alert 类型弹窗标识
               self.$dialog.addClass('dialog-modal');

               // 显示遮罩层
               if (self.settings.overlayShow) {
                   self.$dialog.append(self.$dialogOverlay);
               }
               // 显示标题
               if (self.settings.titleShow) {
                   self.$dialogContent.append(self.$dialogTitle);
               }
               // 显示关闭按钮
               if (self.settings.closeBtnShow) {
                   self.$dialogTitle.append(self.$closeBtn);
               }

               self.$dialogContentBd.html(self.settings.content);
               self.$dialogContentFt.append(self.$confirmBtn);
               self.$dialogContent.append(self.$dialogContentBd).append(self.$dialogContentFt);
               self.$dialog.append(self.$dialogContent);
               $('body').append(self.$dialog);

               if (self.settings.bodyNoScroll) {
                   $('body').addClass('body-no-scroll');
               }

               // 设置弹窗提示内容最大高度
               if (self.settings.contentScroll) {
                   self._setDialogContentHeight();
               }

            },
            //confirm型显示
            _createDialogConfirmTypeDOM(self, confirmType) {
                // 添加 confirm 类型弹窗标识
                self.$dialog.addClass('dialog-modal');

                // 显示遮罩层
                if (self.settings.overlayShow) {
                    self.$dialog.append(self.$dialogOverlay);
                }
                // 显示标题
                if (self.settings.titleShow) {
                    self.$dialogContent.append(self.$dialogTitle);
                }
                // 显示关闭按钮
                if (self.settings.closeBtnShow) {
                    self.$dialogTitle.append(self.$closeBtn);
                }

                // 按钮: 如果有设置自定义按钮组, 则用自定义按钮组; 否则用默认的"确定"与"取消"按钮
                if (self.settings.buttons.length) {
                    var buttonGroupHtml = '';
                    $.each(self.settings.buttons, function (index, item) {
                        buttonGroupHtml += '<button class="dialog-btn ' + item.class + '">' + item.name + '</button>';

                    });
                    self.$dialogContentFt.append(buttonGroupHtml).addClass(self.settings.buttonStyle);
                } else {
                    self.$dialogContentFt.append(self.$cancelBtn).append(self.$confirmBtn).addClass(self.settings.buttonStyle);
                }

                self.$dialogContentBd.html(self.settings.content);
                self.$dialogContent.append(self.$dialogContentBd).append(self.$dialogContentFt);
                self.$dialog.append(self.$dialogContent);
                $('body').append(self.$dialog);

                // 设置弹窗提示内容最大高度
                if (self.settings.contentScroll) {
                    self._setDialogContentHeight();
                }

                if (self.settings.bodyNoScroll) {
                    $('body').addClass('body-no-scroll');
                }

            },
            //toast型显示
            _createDialogToastTypeDOM(self, toastType) {
                // 添加 toast 类型弹窗标识
                self.$dialog.addClass('dialog-toast');

                // 显示遮罩层
                if (self.settings.overlayShow) {
                    self.$dialog.append(self.$dialogOverlay);
                }

                // 弹窗内容 HTML, 默认为 content; 如果设置 icon 与 text, 则覆盖 content 的设置
                
                var toastContentHtmlStr = ''
                if(self.settings.content){
                    toastContentHtmlStr  =self.settings.content
                }else{
                    var iconfontValue="";
                    var color = "";
                    switch(toastType){
                        case 'error':
                            iconfontValue = "icon-failure_toast";
                            color="#d81e06";
                            break;
                        case 'warning':
                            iconfontValue = "icon-alert_toast";
                            color="#f4ea2a";
                            break;
                        case 'info':
                            iconfontValue = "icon-info";
                            color="#1296db";
                            break;
                        case 'success':
                            iconfontValue = "icon-success_toast";
                            color="#58b20f";
                            break;
                        case 'question':
                            iconfontValue = "icon-question";
                            color="#13227a";
                            break;
                        case 'busy':
                            iconfontValue = "icon-busy_toast";
                            color="#d81e06";
                            break;
                        case 'wind':
                            iconfontValue = "icon-windcontrol";
                            color="#d81e06";
                            break;
                        default:
                            break;
                    }
                    if(iconfontValue!==""){
                        toastContentHtmlStr += '<img class="info-icon iconfont '+iconfontValue+'" style="color:'+color+';"  />';
                    }else if (self.settings.infoIcon !== '' ) {
                        toastContentHtmlStr += '<img class="info-icon" src="' + self.settings.infoIcon + '" />';
                    }
                    if ( self.settings.infoText !== '') {
                        toastContentHtmlStr += '<span class="info-text">' + self.settings.infoText + '</span>';
                    }
                } 
                var toastContentHtml = $(toastContentHtmlStr);
                self.$dialogContentBd.append(toastContentHtml);
                self.$dialogContent.append(self.$dialogContentBd);
                self.$dialog.append(self.$dialogContent);
                $('body').append(self.$dialog);

                if (self.settings.bodyNoScroll) {
                    $('body').addClass('body-no-scroll');
                }
            },
            //notice型显示
            _createDialogNoticeTypeDOM(self, noticeType) {
                // 添加 toast 类型弹窗标识
                self.$dialog.addClass('dialog-notice');

                // 底部显示的 toast
                if (self.settings.position === 'bottom') {
                    self.$dialog.addClass('dialog-notice-bottom');
                }

                // 显示遮罩层
                if (self.settings.overlayShow) {
                    self.$dialog.append(self.$dialogOverlay);
                }

                // 弹窗内容 HTML, 默认为 content; 如果设置 icon 与 text, 则覆盖 content 的设置
                var noticeContentHtml = $(self.settings.content);

                if (self.settings.infoIcon !== '' && self.settings.infoText !== '') {
                    noticeContentHtml = $('<img class="info-icon" src="' + self.settings.infoIcon + '" /><span class="info-text">' + self.settings.infoText + '</span>');
                } else if (self.settings.infoIcon === '' && self.settings.infoText !== '') {
                    noticeContentHtml = $('<span class="info-text">' + self.settings.infoText + '</span>');
                } else if (self.settings.infoIcon !== '' && self.settings.infoText === '') {
                    noticeContentHtml = $('<img class="info-icon" src="' + self.settings.infoIcon + '" />');
                }

                self.$dialogContentBd.append(noticeContentHtml);
                self.$dialogContent.append(self.$dialogContentBd);
                self.$dialog.append(self.$dialogContent);
                $('body').append(self.$dialog);

                if (self.settings.bodyNoScroll) {
                    $('body').addClass('body-no-scroll');
                }
            },
            /**
             * 设置弹窗内容最大高度
             * 延迟执行, 避免获取相关尺寸不正确
             */
            _setDialogContentHeight: function () {
                var self = this;

                setTimeout(function () {
                    var dialogDefaultContentHeight = self.$dialogContentBd.height();
                    var dialogContentMaxHeight = self._getDialogContentMaxHeight();

                    self.$dialogContentBd.css({
                        'max-height': dialogContentMaxHeight,
                    }).addClass('content-scroll');

                    // 提示内容大于最大高度时, 添加底部按钮顶部边框线标识 class; 反之, 删除
                    if (dialogDefaultContentHeight > dialogContentMaxHeight) {
                        self.$dialogContentFt.addClass('dialog-content-ft-border');
                    } else {
                        self.$dialogContentFt.removeClass('dialog-content-ft-border');
                    }

                }, 80);
            },

            /**
             * 获取弹窗内容最大高度
             * @return height
             */
            _getDialogContentMaxHeight: function () {
                var self = this;
                var winHeight = $(window).height(),
                    dialogContentHdHeight = self.$dialogTitle.height(),
                    dialogContentFtHeight = self.$dialogContentFt.height(),
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
                $(document)
                    .on('touchstart mousedown', '.content-scroll', function (ev) {
                        var touch = ev.changedTouches ? ev.changedTouches[0] : ev;

                        isTouchDown = true;
                        position.x = touch.clientX;
                        position.y = touch.clientY;
                        position.top = $(this).scrollTop();
                        position.left = $(this).scrollLeft();
                        return false;
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

                            $(this).scrollTop(moveTop).scrollLeft(moveLeft);
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
                self.$dialog.addClass('dialog-close').removeClass('dialog-open');

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

                self.$dialog.remove();
                self.isHided = false;
                self.settings.onClosed();
                // 重新初始化默认配置
                self.settings = dialog_defaults;

                if (self.settings.bodyNoScroll) {
                    $('body').removeClass('body-no-scroll');
                }
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
                self.settings = Object.assign(dialog_defaults, settings);

                // 通过 content 更改弹窗内容
                if (self.settings.content !== '') {
                    self.$dialogContentBd.html(self.settings.content);
                }

                // 通过设置 infoIcon 与 infoText 更改弹窗内容, 会覆盖 content 的设置
                var $infoIcon = self.$dialogContentBd.find('.info-icon');
                var $infoText = self.$dialogContentBd.find('.info-text');
                $infoIcon.attr({ 'src': self.settings.infoIcon });
                $infoText.html(self.settings.infoText);

                // 重新为更改后的 DOM 元素绑定事件
                self._bindEvents();
            },

            /**
             * 是否有点透 BUG 
             * 条件: 安卓手机并且版本号小于4.4
             * @return Boolean
             */
            _hasTapBug: function () {
                return false;// mobileUtil.isAndroid && (mobileUtil.version < 4.4);
            },

            /**
             * 添加点透遮罩层, 解决点透 BUG
             */
            _appendTapOverlayer: function () {
                var self = this;

                self.$tapBugOverlayer = $('.solve-tap-bug');

                if (!self.$tapBugOverlayer.length) {
                    self.$tapBugOverlayer = $('<div class="solve-tap-bug" style="margin:0;padding:0;border:0;background:rgba(0,0,0,0);-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;height:100%;position:fixed;top:0;left:0;"></div>');
                    $('body').append(self.$tapBugOverlayer);
                }
            },

            /**
             * 删除点透遮罩层, 延迟执行的时间大于移动端的 click 触发时间
             */
            _removeTapOverlayer: function () {
                var self = this;

                setTimeout(function () {
                    self.$tapBugOverlayer.remove();
                }, 350);
            }
        };

        return Dialog;
    })();

    /**----------------------------
     *  私有方法
     ----------------------------*/
    /** 
     * 移动端相关数据 =>> mobileUtil 对象
     * 是否是安卓  : isAndroid
     * 是否是IOS   : isIOS
     * 是否是移动端: isMobile
     * 设备平台    : platform [ ios 或 android ]
     * 事件类型    : tapEvent [ tapEvent 或 click ]
     * 系统版本号  : version [ 如: ios 9.1 或 andriod 6.0 ]
     * 是否支持 touch 事件: isSupportTouch
     */
    var mobileUtil = (function (window) {
        var UA = window.navigator.userAgent,
            isAndroid = /android|adr/gi.test(UA),
            isIOS = /iphone|ipod|ipad/gi.test(UA) && !isAndroid,
            isWXBrowser = /micromessenger|wechat/gi.test(UA),
            isWXMiniApp = /miniprogram/gi.test(UA),
            isAlipayclient = /alipayclient/gi.test(UA),
            isMobile = isAndroid || isIOS || isWXBrowser || isWXMiniApp || isAlipayclient,
            platform = isIOS ? 'ios' :
                (isAndroid ? 'android' :
                    (isWXBrowser ? 'wxBrowser' :
                        (isWXMiniApp ? 'wxMiniApp' :
                            (isAlipayclient ? 'alipayclient' : 'default')))),
            isSupportTouch = "ontouchend" in document ? true : false;

        // var reg = isIOS ? (/os [\d._]*/gi):(/android [\d._]*/gi),
        //     verinfo = UA.match(reg),
        //     version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");

        return {
            isIOS: isIOS,
            isAndroid: isAndroid,
            isWXBrowser: isWXBrowser,
            isWXMiniApp: isWXMiniApp,
            isAlipayclient: isAlipayclient,
            isMobile: isMobile,
            platform: platform,
            // version: parseFloat(version),
            isSupportTouch: isSupportTouch,
            tapEvent: isMobile && isSupportTouch ? 'tapEvent' : 'click'
        };
    })(window);


    $.fn.dialog = function (options) {
        var self = this;

        return this.each(function () {
            var $this = $(this),
                instance = window.jQuery ? $this.data('dialog') : $.fn.dialog.lookup[$this.data('dialog')];
            var obj;
            if (!instance) {
                obj = new Dialog(this, options);
                obj._init();

                if (window.jQuery) {
                    $this.data('dialog', obj);
                } else {
                    $.fn.dialog.lookup[++$.fn.dialog.lookup.i] = obj;
                    $this.data('dialog', $.fn.dialog.lookup.i);
                    instance = $.fn.dialog.lookup[$this.data('dialog')];
                }
            } else {
                obj = new Dialog(this, options);
                obj._init();
            }

            if (typeof options === 'string') { instance[options](); }

            // 提供外部调用公共方法
            self.close = function () {
                obj.closeDialog();
            };

            self.update = function (settings) {
                obj.update(settings);
            };
        });
    };

    if (!window.jQuery) { $.fn.dialog.lookup = { i: 0 }; }


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
        infoText: '',        // toast 与 notice 弹窗的提示文字, 会覆盖 content 的设置
        position: 'center',  // notice 弹窗的位置, [ center: 居中; bottom: 底部 ]

        onClickConfirmBtn: function () { },  // “确定”按钮的回调函数
        onClickCancelBtn: function () { },  // “取消”按钮的回调函数
        onClickCloseBtn: function () { },  // “关闭”按钮的回调函数
        onBeforeShow: function () { },  // 弹窗显示前的回调函数
        onShow: function () { },  // 弹窗显示后的回调函数
        onBeforeClosed: function () { },  // 弹窗关闭前的回调函数
        onClosed: function () { }   // 弹窗关闭后的回调函数
    };

}