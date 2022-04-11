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


> **注意，命名导出和默认导出不单单只是导出的语法和数量不同，在导入对应的值得处理上也有所区别**
> 1. **命名导出变量**，导入后是值的动态映射。如果源值发生变化后，导入的值会跟随源值一起发生变化。
> 2. **默认导出变量**，导入后是值的复制。源值发生变化后，导入的普通类型的值不会跟着变化。

```javascript
// foo.js
export let a = 123

setTimeout(() => {a = b = 999; }, 1000)

let b = 456

export default b


// index.js
import def, {a} from './foo.js';

console.log(def, a); // 123, 123

setTimeout(() => {console.log(def, a);}, 2000) // 123, 999
```

上述例子中， a 为命名导出，b为默认导出，一秒后，修改a,b的值，在index.js中，默认导入的变量 def 在两秒后，未发生变化。

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
