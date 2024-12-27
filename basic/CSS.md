## 重绘 repaint 和 重排 reflow

1. 重排会引起重绘，重绘是元素外观改变，如颜色，背景色，不会影响到其他元素
2. 重排会重新计算尺寸和布局，可能会影响其他元素的位置

> 减少重排的方法
+ 集中修改样式，或者直接切换 css class
+ 修改前先设置 display：none，脱离文档流
+ 使用BFC特性，不影响其他元素的位置
+ 频繁触发（resize， scroll），使用节流，防抖，降低触发次数
+ 使用createDocumentFragment 批量操作DOM
+ 优化动画，使用CSS3和requestAnimationFrame


## BFC

+ Block Format Context 块级格式化上下文
+ 内部的元素无论如何改动，都不会影响其他元素的位置

### 触发BFC 块级格式化上下文

1. 根节点html
2. float： left/right
3. overflow：auto/scroll/hidden
4. display： inline-block/table/table-row/table-cell
5. display：flex/grid；的直接子元素
6. position：absolute/fixed