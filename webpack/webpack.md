# Webpack

## 一些核心概念

+ entry
+ output

+ chunk
+ bundle

由 entry 入口文件开始检索，将具有依赖关系的模块生成一颗依赖树，最终得到一个 chunk。
由 这个 chunk 打包生成的产物称为 bundle

entry 会形成 chunk ， chunk 和 bundle 对应