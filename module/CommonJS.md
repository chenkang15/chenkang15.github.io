# CommonJS

## CommonJS 背景
CommonJS是由JavaScript社区于2009年提出的包含模块、文件、IO、控制台在内的一系列标准。在Node.js的实现中采用了CommonJS标准的一部分，并在其基础上进行了一些调整。我们所说的CommonJS模块和Node.js中的实现并不完全一样，现在一般谈到CommonJS其实是Node.js中的版本，而非它的原始定义。

CommonJS最初只为服务端而设计，直到有了Browserify——一个运行在Node.js环境下的模块打包工具，它可以将CommonJS模块打包为浏览器可以运行的单个文件。这意味着客户端的代码也可以遵循CommonJS标准来编写了。

## CommonJS 特性

### 1. 独立作用域

CommonJS 规定每个文件是一个模块，通过利用**闭包**创建一个独属于模块自身的作用域，所有的变量及函数只有自己能访问，对外不可见，不会污染全局环境。而常规js的顶层作用域是全局作用域，声明的变量或者函数会污染环境。

```javascript
// calculator.js
var name = 'calculator.js';

// index.js
var name = 'index.js';
require('./calculator.js');
console.log(name); // index.js
```

运行之后控制台结果是“index.js”，这说明calculator.js中的变量声明并不会影响index.js，可见每个模块是拥有各自的作用域的。

### 2. 导出变量或者函数

导出是一个模块向外暴露自身的唯一方式。在CommonJS中，通过`module.exports` 或 `export`可以导出模块中的内容，如：

```javascript
// module.exports 导出 name 属性和 add 函数
module.exports = {
    name: 'calculater',
    add: function(a, b) {
        return a + b;
    }
};

// exports 导出 name 属性和 add 函数
exports.name = 'calculater';
exports.add = function(a, b) {
    return a + b;
};

```

module.exports用来指定该模块要对外暴露哪些内容，export 是module.export 的简化的导出方式。CommonJS模块内部会有一个module对象用于存放当前模块的信息，可以理解成在每个模块的最开始定义了以下对象：

```javascript
var module = {
    exports: {},
};
var exports = module.exports;
```

因此，为exports.add赋值相当于在module.exports对象上添加了一个属性。

#### CommonJS导出注意事项

1. 在使用exports时要注意一个问题，即**不要直接给exports赋值**，否则会导致其失效。如：

```javascript
exports = {
    name: 'calculater'
};
```

由于对exports进行了赋值操作，使其指向了新的对象，module.exports却仍然是原来的空对象，因此name属性并不会被导出。

2. module.exports与exports 尽量不混用，混用时，不恰当的导出顺序会导致部分 export 导出无效

```javascript
exports.add = function(a, b) {
    return a + b;
};
module.exports = {
    name: 'calculater'
};
```

上面的代码先通过exports导出了add属性，然后将module.exports重新赋值为另外一个对象。这会导致原本拥有add属性的对象丢失了，最后导出的只有name。

3. **导出语句不代表模块的末尾**，在module.exports或exports后面的代码依旧会照常执行。比如下面的console会在控制台上打出“end”：

```javascript
module.exports = {
    name: 'calculater'
};
console.log('end');
```

在实际使用中，为了提高可读性，不建议采取上面的写法，而是应该将module.exports及exports语句放在模块的末尾。

4. **CommonJS导出的其实是一个对象！！！**

### 3. 导入

导入在CommonJS中使用require进行模块导入。如：

```javascript
// calculator.js
module.exports = {

    add: function(a, b) {return a + b;}

};

// index.js
const calculator = require('./calculator.js');

const sum = calculator.add(2, 3);

console.log(sum); // 5

```

#### 多次导入统一模块，模块代码只会执行一次

当我们require一个模块时会有两种情况：

+ require的模块是第一次被加载。这时会首先执行该模块，然后导出内容。
+ require的模块曾被加载过。这时该模块的代码不会再次执行，而是直接导出上次执行后得到的结果。

请看下面的例子：

```javascript
// calculator.js
console.log('running calculator.js');

module.exports = {

    name: 'calculator',

    add: function(a, b) {

        return a + b;

    }

};

// index.js
const add = require('./calculator.js').add;

const sum = add(2, 3);

console.log('sum:', sum);

const moduleName = require('./calculator.js').name;

console.log('end');

/* 
控制台的输出结果如下：
running calculator.js
sum: 5
end
*/
```

从结果可以看到，尽管我们有两个地方require了calculator.js，但其内部代码只执行了一遍。

我们前面提到，**模块会有一个module对象用来存放其信息，这个对象中有一个属性loaded用于记录该模块是否被加载过。它的值默认为false，当模块第一次被加载和执行过后会置为true，后面再次加载时检查到module.loaded为true，则不会再次执行模块代码。**

有时我们加载一个模块，不需要获取其导出的内容，只是想要通过执行它而产生某种作用，比如把它的接口挂在全局对象上，此时直接使用require即可。

```javascript
require('./task.js');
```

#### require函数可以接收表达式，借助这个特性我们可以动态地指定模块加载路径。

```javascript
const moduleNames = ['foo.js', 'bar.js'];

moduleNames.forEach(name => {

    require('./' + name);

});
```

####  导入的变量是导出对象的赋值，值的赋值（记住，这个必考）或者说是对应加载模块module.exports引用的赋值

上文说到，CommonJS模块内部会有一个module对象用于存放当前模块的信息，有一个标志位用来记录当前模块是否被加载过。所以可以理解成在每个模块的最开始定义了以下对象：

```javascript
var module = {
    exports: {},
    loaded: false, // 用来标志当前模块是否被加载过，加载后修改为true
};
var exports = module.exports;
----------------------------------
const xxxModule = require('xxx');
// require 做了两件事
// 1. 加载xxx模块，如果xxx模块的 loaded = true，跳过这一步
// 2. 将xxx模块暴露的对象，即module.exports对象赋值给xxxModule，即 xxxModule = require('xxx'); => xxxModule = module.exports，所以 module.exports 和 xxxModule 其实都指向同一块内存
```

**const xxxModule = require('xxx');**

require 函数，是告诉程序，去加载xxx模块，如果xxx模块存在，在CommonJS规范中，每一个模块都有对应的module对象，module对象上挂载着exports，记录着对外暴露的变量或者函数。module对象上的loaded记录着当前模块的加载状态，如果加载过，即当前模块执行完毕，就把loaded改为true，否则为false。

**require函数会先检查加载模块对象的loaded属性，为true，就把对应模块的module.exports对象赋值给当前模块的对应变量。loaded为false，就让出执行线程，加载对应模块，对应模块执行完后，在把模块的module.exports对象赋值给当前模块的对应变量。**

重要的事情说三遍，重要的事情说三遍，重要的事情说三遍

require 主要做了三件事

1. 检查加载模块的loaded属性，loaded = true，模块加载过，执行第二步
2. 把模块暴露的对象 即 module.exports 赋值给当前模块的对应变量。
3. 如果loaded = false，即当前模块没有加载过，就去加载对应模块，模块加载后，执行完毕后的 loaded = true，执行第二步

```javascript
// calculator.js
var count = 0;
var num = 0;
var user = {
    name: 'ck'
}

// 可以对比查看模块实际修改的值
// setTimeout(() => {
//     console.log(count, num, module.exports); // 1 0 { count: 0, num: 1, user: { name: 'ccck' }, ... }
// }, 1000);

module.exports = {
    count: count,
    num: num,
    add: function(a, b) {
        count ++;
        module.exports.num ++;
        return a + b;
    },
    user: user,
    modify: function() {
     user.name = 'ckk';
    }
};

-------------------------------------------
// index.js  
var calcModule = require('./calculator.js');
var count = require('./calculator.js').count;
var num = require('./calculator.js').num;
var add = require('./calculator.js').add;

console.log(count); // 0（这里的count是对 calculator.js 中 count 值的拷贝）
console.log(num); // 0（这里的num是对 calculator.js 中 num 值的拷贝）
console.log(calcModule.count, calcModule.num); // 而实际导入的是一个对象，module.exports对象

add(2, 3); // add 函数 修改 calculator.js 中的 count值，和 module.exports 暴露对象中的 nums值

console.log(count); // 0（calculator.js中变量值的改变不会对这里的拷贝值造成影响）
console.log(num); // 0（add 修改的是 module.exports 暴露对象中的 nums值，所以对拷贝值，和 calculator.js中 num 变量值都没有影响）
console.log(calcModule.count, calcModule.num); // 0 1（add 函數 修改count变量值，和 module.exports 暴露对象中的 num 值。）

count += 1;
console.log(count); // 1（拷贝的值可以更改，但和 calculator.js count变量，导出对象中的 count 没有关系了）

var user = require("./calculator.js").user
var modify = require("./calculator.js").modify

console.log(user); // { name: 'ck' }（这里的user和 calculator.js 中的 user指向同一块内存地址）
modify();
console.log(user); // { name: 'ckk' }（所以修改user后，所有的指向这一地址的变量都会同步发生变化）
user.name = 'ccck';
console.log(user); // { name: 'ccck' }（拷贝的对象值也指向同一地址，所以在导入模块中修改也会影响 calculator.js 中的 user 对象）

```
