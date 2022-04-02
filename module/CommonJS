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



# ES6 Module

ES6 Module也是将每个文件作为一个模块，**每个模块拥有自身的作用域**，不同的是导入、导出语句。import和export也作为保留关键字在ES6版本中加入了进来（CommonJS中的module并不属于关键字）。

模块请看下面的例子，我们将前面的calculator.js和index.js使用ES6的方式进行了改写。

```javascript
// calculator.js
export default {
    name: 'calculator',
    add: function(a, b) {
        return a + b;
    }
};

// index.js
import calculator from './calculator.js';
const sum = calculator.add(2, 3);
console.log(sum); // 5
```
## ES6 Module 特性

### 1. 模块作用域

### 2. 默认使用严格模式

ES6 Module会自动采用严格模式，这在ES5（ECMAScript5.0）中是一个可选项。以前我们可以通过选择是否在文件开始时加上“use strict”来控制严格模式，在ES6 Module中不管开头是否有“use strict”，都会采用严格模式。

**如果将原本是CommonJS的模块或任何未开启严格模式的代码改写为ES6Module要注意这点。**

### 3. 导出

在ES6 Module中使用export命令来导出模块。

export有两种形式：

+ 命名导出
+ 默认导出

一个模块可以有多个命名导出。它有两种不同的写法：

```javascript
// 写法1
export const name = 'calculator';

export const add = function(a, b) { return a + b; };

// 写法2
const name = 'calculator';

const add = function(a, b) { return a + b; };

export { name, add };

```



第1种写法是将变量的声明和导出写在一行；

第2种则是先进行变量声明，然后再用同一个export语句导出。两种写法的效果是一样的。

在使用命名导出时，可以通过as关键字对变量重命名。如：

```javascript
const name = 'calculator';

const add = function(a, b) { return a + b; };

export { name, add as getSum }; // 在导入时即为 name 和 getSum

```



与命名导出不同，**模块的默认导出只能有一个**。我们可以将export default理解为对外输出了一个名为default的变量，因此不需要像命名导出一样进行变量声明，直接导出值即可。

```javascript
export default {
    name: 'calculator',
    add: function(a, b) {
        return a + b;
    }
};

--------------------------------------------------
    
// 导出字符串
export default 'This is calculator.js';

// 导出 class
export default class {...}

// 导出匿名函数
export default function() {...}
```

### 4. 导入

ES6 Module中使用import语法导入模块。
导出分为命名导出、和默认导出。导入时也有所区别，
#### 导入命名导出的变量
**注意：导入变量的效果相当于在当前作用域下声明了这些变量（name和add），并且不可对其进行更改，也就是所有导入的变量都是只读的。**
1. 加载带有命名导出的模块时，import后面要跟一对大括号来将导入的变量名包裹起来，并且这些变量名需要与导出的变量名完全一致。

   ```javascript
   // calculator.js
   const name = 'calculator';
   const add = function(a, b) { return a + b; };
   export { name, add };

   // index.js
   import { name, add } from './calculator.js';
   add(2, 3);
   ```

2. 与命名导出类似，我们可以通过as关键字可以对导入的变量重命名。

   ```javacript
   import { name, add as calculateSum } from './calculator.js';
   calculateSum(2, 3);
   ```

3. 在导入多个变量时，我们还可以采用整体导入的方式。

   ```javascript
   import * as calculator from './calculator.js';
   console.log(calculator.add(2, 3));
   console.log(calculator.name);
   ```

   使用`import * as <myModule>`可以把所有导入的变量作为属性值添加到`<myModule>`对象中，从而减少了对当前作用域的影响。

#### 导入默认导出的变量

接下来处理默认导出，请看下面这个例子：

```javascript
// calculator.js
export default {
    name: 'calculator',
    add: function(a, b) { return a + b; }
};

// index.js
import myCalculator from './calculator.js';
calculator.add(2, 3);
```

对于默认导出来说，import后面直接跟变量名，并且这个名字可以自由指定（比如这里是myCalculator），它指代了calculator.js中默认导出的值。从原理上可以这样去理解：

`import { default as myCalculator } from './calculator.js';`

#### ES6 Module中导入的变量其实是对原有值的动态映射，并且这个映射是只读的

#### 混合导入（命名导出和默认导出同时导入）

**注意： 默认导入的变量必须在命名导入的变量前面，顺序不能颠倒。**

```javascript
// index.js
import React, { Component } from 'react';
```

这里的React对应的是该模块的默认导出，而Component则是其命名导出中的一个变量。
注意: 这里的React必须写在大括号前面，而不能顺序颠倒，否则会提示语法错误。

#### 技巧:复合写法

复合写法在工程中，有时需要把某一个模块导入之后立即导出，比如专门用来集合所有页面或组件的入口文件。此时可以采用复合形式的写法：

```javascript
export { name, add } from './calculator.js';
```

复合写法目前只支持当被导入模块（这里的calculator.js）通过命名导出的方式暴露出来的变量，默认导出则没有对应的复合形式，只能将导入和导出拆开写。

```javascript
import calculator from "./calculator.js ";
export default calculator;
```

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

## 循环依赖

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
