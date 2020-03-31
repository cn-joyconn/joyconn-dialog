!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.MA=n():t.MA=n()}(window,function(){return function(t){var n={};function o(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,o),i.l=!0,i.exports}return o.m=t,o.c=n,o.d=function(t,n,e){o.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,n){if(1&n&&(t=o(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(o.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var i in t)o.d(e,i,function(n){return t[n]}.bind(null,i));return e},o.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(n,"a",n),n},o.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},o.p="",o(o.s=0)}({0:function(t,n,o){"use strict";o.r(n),o.d(n,"JoyDialog",function(){return a});o(1);var e=function(t){var n=t.navigator.userAgent,o=/android|adr/gi.test(n),e=/iphone|ipod|ipad/gi.test(n)&&!o,i=/micromessenger|wechat/gi.test(n),s=/miniprogram/gi.test(n),a=/alipayclient/gi.test(n),l=o||e||i||s||a,c="ontouchend"in document;return{isIOS:e,isAndroid:o,isWXBrowser:i,isWXMiniApp:s,isAlipayclient:a,isMobile:l,platform:e?"ios":o?"android":i?"wxBrowser":s?"wxMiniApp":a?"alipayclient":"default",isSupportTouch:c,tapEvent:l&&c?"tapEvent":"click"}}(window);const i={type:"alert",style:"default",titleShow:!0,titleText:"提示",bodyNoScroll:!1,closeBtnShow:!1,content:"",contentScroll:!0,dialogClass:"",autoClose:0,overlayShow:!0,overlayClose:!1,buttonStyle:"side",buttonTextConfirm:"确定",buttonTextCancel:"取消",buttonClassConfirm:"",buttonClassCancel:"",buttons:[],infoIcon:"",infoText:"",position:"center",onClickConfirmBtn:function(){},onClickCancelBtn:function(){},onClickCloseBtn:function(){},onBeforeShow:function(){},onShow:function(){},onBeforeClosed:function(){},onClosed:function(){}};function s(t){this.settings={},Object.assign(this.settings,i,t)}s.prototype={_init:function(){if(console.log("初始化弹窗"),clearTimeout(this.autoCloseTimer),this.isHided=!1,this.tapBug=this._hasTapBug(),this.platform=e.platform,this.dislogStyle="default"===this.settings.style?e.isMobile?"default":"pc":this.settings.style,0===$("#dialog-body-no-scroll").length){$("head").append('<style id="dialog-body-no-scroll">.body-no-scroll { position: absolute; overflow: hidden; width: 100%; }</style>')}this._renderDOM(),this._bindEvents()},_renderDOM:function(){this.settings.onBeforeShow(),this._createDialogDOM(this.settings.type),this.settings.onShow()},_bindEvents:function(){var t=this;t.$confirmBtn.on(e.tapEvent,function(n){var o=t.settings.onClickConfirmBtn();(o||void 0===o)&&t.closeDialog()}).on("touchend",function(t){t.preventDefault()}),t.$cancelBtn.on(e.tapEvent,function(n){var o=t.settings.onClickCancelBtn();(o||void 0===o)&&t.closeDialog()}).on("touchend",function(t){t.preventDefault()}),t.$closeBtn.on(e.tapEvent,function(n){var o=t.settings.onClickCloseBtn();(o||void 0===o)&&t.closeDialog()}).on("touchend",function(t){t.preventDefault()}),t.settings.overlayClose&&$(document).on(e.tapEvent,".dialog-overlay",function(n){t.closeDialog()}),t.settings.autoClose>0&&(console.log(t.settings.autoClose/1e3+"秒后, 自动关闭弹窗"),t._autoClose()),$(document).on("webkitAnimationEnd MSAnimationEnd animationend",".dialog-content",function(){t.isHided&&(t.removeDialog(),t.tapBug&&t._removeTapOverlayer())}),t.settings.buttons.length&&$.each(t.settings.buttons,function(n,o){t.$dialogContentFt.children("button").eq(n).on(e.tapEvent,function(n){n.preventDefault();var e=o.callback();(e||void 0===e)&&t.closeDialog()})}),$(window).on("onorientationchange"in window?"orientationchange":"resize",function(){t.settings.contentScroll&&setTimeout(function(){t._resetDialog()},200)}),$(document).on("touchmove",function(n){return!t.$dialog.find($(n.target)).length}),t.settings.contentScroll&&t._contentScrollEvent()},_createDialogDOM:function(t){switch(this.$dialog=$('<div class="jdialog dialog-open '+this.settings.dialogClass+'" data-style="'+this.dislogStyle+'"></div>'),this.$dialogOverlay=$('<div class="dialog-overlay"></div>'),this.$dialogContent=$('<div class="dialog-content"></div>'),this.$dialogTitle=$('<div class="dialog-content-hd"><h3 class="dialog-content-title">'+this.settings.titleText+"</h3></div>"),this.$dialogContentFt=$('<div class="dialog-content-ft"></div>'),this.$dialogContentBd=$('<div class="dialog-content-bd"></div>'),this.$closeBtn=$('<div class="dialog-btn-close"><span>close</span></div>'),this.$confirmBtn=$('<button class="dialog-btn dialog-btn-confirm '+this.settings.buttonClassConfirm+'">'+this.settings.buttonTextConfirm+"</button>"),this.$cancelBtn=$('<button class="dialog-btn dialog-btn-cancel '+this.settings.buttonClassCancel+'">'+this.settings.buttonTextCancel+"</button>"),t){case"alert":this._createDialogAlertTypeDOM(this,t);break;case"toast":case"error":case"warning":case"info":case"success":case"question":case"busy":case"wind":this._createDialogToastTypeDOM(this,t);break;case"notice":this._createDialogNoticeTypeDOM(this,t);break;default:console.log("running default")}},_createDialogAlertTypeDOM(t,n){if(t.$dialog.addClass("dialog-modal"),t.settings.overlayShow&&t.$dialog.append(t.$dialogOverlay),t.settings.titleShow&&t.$dialogContent.append(t.$dialogTitle),t.settings.closeBtnShow&&t.$dialogTitle.append(t.$closeBtn),t.settings.buttons.length){var o="";$.each(t.settings.buttons,function(t,n){o+='<button class="dialog-btn '+n.class+'">'+n.name+"</button>"}),t.$dialogContentFt.append(o).addClass(t.settings.buttonStyle)}t.settings.buttonTextCancel&&t.$dialogContentFt.append(t.$cancelBtn).addClass(t.settings.buttonStyle),t.settings.buttonTextConfirm&&t.$dialogContentFt.append(t.$confirmBtn).addClass(t.settings.buttonStyle),t.$dialogContentBd.append(t.settings.content),t.$dialogContent.append(t.$dialogContentBd).append(t.$dialogContentFt),t.$dialog.append(t.$dialogContent),$("body").append(t.$dialog),t.settings.bodyNoScroll&&$("body").addClass("body-no-scroll"),t.settings.contentScroll&&t._setDialogContentHeight()},_createDialogToastTypeDOM(t,n){t.$dialog.addClass("dialog-toast"),t.settings.overlayShow&&t.$dialog.append(t.$dialogOverlay);var o="";if(t.settings.content)o=t.settings.content;else{var e="",i="";switch(n){case"error":e="icon-failure_toast",i="#d81e06";break;case"warning":e="icon-alert_toast",i="#f4ea2a";break;case"info":e="icon-info",i="#1296db";break;case"success":e="icon-success_toast",i="#58b20f";break;case"question":e="icon-question",i="#13227a";break;case"busy":e="icon-busy_toast",i="#d81e06";break;case"wind":e="icon-windcontrol",i="#d81e06"}""!==e?o+='<img class="info-icon iconfont '+e+'" style="color:'+i+';"  />':""!==t.settings.infoIcon&&(o+='<img class="info-icon" src="'+t.settings.infoIcon+'" />'),""!==t.settings.infoText&&(o+='<span class="info-text">'+t.settings.infoText+"</span>")}var s=$(o);t.$dialogContentBd.append(s),t.$dialogContent.append(t.$dialogContentBd),t.$dialog.append(t.$dialogContent),$("body").append(t.$dialog),t.settings.bodyNoScroll&&$("body").addClass("body-no-scroll")},_createDialogNoticeTypeDOM(t,n){t.$dialog.addClass("dialog-notice"),"bottom"===t.settings.position&&t.$dialog.addClass("dialog-notice-bottom"),t.settings.overlayShow&&t.$dialog.append(t.$dialogOverlay);var o=$(t.settings.content);""!==t.settings.infoIcon&&""!==t.settings.infoText?o=$('<img class="info-icon" src="'+t.settings.infoIcon+'" /><span class="info-text">'+t.settings.infoText+"</span>"):""===t.settings.infoIcon&&""!==t.settings.infoText?o=$('<span class="info-text">'+t.settings.infoText+"</span>"):""!==t.settings.infoIcon&&""===t.settings.infoText&&(o=$('<img class="info-icon" src="'+t.settings.infoIcon+'" />')),t.$dialogContentBd.append(o),t.$dialogContent.append(t.$dialogContentBd),t.$dialog.append(t.$dialogContent),$("body").append(t.$dialog),t.settings.bodyNoScroll&&$("body").addClass("body-no-scroll")},_setDialogContentHeight:function(){var t=this;setTimeout(function(){var n=t.$dialogContentBd.height(),o=t._getDialogContentMaxHeight();t.$dialogContentBd.css({"max-height":o}).addClass("content-scroll"),n>o?t.$dialogContentFt.addClass("dialog-content-ft-border"):t.$dialogContentFt.removeClass("dialog-content-ft-border")},80)},_getDialogContentMaxHeight:function(){var t=$(window).height()-this.$dialogTitle.height()-this.$dialogContentFt.height()-60;return t=t%2==0?t:t-1},_resetDialog:function(){this._setDialogContentHeight()},_contentScrollEvent:function(){var t=!1,n={x:0,y:0,top:0,left:0};$(document).on("touchstart mousedown",".content-scroll",function(o){var e=o.changedTouches?o.changedTouches[0]:o;t=!0,n.x=e.clientX,n.y=e.clientY,n.top=$(this).scrollTop(),n.left=$(this).scrollLeft()}).on("touchmove mousemove",".content-scroll",function(o){var e=o.changedTouches?o.changedTouches[0]:o;if(!t)return!1;var i=n.top-(e.clientY-n.y),s=n.left-(e.clientX-n.x);$(this).scrollTop(i).scrollLeft(s)}).on("touchend mouseup",".content-scroll",function(n){n.preventDefault(),t=!1})},_autoClose:function(){var t=this;t.autoCloseTimer=setTimeout(function(){t.closeDialog()},t.settings.autoClose)},closeDialog:function(){this.isHided=!0,this.settings.onBeforeClosed(),this.$dialog.addClass("dialog-close").removeClass("dialog-open"),this.tapBug&&this._appendTapOverlayer()},removeDialog:function(){this.$dialogContent.html(""),this.$dialog.remove(),this.isHided=!1,this.settings.onClosed(),this.settings=i,this.settings.bodyNoScroll&&$("body").removeClass("body-no-scroll")},update:function(t){clearTimeout(this.autoCloseTimer),this.settings=Object.assign(i,t),""!==this.settings.content&&(this.$dialogContentBd.html(""),this.$dialogContentBd.append(this.settings.content));var n=this.$dialogContentBd.find(".info-icon"),o=this.$dialogContentBd.find(".info-text");n.attr({src:this.settings.infoIcon}),o.html(this.settings.infoText),this._bindEvents()},_hasTapBug:function(){return!1},_appendTapOverlayer:function(){this.$tapBugOverlayer=$(".solve-tap-bug"),this.$tapBugOverlayer.length||(this.$tapBugOverlayer=$('<div class="solve-tap-bug" style="margin:0;padding:0;border:0;background:rgba(0,0,0,0);-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;height:100%;position:fixed;top:0;left:0;"></div>'),$("body").append(this.$tapBugOverlayer))},_removeTapOverlayer:function(){var t=this;setTimeout(function(){t.$tapBugOverlayer.remove()},350)}};o(10);function a(t){return function(t){var n=new s(t);n._init(),n.close=function(){n.closeDialog()}}(t)}window.JoyDialog=a},1:function(t,n){},10:function(t,n){}})});