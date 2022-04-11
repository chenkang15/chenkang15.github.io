
# CommonJS与ES6 Module的区别
## 1. CommonJS 是 动态 引入模块代码，ES6 Module 是 静态 引入模块代码

CommonJS与ES6 Module最本质的区别在于对于依赖的模块引入的时机不同。

**CommonJS 模块依赖关系的建立发生在代码运行阶段， 即在代码运行阶段 引入 依赖的模块。**

**ES6 Module 模块依赖关系的建立发生在代码编译阶段， 即在代码编译阶段 开始引入依赖的模块。**

让我们先看一个CommonJS的例子：
```
// calculator.js
module.exports = { name: 'calculator' };
// index.js
const name = require('./calculator.js').name;
```
在上面介绍CommonJS的部分时我们提到过，当模块A加载模块B时（在上面的例子中是index.js加载calculator.js），会执行B中的代码，并将其module.exports对象作为require函数的返回值进行返回。并且require的模块路径可以动态指定，支持传入一个表达式，我们甚至可以通过if语句判断是否加载某个模块。因此，在CommonJS模块被执行前，并没有办法确定明确的依赖关系，模块的导入、导出发生在代码的运行阶段。同样的例子，让我们再对比看下ES6 Module的写法：
```
// calculator.js
export const name = 'calculator';
// index.js
import { name } from './calculator.js';
```
ES6 Module的导入、导出语句都是声明式的，它不支持导入的路径是一个表达式，并且导入、导出语句必须位于模块的顶层作用域（比如不能放在if语句中）。因此我们说，ES6 Module是一种静态的模块结构，在ES6代码的编译阶段就可以分析出模块的依赖关系。它相比于CommonJS来说具备以下几点优势：

+ 死代码检测和排除。我们可以用静态分析工具检测出哪些模块没有被调用过。比如，在引入工具类库时，工程中往往只用到了其中一部分组件或接口，但有可能会将其代码完整地加载进来。未被调用到的模块代码永远不会被执行，也就成为了死代码。通过静态分析可以在打包时去掉这些未曾使用过的模块，以减小打包资源体积。
+ 模块变量类型检查。JavaScript属于动态类型语言，不会在代码执行前检查类型错误（比如对一个字符串类型的值进行函数调用）。ES6 Module的静态模块结构有助于确保模块之间传递的值或接口类型是正确的。
+ 编译器优化。在CommonJS等动态模块系统中，无论采用哪种方式，本质上导入的都是一个对象，而ES6 Module支持直接导入变量，减少了引用层级，程序效率更高。

## 2. CommonJS 是值的浅拷贝，ES6 Module是值的动态映射

+ 在导入一个模块时，对于CommonJS来说获取的是一份导出值的浅拷贝；
+ 在ES6Module中则是值的动态映射，并且这个映射是只读的。

### 在导入一个模块时，对于CommonJS来说获取的是一份导出对象的赋值，值的赋值（记住，这个必考）或者说是对应加载模块module.exports引用的赋值；

上面的话直接理解起来可能比较困难，首先让我们来看一个简单的例子，了解一下什么是CommonJS中的值赋值。

```javascript
// calculator.js
var count = 0;
var num = 0;

// 可以对比查看模块实际修改的值
// setTimeout(() => {
//     console.log(count, num, module.exports); // 1 0 { count: 0, num: 1, user: { name: 'ccck' }, ... }
// }, 1000);

module.exports = {
    count: count,
    num: num,
    add: function(a, b) {
        count ++; // 修改变量中的 count 值，不会对导出的 count 值产生影响
        module.exports.num ++; // 修改 导出对象中的 num 值，会影响导出对象，但不会影响 变量中的 num 值
        return a + b;
    },
};

// index.js
var calcModule = require('./calculator.js');
var count = require('./calculator.js').count;
var num = require('./calculator.js').num;
var add = require('./calculator.js').add;

console.log(count); // 0（这里的count是对 calculator.js 中 count 值的拷贝）
console.log(num); // 0（这里的num是对 calculator.js 中 num 值的拷贝）
console.log(calcModule.count, calcModule.num); // 0 0 而实际导入的是一个对象，module.exports对象

add(2, 3); // add 函数 修改 calculator.js 中的 count值，和 module.exports 暴露对象中的 nums值

console.log(count); // 0（calculator.js中变量值的改变不会对这里的拷贝值造成影响）
console.log(num); // 0（add 修改的是 module.exports 暴露对象中的 nums值，所以对拷贝值，和 calculator.js中 num 变量值都没有影响）
console.log(calcModule.count, calcModule.num); // 0 1（add 函數 修改count变量值，和 module.exports 暴露对象中的 num 值。）

count += 1;
console.log(count); // 1（拷贝的值可以更改，但和 calculator.js count变量，导出对象中的 count 没有关系了）
```



index.js中的count是对calculator.js中count的一份值拷贝，因此在调用add函数时，虽然更改了原本calculator.js中 变量 count 的值，但是并不会对index.js中导入时创建的副本造成影响， 也不会对导入的对象 calcModule 中的 count产生影响。而add函数中的 对num 的操作和count不同，没有修改变量中的num，而是直接修改导出对象中的num，因为导入对象 calcModule 是 calculator.js 导出对象 module.exports 的赋值，**calcModule 和 module.exports 是指向同一块内存地址**，所以修改 module.exports 或者 calcModule 都会对对方产生影响。另一方面，**在CommonJS中允许对导入的值进行更改**。我们可以在index.js更改count和add，将其赋予新值。同样，由于是值的拷贝，这些操作不会影响calculator.js本身。

### ES6 Module中导入的变量其实是对原有值的动态映射，并且这个映射是只读的。

下面我们使用ES6 Module将上面的例子进行改写：

```javascript
// calculator.js
let count = 0;
let user = {
    name: 'ck'
}
const add = function(a, b) {
    count += 1;
    return a + b;
};

// es6 module 导出变量 是 原始值 的映射，相当于只有一份数据
// setTimeout(() => {
//     console.log(count, user); // 1 { name: 'ckk' }
// }, 1000)

export { count, add, user };

// index.js
import { count, add, user } from './calculator.js';

console.log(count); // 0（对 calculator.js 中 count 值的映射）
add(2, 3);
console.log(count); // 1（实时反映calculator.js 中 count值的变化）

// count += 1; // 不可更改，会抛出 TypeError: Assignment to constant variable.
console.log(user);
user.name = 'ckk'; // 修改对象的属性是可以的
console.log(user);
```

上面的例子展示了**ES6 Module中导入的变量其实是对原有值的动态映射**。index.js中的count是对calculator.js中的count值的实时反映，当我们通过调用add函数更改了calculator.js中count值时，index.js中count的值也随之变化。我们不可以对ES6 Module导入的变量进行更改，因为**通过 import 导入的变量都相当于 const 定义的变量，不能修改，但是可以修改对象的属性值**，同样因为是映射，所以修改也会反映在原始值上。可以将这种映射关系理解为一面镜子，从镜子里我们可以实时观察到原有的事物，但是并不可以操纵镜子中的影像。

## 3. 循环依赖

循环依赖是指模块A依赖于模块B，同时模块B依赖于模块A。比如下面这个例子：

```javascript
// a.js
import { foo } from './b.js';
foo();

// b.js
import { bar } from './a.js';
bar();
```

一般来说工程中应该尽量避免循环依赖的产生，因为从软件设计的角度来说，单向的依赖关系更加清晰，而循环依赖则会带来一定的复杂度。而在实际开发中，循环依赖有时会在我们不经意间产生，因为当工程的复杂度上升到足够规模时，就容易出现隐藏的循环依赖关系。简单来说，A和B两个模块之间是否存在直接的循环依赖关系是很容易被发现的。但实际情况往往是A依赖于B，B依赖于C，C依赖于D，最后绕了一大圈，D又依赖于A。

当中间模块太多时就很难发现A和B之间存在着隐式的循环依赖。因此，如何处理循环依赖是开发者必须要面对的问题。

### CommonJS中循环依赖

我们首先看一下在CommonJS中循环依赖的例子。

```javascript
// foo.js
const bar = require('./bar.js');
console.log('value of bar:', bar);
module.exports = 'This is foo.js';

// bar.js
const foo = require('./foo.js');
console.log('value of foo:', foo);
module.exports = 'This is bar.js';

// index.js
require('./foo.js');
```

在这里，index.js是执行入口，它加载了foo.js，foo.js和bar.js之间存在循环依赖。让我们观察foo.js和bar.js中的代码，理想状态下我们希望二者都能导入正确的值，并在控制台上输出。

```bash
// 理想状态中的输出
value of foo: This is foo.js
value of bar: This is bar.js
---------------------------------------
// 实际输出
value of foo: {}
value of bar: This is bar.js
```

为什么foo的值会是一个空对象呢？

让我们从头梳理一下代码的实际执行顺序。

1. index.js导入了foo.js，此时开始执行foo.js中的代码。
2. foo.js的第1句导入了bar.js，这时foo.js不会继续向下执行，而是进入了bar.js内部。
3. 在bar.js中又对foo.js进行了require，这里产生了循环依赖。需要注意的是，执行权并不会再交回foo.js，而是直接取其导出值，也就是module.exports。但由于foo.js未执行完毕，导出值在这时为默认的空对象，因此当bar.js执行到打印语句时，我们看到控制台中的value of foo就是一个空对象。
4. bar.js执行完毕，将执行权交回foo.js。
5. foo.js从require语句继续向下执行，在控制台打印出valueof bar（这个值是正确的），整个流程结束。

由上面可以看出，尽管循环依赖的模块均被执行了，但模块导入的值并不是我们想要的。因此在CommonJS中，若遇到循环依赖我们没有办法得到预想中的结果。我们再从Webpack的实现角度来看，将上面例子打包后，bundle中有这样一段代码非常重要：

```javascript
// The require function
function __webpack_require__(moduleId) {
  if(installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }
  // Create a new module (and put it into the cache)
  var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
  };
  
  // excute module function
  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

  // 执行标识 改为 true，webpack4 module.l 执行标识并没有用到
  module.l = true;

  return module.exports;
}
```

当index.js引用了foo.js之后，相当于执行了这个__webpack_require__函数，初始化了一个module对象并放入installedModules中。当bar.js再次引用foo.js时，又执行了该函数，但这次是直接从installedModules里面取值，此时它的module.exports是一个空对象。这就解释了上面在第3步看到的现象。

### ES6 Module中的循环依赖

接下来让我们使用ES6 Module的方式重写上面的例子。

```javascript
// foo.js
import bar from './bar.js';
console.log('value of bar:', bar);
export default 'This is foo.js';

// bar.js
import foo from './foo.js';
console.log('value of foo:', foo);
export default 'This is bar.js';

// index.js
import foo from './foo.js';
```

执行结果如下：

```bash
# 书上说执行结果是这个
value of foo: undefined
foo.js:3 value of bar: This is bar.js
# 实际
ReferenceError: Cannot access 'foo' before initialization
```

很遗憾，在bar.js中同样无法得到foo.js正确的导出值，只不过和CommonJS默认导出一个空对象不同，这里获取到的是undefined? 报错。上面我们谈到，在导入一个模块时，CommonJS获取到的是值的拷贝，ES6 Module则是动态映射，那么我们能否利用ES6Module的特性使其支持循环依赖呢？请看下面这个例子：

```javascript
//index.js
import foo from './foo.js';
foo('index.js');

// foo.js
import bar from './bar.js';
function foo(invoker) {
    console.log(invoker + ' invokes foo.js');
    bar('foo.js');
}
export default foo;

// bar.js
import foo from './foo.js';
let invoked = false;
function bar(invoker) {
    if(!invoked) {
        invoked = true;
        console.log(invoker + ' invokes bar.js');
        foo('bar.js');
    }
}
export default bar;
```

上面代码的执行结果如下：

```bash
index.js invokes foo.js
foo.js invokes bar.js
bar.js invokes foo.js
```

可以看到，foo.js和bar.js这一对循环依赖的模块均获取到了正确的导出值。下面让我们分析一下代码的执行过程。

1. index.js作为入口导入了foo.js，此时开始执行foo.js中的代码。
2. 从foo.js导入了bar.js，执行权交给bar.js。
3. 在bar.js中一直执行到其结束，完成bar函数的定义。注意，此时由于foo.js还没执行完，foo的值现在仍然是undefined。
4. 执行权回到foo.js继续执行直到其结束，完成foo函数的定义。由于ES6 Module动态映射的特性，此时在bar.js中foo的值已经从undefined成为了我们定义的函数，这是与CommonJS在解决循环依赖时的本质区别，CommonJS中导入的是值的拷贝，不会随着被夹在模块中原有值的变化而变化。
5. 执行权回到index.js并调用foo函数，此时会依次执行foo→bar→foo，并在控制台打出正确的值。

实际不是这样，分析，但是可以通过一系列操作，规避循环引用

```javascript
//index.js
import foo from './foo.js';

// foo.js
import bar from './bar.js';
console.log('value of bar:', bar);
export default 'This is foo.js';

// bar.js
import foo from './foo.js';
console.log('value of foo:', foo); // Cannot access 'foo' before initialization
// setTimeout(() => {console.log('value of foo:', foo);}, 1000)
export default 'This is bar.js';
```

在 bar.js 中，如果直接打印 `console.log('value of foo:', foo);`

会报 `ReferenceError: Cannot access 'foo' before initialization` ，而通过 setTimeout异步打印就不会。

分析如下： **导入的模块，在对应导入的模块执行 export default 语句之前，不能使用导入的变量，类似 let const 的暂时性死区。**

1. index.js作为入口导入了foo.js，此时开始执行foo.js中的代码。
2. 从foo.js导入了bar.js，执行权交给bar.js。
3. 在执行bar.js中代码时，使用到foo.js `export default` 导出的变量。 `export default` es6 module 导出的变量类似于 let，const定义，存在暂时性死区，只能先定义，后使用。所以bar.js中使用在定义之前。报错，而通过setTimeout异步打印，就规避了这个错误。同样，通过setTimeout异步执行，也能规避let，const的暂时性死区
4. 在bar.js中一直执行到其结束，完成bar函数的定义。注意，此时由于foo.js还没执行完，foo的值现在仍然不可以使用。
5. 执行权回到foo.js继续执行直到其结束，完成foo变量的定义。由于ES6 Module动态映射的特性，此时在bar.js中foo的值已经从死区限制解除，成为了我们定义的变量，这是与CommonJS在解决循环依赖时的本质区别，CommonJS中导入的是值的拷贝，不会随着被夹在模块中原有值的变化而变化。

结合上面书中的例子可以看出，ES6 Module的特性使其可以更好地支持循环依赖，只是需要由开发者来保证当导入的值被使用时机是否正确。
