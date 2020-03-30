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