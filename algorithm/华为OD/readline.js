// 可写流，用于向标准输出写入数据。
// process.stdout.write('Hello, World!\n');
// 可写流，用于向标准错误输出写入数据。
// process.stderr.write('这是一个错误消息\n');
// 可读流，用于从标准输入读取数据。
// process.stdin.on('data', (data) => {
//     console.log(`用户输入：${data}`);
// });
// const readline = require('readline');

// const rl = readline.createInterface({
//   input: inputStream,  // 可读流，默认为 process.stdin
//   output: outputStream, // 可写流，默认为 process.stdout
//   prompt: '> ',        // 提示符，默认为 '> '
//   terminal: true       // 是否启用终端模式，默认为 true
// });

const rl = require("readline").createInterface({
    input: process.stdin
});
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

console.log('start ....');

(async () => {
    let i = 0;
    while (i < 5) {
        const inputStr = await readline()
        console.log('打印', inputStr)
        i++
    }
})()