console.log('es module 111');

// 目标： 使用虚拟DOM，把内容绘制到网页上


// 第一步： 使用js绘制内容
// 第二步： 创建虚拟DOM
// 2.1 定义虚拟DOM的结构 type、props、children
// 2.2 封装创建DOM的工具函数
// 第三步： 将虚拟DOM绘制到页面上

// 第一步： 使用js绘制内容
// const dom = document.createElement('div');
// dom.id = 'App';
// const textNode = document.createTextNode("");
// textNode.nodeValue = 'hello world';
// dom.append(textNode);
// document.getElementById('root').append(dom);



// 第二步： 创建虚拟DOM
const textVDom = {
    type: 'TEXT_ELEMENT',
    props: {
        nodeValue: 'hello world',
        children: []
    }
}
const vDom1 = {
    type: 'div',
    props: {
        id: 'App',
        children: [
            {
                type: 'TEXT_ELEMENT',
                props: {
                    nodeValue: 'hello world',
                    children: []
                }
            }
        ]
    }
}


// const dom = document.createElement('div');
// dom.id = vDom.props.id;
// const textNode = document.createTextNode("");
// textNode.nodeValue = textVDom.props.nodeValue;
// dom.append(textNode);
// document.getElementById('root').append(dom);


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

const vDom2 = createElement('div', { id: 'App' }, 'hello world', '你好');

// const dom = document.createElement('div');
// dom.id = vDom.props.id;
// const textNode = document.createTextNode("");
// textNode.nodeValue = textVDom.props.nodeValue;
// dom.append(textNode);
// document.getElementById('root').append(dom);
// 第三步： 将虚拟DOM绘制到页面上


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

const vDom = createElement(
    'div',
    { id: 'App' },
    'hello world',
    createElement('p', null, 'study')
);

render(vDom, document.getElementById('root'));

// 第四部，拆分文件
// React提供{render, createElement}
// ReactDom 提供将虚拟DOM转为真实DOM能力 createRoot
// ReactDom.createRoot(document.getElementById('root')).render(<App/>)