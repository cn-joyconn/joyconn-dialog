/**----------------------------
  *  私有方法
  ----------------------------*/
/** 
 * 移动端相关数据 =>> clientUtil 对象
 * 是否是安卓  : isAndroid
 * 是否是IOS   : isIOS
 * 是否是微信浏览器   : isWXBrowser
 * 是否是微信小程序   : isWXMiniApp
 * 是否是支付宝客户端   : isAlipayclient
 * 是否是移动端: isMobile
 * 设备平台    : platform [ ios 或 android ]
 * 事件类型    : tapEvent [ tapEvent 或 click ]
 * 系统版本号  : version [ 如: ios 9.1 或 andriod 6.0 ]
 * 是否支持 touch 事件: isSupportTouch
 */
export function clientUtil(window) {
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
    isSupportTouch = "ontouchend" in document ? true : false,
    animation = getSupportAnimation()  ;

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
    tapEvent: isMobile && isSupportTouch ? 'tapEvent' : 'click',
    animation:animation
  };
}

export function ObjectAssign(target) {
  if (typeof Object.assign == 'function') {
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        Object.assign(target, source);
      }
    }
  } else {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
  }
  return target;
}

function getSupportAnimation() {
  var animation = false,
    animationstring = 'animation',
    keyframeprefix = '',
    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
    pfx = '',
    elm = document.createElement('div');

  if (elm.style.animationName !== undefined) { animation = true; }

  if (animation === false) {
    for (var i = 0; i < domPrefixes.length; i++) {
      if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
        pfx = domPrefixes[i];
        animationstring = pfx + 'Animation';
        keyframeprefix = '-' + pfx.toLowerCase() + '-';
        animation = true;
        break;
      }
    }
  }
  // setTimeout(function(){
  //   document.removeChild(elm);
  // },10);
  return animation;
}
