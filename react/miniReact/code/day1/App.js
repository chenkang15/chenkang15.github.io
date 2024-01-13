import ReactDom from './core/ReactDom.js';
import React from './core/React.js'



const App = React.createElement(
    'div',
    { id: 'App' },
    'hello world',
    React.createElement('p', null, 'good good study, day day up!')
);

ReactDom.createRoot(document.getElementById('root')).render(App)