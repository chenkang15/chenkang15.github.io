# webpack 常见优化



修改 `webpack.config.js`中配置

```javascript
// webpack.config.js
module.exports = {
    // 其他...
    module: { // 模块
        rules: [ // 规则，在这里面配置各种loader
            // ...
        ]
    },
    plugins: [ // 插件
        // 插件是一个类，通过new的方式来引用，没有先后顺序了，随便放就行
    ],
}
```



**2. **

### 



```bash

```





------

------

------

# Webpack 源码分析

#### 配置文件的名字为什么默认是webpack.config.js

1. 默认运行的是/node_modules/webpack

2. 然后会默认调webpack-cli

3. 在对应的bin文件夹下，会使用config-yargs.js来解析配置文件

4. 里面有个默认名字的配置

   ```bash
   // \node_modules\webpack-cli\bin\config\config-yargs.js

   config: {

       // ...

       defaultDescription: "webpack.config.js or webpackfile.js",

       // ...

   },
   ```


所以除了使用webpack.config.js命名，还可以使用webpackfile.js，我们一般使用前者。







## Loader

webpack只能解析js模块，所以对于css需要使用loader来解析

1. loader就是一个代码转换器，可以将我们的代码转换成一个模块。
2. loader的解析方式是从右到左，从下到上来解析
3. loader遵循单一功能原则，一个loader就干一个事
4. css-loader 可以来解析 css文件，比如 @import语法
5. style-loader 可以将解析的css文件插入到head标签里
6. less-loader 可以将less 文件解析为css





优化

压缩