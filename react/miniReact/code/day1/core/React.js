


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
    const { type, props } = vDom;
    const dom = type === 'TEXT_ELEMENT' ? document.createTextNode("") : document.createElement(type);
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key];
        }
    })

    props.children.forEach(child => {
        render(child, dom)
    })

    container.append(dom)
}


// 第四部，拆分文件
// React提供{render, createElement}
// ReactDom 对外暴露入口 createRoot
// ReactDom.createRoot(document.getElementById('root')).render(<App/>)

const React = {
    render,
    createElement,
}

export default React;