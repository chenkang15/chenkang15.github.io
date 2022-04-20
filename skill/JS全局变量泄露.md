# 查找全局变量泄露

[找出哪些 JavaScript 变量泄漏到全局范围内](https://mmazzarolo.com/blog/2022-02-14-find-what-javascript-variables-are-leaking-into-the-global-scope/)

简而言之，就是通过创建一个新的window对象，获取这个新window对象上的所有的属性。这个属性列表，就是原生window属性，然后判断当前属性若不在这个原生属性列表中存在，就是新创建的全局属性。

```javascript

/**
 * RuntimeGlobalsChecker
 * 
 * You can use this utility to quickly check what variables have been added (or
 * leaked) to the global window object at runtime (by JavaScript code). 
 * By running this code, the globals checker itself is attached as a singleton
 * to the window object as "__runtimeGlobalsChecker__". 
 * You can check the runtime globals programmatically at any time by invoking
 * "window.__runtimeGlobalsChecker__.getRuntimeGlobals()".
 * 
 */
window.__runtimeGlobalsChecker__ = (function createGlobalsChecker() {
  // Globals on the window object set by default by the browser.
  // We collect them to then filter them out of from the list of globals (since
  // we don't care about them).
  // They're populated by "collectBrowserGlobals()" and will contain globals such
  // as "location" and "localStorage".
  let browserGlobals = [];

  // Known globals on the window object that we can safely ignored.
  // This list should be populated manually after trial and errors.
  const ignoredGlobals = ["__runtimeGlobalsChecker__"];

  /**
   * Collect the global variables added to the window object by the browser by
   * creating a temporary iframe and checking what global variables the browser
   * adds on it.
   * @returns {string[]} - List of globals added added by the browser
   */
  function collectBrowserGlobals() {
    const iframe = window.document.createElement("iframe");
    iframe.src = "about:blank";
    window.document.body.appendChild(iframe);
    browserGlobals = Object.keys(iframe.contentWindow);
    window.document.body.removeChild(iframe);
    return browserGlobals;
  }

  /**
   * Return the list of globals added at runtime (by JavaScript).
   * @returns {string[]} - List of globals added at runtime (by JavaScript)
   */
  function getRuntimeGlobals() {
    // If we haven't collected the browser globals yet, do it now.
    if (browserGlobals.length === 0) {
      collectBrowserGlobals();
    }
    // Grab all the globals filtering out variables we don't care about (noise).
    const runtimeGlobals = Object.keys(window).filter((key) => {
      const isFromBrowser = browserGlobals.includes(key);
      const isIgnored = ignoredGlobals.includes(key);
      return !isFromBrowser && !isIgnored;
    });
    return runtimeGlobals;
  }

  return {
    getRuntimeGlobals,
  };
})();

```