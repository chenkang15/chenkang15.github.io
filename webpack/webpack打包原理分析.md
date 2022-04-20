# webpack打包原理分析

Webpack究竟是如何将它们有序地组织在一起，并按照我们预想的顺序运行在浏览器上的呢？下面我们将从原理上进行探究。还是使用前面calculator的例子。

```javascript
// index.js
const calculator = require('./calculator.js');
const sum = calculator.add(2, 3);
console.log('sum', sum);

// calculator.js
module.exports = {
    add: function(a, b) {
        return a + b;
    }
};
```

上面的代码经过Webpack打包后将会成为如下的形式（为了易读性这里只展示代码的大体结构）：

```javascript
// 立即执行匿名函数
(function(modules) {
    //模块缓存
    var installedModules = {};
    // 实现require
    function __webpack_require__(moduleId) {
        ...
    }
    // 执行入口模块的加载
    return __webpack_require__(__webpack_require__.s = 0);
})({
    // modules：以key-value的形式储存所有被打包的模块
    0: function(module, exports, __webpack_require__) {
        // 打包入口
        module.exports = __webpack_require__("3qiv");
    },
    "3qiv": function(module, exports, __webpack_require__) {
        // index.js内容
    },
    jkzz: function(module, exports) {
        // calculator.js 内容
    }
});
```

这是一个最简单的Webpack打包结果（bundle），但已经可以清晰地展示出它是如何将具有依赖关系的模块串联在一起的。上面的bundle分为以下几个部分：

+ 最外层立即执行匿名函数。它用来包裹整个bundle，并构成自身的作用域。·installedModules对象。每个模块只在第一次被加载的时候执行，之后其导出值就被存储到这个对象里面，当再次被加载的时候直接从这里取值，而不会重新执行。
+ __webpack_require__函数。对模块加载的实现，在浏览器中可以通过调用__webpack_require__(module_id)来完成模块导入。
+ modules对象。工程中所有产生了依赖关系的模块都会以key-value的形式放在这里。key可以理解为一个模块的id，由数字或者一个很短的hash字符串构成；value则是由一个匿名函数包裹的模块实体，匿名函数的参数则赋予了每个模块导出和导入的能力。

接下来让我们看看一个bundle是如何在浏览器中执行的。

1. 在最外层的匿名函数中会初始化浏览器执行环境，包括定义installedModules对象、__webpack_require__函数等，为模块的加载和执行做一些准备工作。
2. 加载入口模块。每个bundle都有且只有一个入口模块，在上面的示例中，index.js是入口模块，在浏览器中会从它开始执行。
3. 执行模块代码。如果执行到了module.exports则记录下模块的导出值；如果中间遇到require函数（准确地说是__webpack_require__），则会暂时交出执行权，进入__webpack_require__函数体内进行加载其他模块的逻辑。
4. 在__webpack_require__中会判断即将加载的模块是否存在于installedModules中。如果存在则直接取值，否则回到第3步，执行该模块的代码来获取导出值。
5. 所有依赖的模块都已执行完毕，最后执行权又回到入口模块。当入口模块的代码执行到结尾，也就意味着整个bundle运行结束。

不难看出，第3步和第4步是一个递归的过程。Webpack为每个模块创造了一个可以导出和导入模块的环境，但本质上并没有修改代码的执行逻辑，因此代码执行的顺序与模块加载的顺序是完全一致的，这就是Webpack模块打包的奥秘。




