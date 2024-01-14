# 实现mini-react

## day 2:

> 目标： 为避免虚拟DOM过大，导致浏览器无法响应，采用分治的思想，把大任务给拆分为小的任务
> 利用 `requestIdleCallback(callback)` 在浏览器空闲时渲染

```javascript
 // requestIdleCallback() 方法插入一个函数，这个函数将在浏览器空闲时期被调用
requestIdleCallback(workLoop);

function workLoop(deadline) {
    //  timeRemaining() 方法，用来判断用户代理预计还剩余多少闲置时间
    console.log("🚀 ~ workLoop ~ deadline:", deadline.timeRemaining());
}
```

### 分析

> 为避免虚拟DOM过大，导致浏览器无法响应，采用分治的思想，把大任务给拆分为小的任务
> 利用 `requestIdleCallback(callback)` 在浏览器空闲时渲染
> 利用浏览器空闲时渲染，当浏览器空闲时间小于1的时候，让出执行权
> 所以需要把 `render` 过程拆分为一段一段的，分段执行
> 通过使用链表维护执行顺序


### 实现

```javascript




// 2.2 封装创建DOM的工具函数
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                return typeof child === 'string' ? createTextNode(child) : child
            })
        },
    }
}
function createTextNode(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        },
    }
}





const render = (vDom, container) => {
    nextWorkOfUnit = {
        dom: container,
        child: [vDom],
    };

    // const { type, props } = vDom;
    // const dom = type === 'TEXT_ELEMENT' ? document.createTextNode("") : document.createElement(type);
    // Object.keys(props).forEach(key => {
    //     if (key !== 'children') {
    //         dom[key] = props[key];
    //     }
    // })

    // props.children.forEach(child => {
    //     render(child, dom)
    // })

    // container.append(dom)
}

let nextWorkOfUnit = null;
function workLoop(deadline) {
    let isShouldYield = false;

    while (!isShouldYield) {
        // run task
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);


        isShouldYield = deadline.timeRemaining() < 1;
    }

    requestIdleCallback(workLoop);
}

function performWorkOfUnit(work) {
    if (!work.dom) {

        // 1. 创建DOM
        const dom = (work.dom = work.type === 'TEXT_ELEMENT' ? document.createTextNode("") : document.createElement(work.type));
        work.parent.dom.append(dom);
    }
    // 2. 处理props
    Object.keys(work.props).forEach(key => {
        if (key !== 'children') {
            dom[key] = work.props[key];
        }
    })
    // 3. VDOM转换成链表结构， 设置好指针（执行顺序）
    const children = work.props.children;
    let preChild = null;
    children.forEach((child, index) => {
        const newWork = {
            type: child.type,
            props: child.props,
            child: null,
            parent: work,
            sibling: null,
            dom: null,
        }

        if (index === 0) {
            work.child = newWork;
        } else {
            preChild.sibling = newWork;
        }
        preChild = newWork;
    })
    // 4. 返回下一个要执行的任务
    if (work.child) {
        return work.child;
    }

    if (work.sibling) {
        return work.sibling;
    }


    return work.parent?.sibling;
}

requestIdleCallback(workLoop); // requestIdleCallback() 方法插入一个函数，这个函数将在浏览器空闲时期被调用





// 第四部，拆分文件
// React提供{render, createElement}
// ReactDom 对外暴露入口 createRoot
// ReactDom.createRoot(document.getElementById('root')).render(<App/>)

const React = {
    render,
    createElement,
}

export default React;
```

为避免虚拟DOM过大，导致浏览器无法响应，采用分治的思想，把大任务给拆分为小的任务
利用 `requestIdleCallback(callback)` 在浏览器空闲时渲染
利用浏览器空闲时渲染，当浏览器空闲时间小于1的时候，让出执行权
所以需要把 `render` 过程拆分为一段一段的，分段执行
通过使用链表维护执行顺序