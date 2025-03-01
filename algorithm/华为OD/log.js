const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,    // 输入源（默认 stdin）
    output: process.stdout,   // 输出源（默认 stdout）
    prompt: '>'             // 可选：输入提示符（类似终端）
  });


  rl.question('请输入你的名字：', (name) => {
    console.log(`你好，${name}！`);
    rl.close(); // 关闭接口
  });


  // 创建 MessageChannel
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

// 设置 port1 的消息处理函数
port1.onmessage = (event) => {
    console.log('Received by port1:', event.data);
    port1.postMessage('Reply from port1'); // 向 port2 发送回复消息
};

// 设置 port2 的消息处理函数
port2.onmessage = (event) => {
    console.log('Received by port2:', event.data);
};

// 通过 port2 发送消息给 port1
port2.postMessage('Message from port2');