const fs = require('fs');

// 1. 读取文件
const data = fs.readFileSync('./example.txt', 'utf-8');
console.log("🚀 ~ data:", data)
