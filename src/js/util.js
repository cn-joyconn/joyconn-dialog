export function loadJS(url, callback, render) {
  const loaderScript = document.createElement('script');
  loaderScript.type = 'text/javascript';
  loaderScript.src = url;
  loaderScript.addEventListener('load', () => {
    if (callback) {
      callback();
    }
    if (render) {
      Store.set('LT:render', true);
    }
  });

  document.body.appendChild(loaderScript);
}


  /**----------------------------
   *  私有方法
   ----------------------------*/
  /** 
   * 移动端相关数据 =>> mobileUtil 对象
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
export function mobileUtil(window) {
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
}