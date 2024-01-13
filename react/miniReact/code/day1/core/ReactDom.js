import React from './React.js';
// ReactDom.createRoot(document.getElementById('root')).render(<App/>)
const ReactDom = {
    createRoot: (container) => {
        return ({
            render: (vDom) => {
                React.render(vDom, container)
            }
        })
    }
}


export default ReactDom