const fs = require('fs');
// 创建可读流
const fileStream = fs.createReadStream('./example.txt');
// 创建 readline 接口
const rl = require('readline').createInterface({
    input: fileStream,
    crlfDelay: Infinity // 识别所有换行符
});
// --------------------------------------------------------
// const rl = require('readline').createInterface({
//     input: process.stdin
// });
// --------------------------------------------------------
const iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;
// ========================================================
// ========================================================
// ========================================================

/*

*/
(async () => {
    rl.close();
})();