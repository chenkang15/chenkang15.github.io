



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