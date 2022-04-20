# Webpack

## 1. Webpack 是什么

Webpack 是一个开源的 JavaScript 模块打包工具，**最核心的功能是解决模块之间的依赖，把各个模块按照特定的规则和顺序组织在一起**，最终合并为一个（或多个）JS文件。

对于Webpack来说，一切资源都是模块，js是模块，css是模块，图片是模块，静态资源也是模块。从入口文件开始构建依赖关系，将用到的所有模块打包成静态资源。

Webpack 默认只能识别 js文件和json文件，对于其他文件就需要Loader去处理。

## 2 Webpack基础配置

安装 `webpack` 及 `webpack-cli` 。

```bash
yarn add webpack@4.32.2 webpack-cli@3.3.2 -D
```

### 2.1 Webpack 支持0配置打包

webpack 0配置，入口文件为 src/index.js ，输出文件为 dist/main.js

```javascript
// src/index.js
console.log("hello world!");
```

在根目录 运行 `npx webpack` 后，会根据入口文件  src/index.js 在dist目录下生成对应的 dist/main.js，默认使用 生产模式 打包。

### 2.2 Webpack 配置文件

Webpack 的默认配置文件为根目录下的 `webpack.config.js`或者 `webpackfile.js`，通常使用 `webpack.config.js`作为默认配置文件。

```javascript
// webpack.config.js

// webpack是node写出来的，所以使用node的语法

let path = require('path')

module.exports = {
    mode: 'development', // 模式，默认两种模式， production 和 development

    entry: './src/index.js', // 入口

    output: { // 出口
        filename: 'bundle.js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
    }
}
```

在根目录 运行 `npx webpack` 后，会根据根目录的配置文件 `webpack.config.js`开始打包。

webpack.config.js 配置 入口文件依旧是 src/index.js，但是出口文件为 dist/bundle.js。

### 2.3 Webpack Loader

对于Webpack来说，一切资源都是模块，但是Webpack默认只能处理 js文件和json文件，其他类型的文件，比如图片，css等就需要loader来帮助处理。

loader把其他类型的文件转换为webpack能够处理的有效模块。

loader默认执行顺序是从下向上，从右向左。

#### 2.3.1 webpack 默认能处理 js 文件和 json 文件

在src下新建data.json文件和a.js文件。修改index.js引入这两个文件。

```javascript
// src/a.js
module.exports = "ck"

// src/data.json
{
    "name": "json"
}

// src/index.js
const name = require('./a.js')
const data = require('./data.json')

console.log("hello world!");
console.log(name, data);

// webpack.config.js
let path = require('path')

module.exports = {
    mode: 'development', // 模式，默认两种模式， production 和 development

    entry: './src/index.js', // 入口

    output: { // 出口
        filename: 'bundle.js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
    }
}
```

webpack.config.js 不需要修改，重新运行 npx webpack 打包，运行 dist/bundle.js 输出如下

```bash
hello world!
ck { name: 'json' }
```

#### 2.3.2 webpack 通过 loader来处理其他类型文件

##### 1. 解析css文件、less文件

在src下新建index.css、a.css文件，修改index.js 引入该样式

```javascript
// src/index.css
@import "./a.css";
body {
    background-color: gray;
}

// src/a.css
body {
    background-color: honeydew;
}

// src/index.js
require('./index.css')

console.log("hello world!");
```

webpack.config.js 暂时不修改，重新运行 npx webpack 打包，打包失败，输入如下

```bash
$ npx webpack
Hash: 0b292b3efca7aab79fc2
Version: webpack 4.32.2
Time: 62ms
Built at: 2022-04-13 2:19:21 ├F10: PM┤
    Asset     Size  Chunks             Chunk Names
bundle.js  4.3 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/index.css] 175 bytes {main} [built] [failed] [1 error]
[./src/index.js] 54 bytes {main} [built]

ERROR in ./src/index.css 1:5
Module parse failed: Unexpected token (1:5)
You may need an appropriate loader to handle this file type.
> body {
|     background-color: gray;
| }
 @ ./src/index.js 1:0-22
```

报错，模块解析失败，需要使用合适的loader去处理这种文件类型。

loader其实就是一个代码转换器，将Webpack不识别的代码格式转换为可以识别的模块。

安装 `css-loader`、`style-loader`

```bash
yarn add css-loader@2.1.1 style-loader@0.23.1 -D
```

`css-loader`官方定义是 解释(interpret) @import 和 url() ，会 import/require() 后再解析(resolve)它们。简单理解就是把css文件里的css语法当成普通字符串，把css语法中的 @import 和 url() 引入的资源串联起来，类似js中的require、import

`style-loader` 其实就是把 css 字符串 注入到 style 标签中。毕竟 css 字符串放到 js 中不生效啊，必须在 style标签里才能起作用。

修改 `webpack.config.js` 

```javascript
// webpack.config.js

// webpack是node写出来的，所以使用node的语法

let path = require('path')

module.exports = {
    mode: 'development', // 模式，默认两种模式， production 和 development

    entry: './src/index.js', // 入口

    output: { // 出口
        filename: 'bundle.js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
    },

    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader

            // css-loader 解析css文件，识别css语法的
            // style-loader 把解析后的css文件 插入到head标签中
            // loader有个特点，希望单一，一个loader干一件事
            /* 
                loader的用法
                1. 只用字符串，就是只用一个loader
                2. 多个loader，需要一个数组 []，数组里可以放字符串，或者对象，对象的话就可以配置loader的参数了
            */
            // loader的顺序，默认是从右向左执行，从下往上执行
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
        ],
    },
}
```

webpack.config.js 修改后，重新运行 npx webpack 打包，报错消失，在根目录新建index.html，引入打包生成的js。在浏览器打开index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./dist/bundle.js"></script>
</body>
</html>
```

浏览器背景为灰色，审查html元素如下，css加载成功。

```html
<html lang="en"><head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
<style type="text/css">body {
    background-color: honeydew;
}</style><style type="text/css">body {
    background-color: gray;
}</style></head>
<body>
    <script src="./dist/bundle.js"></script>

</body></html>
```

> Tips: 默认style-loader会把样式插入head的最后面，所以如果你自己写的样式会被覆盖掉
>
> 假如不想别覆盖掉，应该把样式插入head的最前面，可以在配置里加这个这个配置
>
> ```javascript
> {
>     test: /\.css$/,
>     use: [
>         {
>             loader: 'style-loader',
>             options: {
>                 insertAt: 'top' // 插在顶部
>             }
>         },
>         'css-loader'
>     ]
> }
> ```

如果想要使用less，需要安装 `less`和 `less-loader`

```bash
yarn add less@3.9.0 less-loader@5.0.0 -D
```

安装loader后，修改对应的loader即可，修改loader

```javascript
{
    test: /\.less$/,
        use: [
            'style-loader', // 插入head标签
            'css-loader', // 解析 @import语法 解析 css
            'less-loader' // 把less 转换为 css
        ]
}
```

##### 2. 解析图片文件 - file-loader

图片的引用方式一般有三种

1. 在js中创建图片来引入
2. 在css中引入，比如 background('url')
3. 在html中使用img标签引用，比如 `<img src='xxx' alt=''>`

**1. 在js中创建图片来引入**

修改index.js，先尝试通过字符串引用，是不会生效的

```javascript
// src/index.js

let image = new Image() // 在js中创建图片来引用
image.src = './cat.png' // 如果直接通过字符串引用，是没有效果的，也会被看成是个字符串

document.body.appendChild(image)
```

运行 `npx webpack`，查看打包生成的bundle.js

```javascript
eval("// src/index.js\r\n\r\nlet image = new Image() // 在js中创建图片来引用\r\nimage.src = './cat.png' // 如果直接通过字符串引用，是没有效果的，也会被看成是个字符串\r\n\r\ndocument.body.appendChild(image)\r\n\n\n//# sourceURL=webpack:///./src/index.js?");
```

没有真正的引用这张图片。image.src = './cat.png'被当做普通的字符串，没有把对应的图片给引入进来。

如果想要被引用过来，需要有个导入关系，使用require语法，或者import，

再次修改index.js

```javascript
// src/index.js

let image = new Image() // 在js中创建图片来引用
image.src = require('./cat.png')

document.body.appendChild(image)

```

运行 `npx webpack`，打包报错，提示需要用合适的loader去处理这个文件类型。

```bash
$ npx webpack
Hash: 598b217258bc0f4cd3f9
Version: webpack 4.32.2
Time: 64ms
Built at: 2022-04-13 4:15:14 ├F10: PM┤
    Asset      Size  Chunks             Chunk Names
bundle.js  4.39 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/cat.png] 179 bytes {main} [built] [failed] [1 error]
[./src/index.js] 147 bytes {main} [built]

ERROR in ./src/cat.png 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type.
(Source code omitted for this binary file)
 @ ./src/index.js 4:12-32
```

安装 `file-loader`处理图片类型文件，`file-loader`用于处理文件类型的资源，并返回 public URL(我理解就是webpack.config.js中配置的 publicPath + 文件名)，默认文件名是文件内容的MD5的哈希值。

```bash
yarn add file-loader@^3.0.1 -D
```

安装成功后，在`webpack.config.js`中添加对应的loader告诉webpack使用`file-loader`处理图片类型的文件

```javascript
// 在 module.rule 添加loader， 告诉webpack使用file-loader处理图片类型的文件
{
test: /.(jpg|png|gif)$/, // 处理图片的loader
use: 'file-loader'
}
// --------------------------------------------------------- // 
// webpack.config.js

// webpack是node写出来的，所以使用node的语法

let path = require('path')

module.exports = {
    mode: 'development', // 模式，默认两种模式， production 和 development

    entry: './src/index.js', // 入口

    output: { // 出口
        filename: 'bundle.js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
    },

    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            {
                test: /.(jpg|png|gif)$/, // 处理图片的loader
                use: 'file-loader'
            },

            // css-loader 解析css文件，识别css语法的
            // style-loader 把解析后的css文件 插入到head标签中
            // loader有个特点，希望单一，一个loader干一件事
            /* 
                loader的用法
                1. 只用字符串，就是只用一个loader
                2. 多个loader，需要一个数组 []，数组里可以放字符串，或者对象，对象的话就可以配置loader的参数了
            */
            // loader的顺序，默认是从右向左执行，从下往上执行
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    {
                        loader: 'style-loader',
                        options: {
                            insertAt: 'top' // 插在顶部
                        }
                    },
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader', // 插入head标签
                    'css-loader', // 解析 @import语法 解析 css
                    'less-loader' // 把less 转换为 css
                ]
            },
        ],
    },
}
```

运行 `npx webpack`，打包成功，发现在dist文件夹下不仅仅有bundle.js，还有对应的图片文件，不过名字已经被修改为其内容的MD5哈希值。

```bash
$ npx webpack
Hash: 02d450b1dcdc394b5d15
Version: webpack 4.32.2
Time: 91ms
Built at: 2022-04-13 4:20:33 ├F10: PM┤
                               Asset      Size  Chunks             Chunk Names
78e446c51ac2e7ba6aeeac7e2aa01d72.png  8.38 KiB          [emitted]
                           bundle.js  4.38 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/cat.png] 82 bytes {main} [built]
[./src/index.js] 186 bytes {main} [built]
```

打开index.html，发现图片并没有被引入成功。Why？审查元素发现，虽然图片加载成功，并且打包到dist文件夹下，但是html中引入的文件路径却是不对的

```html
<img src="./78e446c51ac2e7ba6aeeac7e2aa01d72.png">
```

根目录下的index.html并没有这个文件，默认源文件我们放在/src/cat.png，打包生成的图片在/dist/78e446c51ac2e7ba6aeeac7e2aa01d72.png，怎么办？

两种解决办法

1. 在 webpack.config.js 中 output 配置publicPath
2. 在 file-loader 中不使用简写，改为对象，在options设置publicPath，注这里的 publicPath 会覆盖原有的 output.publicPath

```javascript
// 1. 修改 webpack.config.js 中 output.publicPath
module.exports = {
    // 省略...
    output: { // 出口
        filename: 'bundle.js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
        publicPath: './dist/',
    }
}

// 2. 通过 loader 中 options 设置 publicPath
module.exports = {
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            {
                test: /.(jpg|png|gif)$/, // 处理图片的loader
                use: {
                    loader: 'file-loader',
                    options: {
                        publicPath: './dist/' // 注这里的 publicPath 会覆盖原有的 output.publicPath
                    }
                }
            },]
    }
    // 省略...
}
            
```

> Tips:
>
> output.path 是 资源的打包输出路径
>
> output.publicPath是资源引入路径

使用上述两种方法中任一种，重新运行 `npx webpack`， 打开 index.html 图片加载正常。

**2. 在css中引入，比如 background('url')**

因为在前面的例子中，咱们已经使用了 `css-loader`，`css-loader`就是把css文件中的css语法中的 @import 和 url() 引入的资源加载需要打包的模块中，而不是作为普通的字符串，原样输出。

所以在配置完解析 css 文件的 `css-loader` 和解析图片文件的 `file-loader` 后，就可以在css中通过 url 引入图片了

```javascript
// webpack.config.js
module.exports = {
    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            
            // 解析css文件...
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            // 解析图片文件
            {
                test: /.(jpg|png|gif)$/, // 处理图片的loader
                use: {
                    loader: 'file-loader',
                    options: {
                        publicPath: './dist/', // 配置有效的css资源路径
                    }
                }
            },
        ]
    }
}
```

**3. 在html中使用img标签引用**

一般webpack中的html文件都是作为模板文件，作为普通资源复制到输出目录中，html中的内容也不会被解析。所以这种方式引入图片其实很少用，但是如果用的话也是可以的。国人写了一个loader `html-withimg-loader`，专门解析html中的资源引入。

`yarn add html-withimg-loader@^0.1.16 -D`

安装后配置对应loader就可以。

##### 3. 解析图片文件 - url-loader

使用`file-loader`解析图片文件时，是把图片作为一个网络资源向服务器请求拿到的，如果图片文件较小，每个图片文件都单独发送一个http就较为消耗性能。所以在`http/1.0`时代，通常会把多个小图片拼成精灵图，或者打包成base64放到js或者css文件中，减少http请求。

> Tips: 首次优化
>
> 1. 小图片拼成精灵图，减少http请求
> 2. 小图片打包成base64，放到文件中，减少http请求
> 3. 注意配置使用`url-loader`解析图片文件时就没有必要在配置`file-loader`了，因为文件会打包成两次，一次转为base64，一次复制源文件

安装 `url-loader`，`url-loader1`功能类似`file-loader`，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个DataURL。`url-loader`依赖`file-loder`，因为超过限制的会使用`file-loader`打包。

```bash
yarn add url-loader@^1.1.2 -D
```

修改 `webpack.config.js`中配置，注意配置使用`url-loader`解析图片文件时就没有必要在配置`file-loader`了，因为文件会打包成两次，一次转为base64，一次复制源文件。

```javascript
// webpack.config.js
module.exports = {
    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            // ...
            {
                test: /.(jpg|png|gif)$/,
                // 做一个限制，当图片小于 多少k的时候，用base64来转化
                // 如果大于这个限制，就会使用file-loader来去解析图片，将图片打包到dist目录下
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8 * 1024, // 8K = 8192byte
                        // 如果图片小于8K的话，全部变为base64
                        // 否则使用file-loader 产出真实的图片
                    }
                },
            },
        ]
    }
}
```

webpack 中一般把低于8KB的文件打包成base64字符串，超过8KB的图片使用`file-loader`打包源文件到输出目录。Why，为什么是8KB？

> Tips: webpack 中一般把低于8KB的文件打包成base64字符串，超过8KB的图片使用`file-loader`打包源文件到输出目录。为什么是8KB
>
> 将图片文件转换为base64编码并载入浏览器能够减少http请求数，但是增大了js或css文件的体积，如果图片在项目中的重用度较高，那么每处引用都会生成base64编码，造成了代码的冗余。通过http请求载入到浏览器的文件可以缓存到本地，当图片在项目中的重用度较高时，会为图片的访问增加缓存的便利性，下次访问更快。因此要平衡考虑。并且图片转为为base64会变大，越大的图片转为的base64变大的越多，收益不成正比。一般一个图片转为base64会比原体积大1/3左右。

**TODO: 为什么文件转为base64，会比原体积大1/3？**

在处理图片文件的时候，已经认识到客户端缓存的强大，通过利用客户端缓存，把小图片放到资源文件中，如js文件、html文件中、css文件中。等等 css 文件，在我们使用 `css-loader`和 `style-loader`处理完的 css文件还在js中呢。css文件体积可比一般的图片大多了。虽然js文件也可以缓存，但是js文件的改动肯定比css文件频繁的多，那么webpack可不可以把css文件单独抽离出来，作为资源加载，单独享受浏览器缓存呢？答案当然是可以的。webpack插件可以帮我们做到把解析完的css抽离成单独的css文件。

### 2.4 Webpack plugin

webpack loader 是帮助 webpack 解析除了 js、json以外，其他类型的模块的。而 webpack plugin 可以理解成是为webpack添加额外功能的。增强webpack功能。

比如使用 `mini-css-extract-plugin` 把css样式抽离成单独文件。

##### 2.4.1 抽离 css文件

安装`mini-css-extract-plugin`插件

```bash
yarn add mini-css-extract-plugin@0.7.0 -D
```

修改 `webpack.config.js`中配置，webpack loader 配置都写在 `module.rule` 中，插件的使用稍微麻烦点，需要实例化后放在 `plugins` 中。

```javascript

// webpack.config.js

// webpack是node写出来的，所以使用node的语法

let path = require('path')
let MiniCssExtractPlugin = require('mini-css-extract-plugin') // 引入插件

module.exports = {
    mode: 'development', // 模式，默认两种模式， production 和 development

    entry: './src/index.js', // 入口

    output: { // 出口
        filename: 'bundle.js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
        // publicPath: './dist/',
    },

    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            // ...
            {
                test: /\.css$/,
                use: [
                    // 'style-loader', // style-loader把样式放在style标签里
                    // MiniCssExtractPlugin 这个插件上有个loader，把样式单独写到一个文件中
                    MiniCssExtractPlugin.loader, // 若果想抽离多个文件，可以在new一个出来，一个抽离css一个抽离less都行
                    'css-loader',
                ]
            }
        ],
    },

    plugins: [ // 插件是一个数组，放着所有的webpack插件
        // 插件是一个类，通过new的方式来引用，插件使用就没有先后顺序了，随便放就行
        // 引入抽离css样式的插件
        new MiniCssExtractPlugin({
            filename: 'main.css', // 告诉插件，抽离出的样式文件的名字叫什么，这里叫main.css
        }),
    ],
}
```

运行 `npx webpack` ，打包成功，输出如下

```bash

$ npx webpack
Hash: 8549a57052ee48b7faa9
Version: webpack 4.32.2
Time: 293ms
Built at: 2022-04-14 11:03:45 ├F10: AM┤
                               Asset       Size  Chunks             Chunk Names
78e446c51ac2e7ba6aeeac7e2aa01d72.png   8.38 KiB          [emitted]
                           bundle.js   4.18 KiB    main  [emitted]  main
                            main.css  156 bytes    main  [emitted]  main
Entrypoint main = main.css bundle.js
[./src/index.css] 39 bytes {main} [built]
[./src/index.js] 45 bytes {main} [built]
    + 2 hidden modules
Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!src/index.css:
    Entrypoint mini-css-extract-plugin = *
    [./node_modules/css-loader/dist/cjs.js!./src/a.css] 185 bytes {mini-css-extract-plugin} [built]
    [./node_modules/css-loader/dist/cjs.js!./src/index.css] 479 bytes {mini-css-extract-plugin} [built]
    [./src/cat.png] 64 bytes {mini-css-extract-plugin} [built]
        + 2 hidden modules
```

打包成功，打开根目录下的index.html，发现并没有引入这个css文件，手动在index.html中农添加link，`<link rel="stylesheet" href="./dist/main.css">`。刷新index.html，样式加载成功。

手动引入很呆，并且为避免每次打包部署后，浏览器访问最新文件而不是访问缓存。每次打包后我们会给输出的文件加上hash，每次打包生成的文件名都不一样。这样每次我们打包后，手动修改index.html中的文件引入，很麻烦。有没有方法自动在index.html中引入打包生成后的文件。答案又是有的。

通过使用webpack插件`html-webpack-plugin`可以帮我们动态引入生成的链接。

> Tips：为避免每次打包部署后，浏览器访问最新文件而不是访问缓存。每次打包后我们会给输出的文件加上hash。
>
> webpack提供了三种hash。
>
> 1. hash - webpack此次打包所有资源生成的hash
> 2. chunkhash - 根据入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。从入口文件(Entry)对应依赖的所有文件的hash一起修改。一个chunk一个hash值。
> 3. contenthash - 根据文件内容生成的hash，文件内容改变，这个hash值才会变

**TODO: chunk是什么（模块？入口？）**

**TODO: 详细总结三种hash变化的规律**

##### 2.4.2 使用模板html

安装 `html-webpack-plugin`插件

```bash
yarn add html-webpack-plugin@3.2.0 -D
```

修改 `webpack.config.js`中配置

```javascript
// webpack.config.js
let HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件

module.exports = {
    mode: 'development', // 模式，默认两种模式， production 和 development

    entry: './src/index.js', // 入口

    output: { // 出口
        // 使用contenthash避免使用浏览器缓存
        filename: '[name].[contenthash:8].js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
    },
    
    // 其他...
    plugins: [ // 插件
        // 根据模板文件，将打包生成的文件自动注入到模板文件中
        new HtmlWebpackPlugin({
            template: './index.html', // 告诉插件，是以这个目录下的index.html为模板
            filename: 'index.html', // 告诉插件，打包后的文件叫什么名字，这里也叫index.html
        })
    ],
}
```

运行 `npx webpack`，打包输出如下:

```bash
$ npx webpack
Hash: 9217c2b89bc940a283ae
Version: webpack 4.32.2
Time: 448ms
Built at: 2022-04-14 1:45:25 ├F10: PM┤
                               Asset       Size  Chunks             Chunk Names
78e446c51ac2e7ba6aeeac7e2aa01d72.png   8.38 KiB          [emitted]
                          index.html  370 bytes          [emitted]
                            main.css  148 bytes    main  [emitted]  main
                    main.d7386a31.js   4.18 KiB    main  [emitted]  main
Entrypoint main = main.css main.d7386a31.js
[./src/index.css] 39 bytes {main} [built]
[./src/index.js] 45 bytes {main} [built]
    + 2 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/html-webpack-plugin/lib/loader.js!./index.html] 481 bytes {0} [built]
    [./node_modules/webpack/distin/global.js] (webpack)/distin/global.js 472 bytes {0} [built]
    [./node_modules/webpack/distin/module.js] (webpack)/distin/module.js 497 bytes {0} [built]
        + 1 hidden module
Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!src/index.css:
    Entrypoint mini-css-extract-plugin = *
    [./node_modules/css-loader/dist/cjs.js!./src/a.css] 185 bytes {mini-css-extract-plugin} [built]
    [./node_modules/css-loader/dist/cjs.js!./src/index.css] 479 bytes {mini-css-extract-plugin} [built]
    [./src/cat.png] 82 bytes {mini-css-extract-plugin} [built]
        + 2 hidden modules
```

打开输出目录dist文件夹，发现index.html中已经引入了咱们加hash之后js文件。打开/dist/index.html，展示正常。打包成功，js、css自动引入，再也不用手动去修改引入了。

此时因为多次打包且每次生成的文件名因为是加上了hash，导致dist文件夹下 积累了很多之前无用的文件。有没有一种办法，让我们每次打包之前，情况一下dist文件夹？webpack强大的生态里当然有相关的插件。

##### 2.4.3 清空输出文件夹

使用`clean-webpack-plugin`插件 删除/清空输出文件夹

```bash
yarn add clean-webpack-plugin@^3.0.0 -D
```

修改 `webpack.config.js`中配置

```javascript
// webpack.config.js
let { CleanWebpackPlugin } = require('clean-webpack-plugin') // 打包前 先删除原来的打包目录

module.exports = {
    // 其他...
    plugins: [ // 插件
        // 插件是一个类，通过new的方式来引用，没有先后顺序了，随便放就行

        // 打包前 先删除原来的打包目录
        new CleanWebpackPlugin(),
    ],
}
```

运行 `npx webpack` 后，发现输出目录下之前遗留的文件都被清空了，只有最新生成的文件。

##### 2.4.4 静态资源文件夹

如果我们有一些静态资源，在项目中并没有使用，这些文件不会被打包到输出文件夹，但是我们又想要把这些资源比如文档，提供的sdk，图片，视屏之类的资源放到服务器上，可以使用`copy-webpack-plugin`插件 复制文件到输出文件夹

```bash
yarn add copy-webpack-plugin@^5.0.3 -D
```

修改 `webpack.config.js`中配置

```javascript
// webpack.config.js
let CopyWebpackPlugin = require('copy-webpack-plugin') // 把额外的文件打包到dist目录下

module.exports = {
    // 其他...
    plugins: [ // 插件
        // 插件是一个类，通过new的方式来引用，没有先后顺序了，随便放就行

        // 把额外的文件打包到dist目录下
        new CopyWebpackPlugin([ // 参数可以是一个数组，可以拷贝很多文件
            {
                from: './public', // 从public目录
                to: './public' // 拷贝到 dist目录下的 public 目录
            },
        ])
    ],
}
```

运行 `npx webpack` 后，会发现根目录下的资源都被复制到输出目录dist下，打包成功。

### 2.5 使用webpack启动本地服务

至此，webpack的初始环境配置已经差不多了，但是这样使用webpack的开发效率并不会太高。之前每次修改完js、css等，只需要刷新浏览器就可以看到效果，而现在多了一步打包，每次都需要运行 `npx webpack` 更新输出文件，然后才能刷新页面看到效果。能不能更简单的方法呢？ `webpack-dev-server` 就是做这件事的。安装`webpack-dev-server`

````bash
yarn add webpack-dev-server@3.5.1 -D
````

安装完需要使用 `npx webpack-dev-server` 输出如下：

```bash
$ npx webpack-dev-server
i ｢wds｣: Project is running at http://localhost:8081/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from E:\me\test\webpack\basic
i ｢wdm｣: Hash: 10daff9af98832a0e850
Version: webpack 4.32.2
Time: 791ms
Built at: 2022-04-14 4:31:07 ├F10: PM┤
                               Asset       Size  Chunks             Chunk Names
78e446c51ac2e7ba6aeeac7e2aa01d72.png   8.38 KiB          [emitted]
                          index.html  370 bytes          [emitted]
                    main.1781456d.js    359 KiB    main  [emitted]  main
                            main.css  148 bytes    main  [emitted]  main
                   public/xxx-sdk.js    0 bytes          [emitted]
Entrypoint main = main.css main.1781456d.js
```

打开 提示的URL http://localhost:8081/，页面出现在我们面前，修改下源文件，不需要刷新，就可以看到修改后的效果。然后咱们本地并没有生成dist文件夹。`npx webpack-dev-server` 并不是真实的打包，而是用express在本地启动一个静态服务，在内存中打包。这个本地服务会监听文件修改，自动更新。

如果想要修改 `webpack-dev-server` 的默认配置，可以在 `webpack.config.js` 中修改。

```javascript
// webpack.config.js
module.exports = {
    // 其他...
    devServer: { 
        port: 3000, // 默认端口是8080，这里可以改
        progress: true, // 打包时候的进度条
        contentBase: './dist', // 以哪个文件夹作为服务的根目录 
        // open: true, // 服务启动完毕后，直接打开浏览器，
        compress: true, // 启动gzip压缩
    },
}
```

### 2.6 webpack 配置总览

#### 2.6.1 webpack.config.js

`webpack`基本开发环境已经搭建的差不多了，`webpack.config.js`如下：

```javascript
// webpack.config.js

// webpack是node写出来的，所以使用node的语法

let path = require('path')
let MiniCssExtractPlugin = require('mini-css-extract-plugin') // 引入插件
let HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件
let { CleanWebpackPlugin } = require('clean-webpack-plugin') // 打包前 先删除原来的打包目录

let CopyWebpackPlugin = require('copy-webpack-plugin') // 把额外的文件打包到dist目录下


module.exports = {
    mode: 'development', // 模式，默认两种模式， production 和 development

    entry: './src/index.js', // 入口

    output: { // 出口
        filename: '[name].[contenthash:8].js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
        // publicPath: './build/',
    },

    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            // {
            //     test: /.(jpg|png|gif)$/, // 处理图片的loader
            //     use: {
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             // publicPath: './build/' // 这里的 publicPath 会覆盖原有的 output.publicPath
            //         }
            //     }
            // },
            {
                test: /.(jpg|png|gif)$/,
                // 做一个限制，当图片小于 多少k的时候，用base64来转化
                // 如果大于这个限制，就会使用file-loader来去解析图片，将图片打包到build目录下
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8 * 1024, // 8K = 8192byte
                        // publicPath: './build/',
                        // 如果图片小于8K的话，全部变为base64
                        // 否则使用file-loader 产出真实的图片
                    }
                },
            },

            // css-loader 解析css文件，识别css语法的
            // style-loader 把解析后的css文件 插入到head标签中
            // loader有个特点，希望单一，一个loader干一件事
            /* 
                loader的用法
                1. 只用字符串，就是只用一个loader
                2. 多个loader，需要一个数组 []，数组里可以放字符串，或者对象，对象的话就可以配置loader的参数了
            */
            // loader的顺序，默认是从右向左执行，从下往上执行
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    // {
                    //     loader: 'style-loader',
                    //     options: {
                    //         insertAt: 'top' // 插在顶部
                    //     }
                    // },
                    // MiniCssExtractPlugin 这个插件上有个loader，我们不想再用style-loader把样式放在style标签里了，所以就用它的loader
                    MiniCssExtractPlugin.loader, // 若果想抽离多个文件，可以在new一个出来，一个抽离css一个抽离less都行
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader', // 插入head标签
                    'css-loader', // 解析 @import语法 解析 css
                    'less-loader' // 把less 转换为 css
                ]
            },
        ],
    },

    plugins: [ // 是一个数组，放着所有的webpack插件
        // 插件是一个类，通过new的方式来引用，插件使用就没有先后顺序了，随便放就行

        // 引入抽离css样式的插件
        new MiniCssExtractPlugin({
            filename: 'main.css', // 告诉插件，抽离出的样式文件的名字叫什么，这里叫main.css
        }),

        // 根据模板文件，将打包生成的文件自动注入到模板文件中
        new HtmlWebpackPlugin({
            template: './index.html', // 告诉插件，是以这个目录下的index.html为模板
            filename: 'index.html', // 告诉插件，打包后的文件叫什么名字，这里也叫index.html
            // minify: {
            //     removeAttributeQuotes: true, // 把模板中能去的引号都去掉
            //     collapseWhitespace: true, // 折叠空格，就变成了一行
            // },
            // hash: true, // 引用的时候可以加一个hash戳
        }),

        // 打包前 先删除原来的打包目录
        new CleanWebpackPlugin(),

        // 把额外的文件打包到dist目录下
        new CopyWebpackPlugin([ // 参数可以是一个数组，可以拷贝很多文件
            {
                from: './public', // 从public目录
                to: './public' // 拷贝到 dist目录下的 public 目录
            },
        ])
    ],

    devServer: { 
        port: 3000, // 默认端口是8080，这里可以改
        progress: true, // 打包时候的进度条
        contentBase: './dist', // 以哪个文件夹作为服务的根目录 
        // open: true, // 服务启动完毕后，直接打开浏览器，
        compress: true, // 启动gzip压缩
    },
}
```

当前安装的所有依赖如下:

#### 2.6.2 package.json

```javascript
// package.json
{
  "name": "learn-webpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "clean-webpack-plugin": "^3.0.0",
    "copy-webpack-plugin": "^5.0.3",
    "css-loader": "2.1.1",
    "file-loader": "^3.0.1",
    "html-webpack-plugin": "3.2.0",
    "less": "3.9.0",
    "less-loader": "5.0.0",
    "mini-css-extract-plugin": "0.7.0",
    "style-loader": "0.23.1",
    "url-loader": "^1.1.2",
    "webpack": "4.32.2",
    "webpack-cli": "3.3.2",
    "webpack-dev-server": "3.5.1"
  }
}
```

#### 2.6.3 依赖命令

```bash
yarn add webpack@4.32.2 webpack-cli@3.3.2 -D
yarn add css-loader@2.1.1 style-loader@0.23.1 -D
yarn add less@3.9.0 less-loader@5.0.0 -D
yarn add file-loader@^3.0.1 -D
yarn add html-withimg-loader@^0.1.16 -D
yarn add url-loader@^1.1.2 -D

yarn add mini-css-extract-plugin@0.7.0 -D
yarn add html-webpack-plugin@3.2.0 -D
yarn add clean-webpack-plugin@^3.0.0 copy-webpack-plugin@^5.0.3 -D

yarn add webpack-dev-server@3.5.1 -D
yarn add webpack-merge@^4.2.1 -D
```



## 3. 区分不同环境

不知道你有没有注意到，当前`webpack.config.js`中的`mode`都写死为`development`，标识当前为开发模式，而生产环境部署时一般使用`production`，当`mode=production`时，`webpack`会自动做一些优化，比如代码压缩之类的。`webpack`支持传递配置文件，所以我们可以为不同环境配置不同的配置文件。通过`npx webpack --config webpack配置文件名`去选择当前使用的配置文件。

而不同环境的配置文件一定有相同部分，我们可以通过把相同的配置提取到一个文件后，通过 `webpack-merge`去合并。

```bash
yarn add webpack-merge@^4.2.1 -D
```

### 3.1 定义通用配置

像是解析文件的loader，无论是什么环境肯定都是一样的，入口，出口文件也是一样的，插件部分一样。例如：

```javascript
// webpack.base.js

// webpack是node写出来的，所以使用node的语法

let path = require('path')
let MiniCssExtractPlugin = require('mini-css-extract-plugin') // 引入插件
let HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件

// 生产环境就无所谓了，反正使用 webpack-dev-server 在内存中打包
// let { CleanWebpackPlugin } = require('clean-webpack-plugin') // 打包前 先删除原来的打包目录

// 额外静态资源文件可能会被用到，看情况
// let CopyWebpackPlugin = require('copy-webpack-plugin') // 把额外的文件打包到dist目录下


module.exports = {

    entry: './src/index.js', // 入口

    output: { // 出口
        filename: '[name].[contenthash:8].js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
        // publicPath: './build/',
    },

    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            // {
            //     test: /.(jpg|png|gif)$/, // 处理图片的loader
            //     use: {
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             // publicPath: './build/' // 这里的 publicPath 会覆盖原有的 output.publicPath
            //         }
            //     }
            // },
            {
                test: /.(jpg|png|gif)$/,
                // 做一个限制，当图片小于 多少k的时候，用base64来转化
                // 如果大于这个限制，就会使用file-loader来去解析图片，将图片打包到build目录下
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8 * 1024, // 8K = 8192byte
                        // publicPath: './build/',
                        // 如果图片小于8K的话，全部变为base64
                        // 否则使用file-loader 产出真实的图片
                    }
                },
            },

            // css-loader 解析css文件，识别css语法的
            // style-loader 把解析后的css文件 插入到head标签中
            // loader有个特点，希望单一，一个loader干一件事
            /* 
                loader的用法
                1. 只用字符串，就是只用一个loader
                2. 多个loader，需要一个数组 []，数组里可以放字符串，或者对象，对象的话就可以配置loader的参数了
            */
            // loader的顺序，默认是从右向左执行，从下往上执行
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    // {
                    //     loader: 'style-loader',
                    //     options: {
                    //         insertAt: 'top' // 插在顶部
                    //     }
                    // },
                    // MiniCssExtractPlugin 这个插件上有个loader，我们不想再用style-loader把样式放在style标签里了，所以就用它的loader
                    MiniCssExtractPlugin.loader, // 若果想抽离多个文件，可以在new一个出来，一个抽离css一个抽离less都行
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader', // 插入head标签
                    'css-loader', // 解析 @import语法 解析 css
                    'less-loader' // 把less 转换为 css
                ]
            },
        ],
    },

    plugins: [ // 是一个数组，放着所有的webpack插件
        // 插件是一个类，通过new的方式来引用，插件使用就没有先后顺序了，随便放就行

        // 引入抽离css样式的插件
        new MiniCssExtractPlugin({
            filename: 'main.css', // 告诉插件，抽离出的样式文件的名字叫什么，这里叫main.css
        }),

        // 根据模板文件，将打包生成的文件自动注入到模板文件中
        new HtmlWebpackPlugin({
            template: './index.html', // 告诉插件，是以这个目录下的index.html为模板
            filename: 'index.html', // 告诉插件，打包后的文件叫什么名字，这里也叫index.html
            // minify: {
            //     removeAttributeQuotes: true, // 把模板中能去的引号都去掉
            //     collapseWhitespace: true, // 折叠空格，就变成了一行
            // },
            // hash: true, // 引用的时候可以加一个hash戳
        }),

        // 打包前 先删除原来的打包目录
        // new CleanWebpackPlugin(),

        // 把额外的文件打包到dist目录下
        // new CopyWebpackPlugin([ // 参数可以是一个数组，可以拷贝很多文件
        //     {
        //         from: './public', // 从public目录
        //         to: './public' // 拷贝到 dist目录下的 public 目录
        //     },
        // ])
    ],
}
```

### 3.2 开发环境配置和生产环境配置

`devellopment`开发环境主要是启动本地服务，方便开发，配置如下

```javascript
// webpack.dev.js
const {smart} = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = smart(baseConfig, {
    mode: 'development', // 模式，默认两种模式， production 和 development

    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            // ...
        ]
    },
    plugins: [ // 插件
        // 插件是一个类，通过new的方式来引用，没有先后顺序了，随便放就行
    ],

    devServer: { 
        port: 3000, // 默认端口是8080，这里可以改
        progress: true, // 打包时候的进度条
        contentBase: './dist', // 以哪个文件夹作为服务的根目录 
        // open: true, // 服务启动完毕后，直接打开浏览器，
        compress: true, // 启动gzip压缩
    },
})

```

`production`生产环境配置如下，主要是添加一些优化配置。

```javascript
// webpack.dev.js
const {smart} = require('webpack-merge')
const baseConfig = require('./webpack.base')

let { CleanWebpackPlugin } = require('clean-webpack-plugin') // 打包前 先删除原来的打包目录
let CopyWebpackPlugin = require('copy-webpack-plugin') // 把额外的文件打包到dist目录下

module.exports = smart(baseConfig, {
    mode: 'production', // 模式，默认两种模式， production 和 development

    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            // ...
        ]
    },
    plugins: [ // 插件
        // 插件是一个类，通过new的方式来引用，没有先后顺序了，随便放就行

        // 打包前 先删除原来的打包目录
        new CleanWebpackPlugin(),

        // 把额外的文件打包到dist目录下
        new CopyWebpackPlugin([ // 参数可以是一个数组，可以拷贝很多文件
            {
                from: './public', // 从public目录
                to: './public' // 拷贝到 dist目录下的 public 目录
            },
        ])
    ],
})

```

这样，打包就可以设置使用`webpack.dev.js`还是`webpack.prod.js`了。可以在`package.json`中添加脚本。

```javascript
// package.json
{
  // ...
  "scripts": {
    "start": "webpack-dev-server --config webpack.dev.js",
    "build": "webpack --config webpack.config.js"
  },
}
```

运行`yarn start`开启本地服务，页面正常展示。等等，index.html中引入的xxx-sdk.js没有引入成功，哈哈，dev中没有配置`copy-webpack-plugin`没有把public复制到dist下，路径不对咯。自己尝试修改一下吧。

### 3.3 传递环境变量

`webpack`官方提供了一些官方插件，支持传递一些全局变量。用法和普通插件是一样的。

修改 `webpack.config.js`中配置

```javascript
// webpack.config.js
const webpack = require('webpack') // 引入webpack，使用webpack默认提供的插件

module.exports = {
    plugins: [ // 插件
        // 创建编译时的全局变量，在代码中可以使用，但是没有挂载到window上
        new webpack.DefinePlugin({
            // 写法1
            // DEV: '"dev"',
            // 写法2 定义字符串的时候可以使用 JSON.stringify
            ENV: JSON.stringify('development'),

            FLAG: 'true', // 这样的可以直接定义，最后用的时候 相当于直接是 FLAG === true
            EXPRESION: '1+1', // 这样子定义相当于 EXPRESION = (1 + 1) = 2
        }),
    ],
}
```

## 4. 其他常用 loader

### 4.1 babel-loader

`babel`是用来转换js代码的，将ESMAScript 2015+代码转为浏览器可以兼容版本的代码。

`babel-loader` 常用功能：

1. 转换语法：ES6 -> ES5、ES3等等
2. Polyfill语法补丁，
3. 源代码转换

```bash
yarn add @babel/core@^7.4.5 babel-loader@^8.0.6 @babel/preset-env@^7.4.5 -D
```

`webpack ` 转换语法需要使用`babel-loader`，`babel-loader`转化的时候肯定还需要用到我们的babel，核心模块的名字叫 @babel/core，这个babel的核心模块会调用transform方法来对代码进行转化。那我们还必须知道该如何转化，所以还有一个转化模块，叫 `@babel/preset-env`，可以把一些高级的语法转换为低级的语法。

```javascript
// src/index.js

const log = () => {console.log(99999);}; // 添加js语法

// 没有配置babel转换之前，原样输出，打包结果如下:
eval("// src/index.js\r\n\r\n\r\n// require('./index.css')\r\n\r\nconst log = () => {console.log(99999);};\r\n\n\n//# sourceURL=webpack:///./src/index.js?");
```

修改 `webpack.config.js`中配置

```javascript
// webpack.config.js
module.exports = {
    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            {
                test: /\.js$/, // 匹配以js结尾的文件
                use: {
                    loader: 'babel-loader',
                    options: { // 用babel-loader 需要把ES6转为ES5
                        // 配置可以写在这里，还可以写在外面
                        // 在这里添加一个预设
                        presets: [
                            '@babel/preset-env', // 这个插件就可以把ES6转ES5
                        ]
                    }
                }
            },
        ]
    },
}
```

重新运行`npx webpack`，es6语法，箭头函数被转为普通函数，打包结果如下：

```javascript
eval("// src/index.js\n// require('./index.css')\nvar log = function log() {\n  console.log(99999);\n};\n\n//# sourceURL=webpack:///./src/index.js?");
```

如果想要使用一些为加入到标准中的新语法，也可以通过`babel`转为浏览器能识别的代码，比如装饰器语法。

```javascript
// src/index.js

const log = () => {console.log(999999);};

class Test {
    @log
    say() {
        console.log('ckkk');
    }
}
```

运行 `npx webpack` 报错，报错如下:

```bash
$ npx webpack
Hash: aa2e3542f5b74a543e05
Version: webpack 4.32.2
Time: 1083ms
Built at: 2022-04-18 11:04:03 ├F10: AM┤
            Asset       Size  Chunks             Chunk Names
       index.html  380 bytes          [emitted]
 main.565d7e41.js   8.39 KiB    main  [emitted]  main
public/xxx-sdk.js   19 bytes          [emitted]
Entrypoint main = main.565d7e41.js
[./src/index.js] 4.02 KiB {main} [built] [failed] [1 error]

ERROR in ./src/index.js
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: E:\me\test\webpack\basic\src\index.js: Support for the experimental syntax 'decorators-legacy' isn't currently enabled (9:5):

   7 |
   8 | class Test {
>  9 |     @log
     |     ^
  10 |     say() {
  11 |         console.log('ckkk');
  12 |     }
  
  eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: E:\\\\me\\\\test\\\\webpack\\\\basic\\\\src\\\\index.js: Support for the experimental syntax 'decorators-legacy' isn't currently enabled (9:5):...\");\n\n//# sourceURL=webpack:///./src/index.js?");
```

安装`plugin-proposal-decorators`插件，解析装饰器语法

```bash
yarn add @babel/plugin-proposal-decorators@^7.4.4 -D
```

这个插件是帮助`babel-loader`解析对应文件中的装饰器语法的，不是webpack插件，所以通过哦配置项，传递给`babel-loader`，修改 `webpack.config.js`中配置

```javascript
// webpack.config.js
module.exports = {
    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            // ...
        ]
    },
    plugins: [ // 插件{
                test: /\.js$/, // 匹配以js结尾的文件
                use: {
                    loader: 'babel-loader',
                    options: { // 用babel-loader 需要把ES6转为ES5
                        // 配置可以写在这里，还可以写在外面
                        // 在这里添加一个预设
                        presets: [
                            '@babel/preset-env', // 这个插件就可以把ES6转ES5
                        ],
                        // 如果有一些预设的属性，需要配置一些小插件来转换还不是标准的js语法
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ]
                    }
                }
            },
    ],
}
```

重新运行`npx webpack`打包，打包成功。

>  Tips: Babel7官方有90多个插件，不过大半已经整合在@babel/preset-env和@babel/preset-react等预设里了，我们在开发的时候直接使用预设就可以了。实际开发时，大概率使用下面四个
>
> 1. @babel/preset-env
> 2. @babel/preset-flow
> 3. @babel/preset-react
> 4. @babel/preset-typescript
>
> 一个普通的vue工程，Babel官方的preset只需要配一个"@babel/preset-env"就可以了。
>
> 目前比较常用的插件只有@babel/plugin-transform-runtime，前端工程已经很少见到里使用其它的插件了。

### 4.2 @babel/preset-typescript

使用`@babel/preset-typescript`插件解析ts文件。

目前用webpack打包ts文件有两种方案

1. `ts-loader`：将ts转为js，再使用babel将js转为低版本js；
2. `@babel/preset-typescript`：直接移除TypeScript，转为JS，这使得它的编译速度飞快,并且只需要管理Babel一个编译器就行了。

安装 `@babel/preset-typescript`

```bash
yarn add @babel/preset-typescript@7.16.7 -D
```

修改 `webpack.config.js`中配置`@babel/preset-typescript`，先移除ts语法，然后剩下的就是js，使用`preset-env`，将js转为指定版本代码。

```javascript
// webpack.config.js
module.exports = {
    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            {
                test: /\.tsx?$/, // 匹配以js结尾的文件
                use: {
                    loader: 'babel-loader',
                    options: { // 用babel-loader 需要把ES6转为ES5
                        // 配置可以写在这里，还可以写在外面
                        // 在这里添加一个预设
                        presets: [
                            '@babel/preset-env', // 这个插件就可以把ES6转ES5
                            '@babel/preset-typescript', // 这个插件直接移除TypeScript，转为JS。
                        ],
                    }
                }
            },
        ]
    },
}
```

> Tips: @babel/preset-typescript是直接移除TypeScript，转为JS。那我们还有必要使用ts吗，使用后又使用loader移除，有必要吗，使用ts岂不是多此一举？
>
> 不是，ts其实是定义给编辑器看的。@typescript-eslint配合ESLint来达到检测的目的。同时使用ts附加的检查，配合现代化编辑器将类型错误发现在萌芽阶段。

### 4.3 @babel/preset-react

使用`@babel/preset-react`babel插件解析react语法。

安装`react`依赖，安装`@babel/preset-react`插件解析jsx语法。

```bash
yarn add react@17.x react-dom@17.x -S # react 稳定版 17只有两版，17.0.1和17.0.2
yarn add @babel/preset-react@7.16.7 -D
```

添加react jsx入口文件

```javascript
// src/index.jsx
import React from 'react'
import ReactDom from 'react-dom'

const App = () => {
    return (
        <div>React App</div>
    )
}

ReactDom.render(<App />, document.getElementById('root'));
```

修改打包入口文件，运行 `npx webpack` ，打包报错

```bash
$ npx webpack
Hash: 6fe61f87e7952b1b7aa7
Version: webpack 4.32.2
Time: 1011ms
Built at: 2022-04-19 9:36:20 ├F10: AM┤
            Asset       Size  Chunks             Chunk Names
       index.html  407 bytes          [emitted]
 main.886d2b27.js      4 KiB    main  [emitted]  main
public/xxx-sdk.js   19 bytes          [emitted]
Entrypoint main = main.886d2b27.js
[./src/index.jsx] 220 bytes {main} [built] [failed] [1 error]

ERROR in ./src/index.jsx 6:8
Module parse failed: Unexpected token (6:8)
You may need an appropriate loader to handle this file type.
| const App = () => {
|     return (
>         <div>App React</div>
|     )
| }
```

修改 `webpack.config.js`中配置

```javascript
// webpack.config.js
module.exports = {
    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            {
                test: /\.jsx?$/, // 匹配以js结尾的文件
                use: {
                    loader: 'babel-loader',
                    options: { // 用babel-loader 需要把ES6转为ES5
                        // 配置可以写在这里，还可以写在外面
                        // 在这里添加一个预设
                        presets: [
                            '@babel/preset-env', // 这个插件就可以把ES6转ES5
                            '@babel/preset-react', // 这个babel插件解析jsx语法
                        ],
                        // 如果有一些预设的属性，需要配置一些小插件来转换还不是标准的js语法
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ]
                    }
                }
            },
        ]
    },
}
```

重新打包，运行`npx webpack`，打包成功。index.html 展示 React App。

同理，也可以告诉解析`ts、tsx`的`babel-loader`，预设中添加`@babel/preset-react`，就可以解析`tsx`。

添加react tsx入口文件。

```typescript
// src/index.tsx
import React, {FC} from 'react'
import ReactDom from 'react-dom'

const App: FC<any> = () => {
    return (
        <div>React App With TypeScript</div>
    )
}

ReactDom.render(<App />, document.getElementById('root'));
```

修改 `webpack.config.js`中配置

```javascript
// webpack.config.js
module.exports = {
    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            {
                test: /\.tsx?$/, // 匹配以js结尾的文件
                use: {
                    loader: 'babel-loader',
                    options: { // 用babel-loader 需要把ES6转为ES5
                        // 配置可以写在这里，还可以写在外面
                        // 在这里添加一个预设
                        presets: [
                            '@babel/preset-env', // 这个插件就可以把ES6转ES5
                            '@babel/preset-react', // 这个babel插件解析react jsx语法
                            '@babel/preset-typescript', // 这个插件直接移除TypeScript，转为JS。
                        ],
                    }
                }
            },
        ]
    },
}
```

运行`npx webpack`，打包成功。index.html 展示 React App With TypeScript。但是打包提示多出来一行，当输出文件超过500KB时，webpack就会提示。当然现在这个导致文件体积超过500KB主要是因为打包使用的development模式，开发模式的react特别大，改为生产模式就行，但是随着项目的迭代，文件肯定会越来越大，webpack常用的配置优化迫在眉睫。

```bash

$ npx webpack
[BABEL] Note: The code generator has deoptimised the styling of E:\me\test\webpack\basic\node_modules\react-dom\cjs\react-dom.development.js as it exceeds the max of 500KB.
Hash: 3f675a8f57963752aa41
Version: webpack 4.32.2
Time: 3203ms
Built at: 2022-04-19 9:54:03 ├F10: AM┤
            Asset       Size  Chunks             Chunk Names
       index.html  407 bytes          [emitted]
 main.2cf186c9.js    864 KiB    main  [emitted]  main
public/xxx-sdk.js   19 bytes          [emitted]
Entrypoint main = main.2cf186c9.js
[./src/index.tsx] 273 bytes {main} [built]
    + 9 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/html-webpack-plugin/lib/loader.js!./index.html] 561 bytes {0} [built]
    [./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 863 bytes {0} [built]
    [./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 552 bytes {0} [built]
        + 1 hidden module
```

### 4.4 webpack配置总览

```javascript
// webpack.config.js

// webpack是node写出来的，所以使用node的语法

let path = require('path')
let MiniCssExtractPlugin = require('mini-css-extract-plugin') // 引入插件
let HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件
let { CleanWebpackPlugin } = require('clean-webpack-plugin') // 打包前 先删除原来的打包目录
let CopyWebpackPlugin = require('copy-webpack-plugin') // 把额外的文件打包到dist目录下


module.exports = {
    mode: 'production', // 模式，默认两种模式， production 和 development

    entry: './src/index.tsx', // 入口

    output: { // 出口
        filename: '[name].[contenthash:8].js', // 打包后的文件名
        path: path.resolve(__dirname, 'dist'), // 打包后的路径，必须是一个绝对路径
        // publicPath: './build/',
    },

    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            {
                test: /\.jsx?$/, // 匹配以js结尾的文件
                use: {
                    loader: 'babel-loader',
                    options: { // 用babel-loader 需要把ES6转为ES5
                        // 配置可以写在这里，还可以写在外面
                        // 在这里添加一个预设
                        presets: [
                            '@babel/preset-env', // 这个插件就可以把ES6转ES5
                            '@babel/preset-react', // 这个babel插件解析react jsx语法
                        ],
                        // 如果有一些预设的属性，需要配置一些小插件来转换还不是标准的js语法
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ]
                    }
                }
            },
            {
                test: /\.tsx?$/, // 匹配以js结尾的文件
                use: {
                    loader: 'babel-loader',
                    options: { // 用babel-loader 需要把ES6转为ES5
                        // 配置可以写在这里，还可以写在外面
                        // 在这里添加一个预设
                        presets: [
                            '@babel/preset-env', // 这个插件就可以把ES6转ES5
                            '@babel/preset-react', // 这个babel插件解析react jsx语法
                            '@babel/preset-typescript', // 这个插件直接移除TypeScript，转为JS。
                        ],
                    }
                }
            },
            // {
            //     test: /.(jpg|png|gif)$/, // 处理图片的loader
            //     use: {
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             // publicPath: './build/' // 这里的 publicPath 会覆盖原有的 output.publicPath
            //         }
            //     }
            // },
            {
                test: /.(jpg|png|gif)$/,
                // 做一个限制，当图片小于 多少k的时候，用base64来转化
                // 如果大于这个限制，就会使用file-loader来去解析图片，将图片打包到build目录下
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8 * 1024, // 8K = 8192byte
                        // publicPath: './build/',
                        // 如果图片小于8K的话，全部变为base64
                        // 否则使用file-loader 产出真实的图片
                    }
                },
            },

            // css-loader 解析css文件，识别css语法的
            // style-loader 把解析后的css文件 插入到head标签中
            // loader有个特点，希望单一，一个loader干一件事
            /* 
                loader的用法
                1. 只用字符串，就是只用一个loader
                2. 多个loader，需要一个数组 []，数组里可以放字符串，或者对象，对象的话就可以配置loader的参数了
            */
            // loader的顺序，默认是从右向左执行，从下往上执行
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    // {
                    //     loader: 'style-loader',
                    //     options: {
                    //         insertAt: 'top' // 插在顶部
                    //     }
                    // },
                    // MiniCssExtractPlugin 这个插件上有个loader，我们不想再用style-loader把样式放在style标签里了，所以就用它的loader
                    MiniCssExtractPlugin.loader, // 若果想抽离多个文件，可以在new一个出来，一个抽离css一个抽离less都行
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader', // 插入head标签
                    'css-loader', // 解析 @import语法 解析 css
                    'less-loader' // 把less 转换为 css
                ]
            },
        ],
    },

    plugins: [ // 是一个数组，放着所有的webpack插件
        // 插件是一个类，通过new的方式来引用，插件使用就没有先后顺序了，随便放就行

        // 引入抽离css样式的插件
        new MiniCssExtractPlugin({
            filename: 'main.css', // 告诉插件，抽离出的样式文件的名字叫什么，这里叫main.css
        }),

        // 根据模板文件，将打包生成的文件自动注入到模板文件中
        new HtmlWebpackPlugin({
            template: './index.html', // 告诉插件，是以这个目录下的index.html为模板
            filename: 'index.html', // 告诉插件，打包后的文件叫什么名字，这里也叫index.html
            // minify: {
            //     removeAttributeQuotes: true, // 把模板中能去的引号都去掉
            //     collapseWhitespace: true, // 折叠空格，就变成了一行
            // },
            // hash: true, // 引用的时候可以加一个hash戳
        }),

        // 打包前 先删除原来的打包目录
        new CleanWebpackPlugin(),

        // 把额外的文件打包到dist目录下
        new CopyWebpackPlugin([ // 参数可以是一个数组，可以拷贝很多文件
            {
                from: './public', // 从public目录
                to: './public' // 拷贝到 dist目录下的 public 目录
            },
        ])
    ],

    devServer: {
        port: 3000, // 默认端口是8080，这里可以改
        progress: true, // 打包时候的进度条
        contentBase: './dist', // 以哪个文件夹作为服务的根目录 
        // publicPath: '/dist', // 以哪个文件夹作为服务的根目录 
        // open: true, // 服务启动完毕后，直接打开浏览器，
        compress: true, // 启动gzip压缩
    },
}
```

