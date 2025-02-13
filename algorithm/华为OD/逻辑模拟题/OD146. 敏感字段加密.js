
// --------------------------------------------------------
const rl = require('readline').createInterface({
    input: process.stdin
});
// --------------------------------------------------------
const iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;
// ========================================================
// ========================================================
// ========================================================

/*
字符串长度小于等于127字节，只包含大小写字母，数字，下划线和偶数个双引号；
命令字之间以一个或多个下划线_进行分割；
可以通过两个双引号””来标识包含下划线_的命令字或空命令字（仅包含两个双引号的命令字），双引号不会在命令字内部出现；
请对指定索引的敏感字段进行加密，替换为******（6个*），并删除命令字前后多余的下划线_。 如果无法找到指定索引的命令字，输出字符串ERROR。

命令字的规则
0 - 第一个 _ 为一个命令字
遇到 " 后，直到再次遇到 " 为一个命令字

方法一：
采用双指针穷举的，
注意结束循环的条件
*/
(async () => {
    const encryptIdx = Number(await readline());
    const str = await readline();
    const commands = [];
    let command = '';
    let commandSplitSign = '_'
    for (let i = 0; i < str.length; i ++ ) {
        for (let j = i; j < str.length; j ++ ) {
            if (str[j] !== commandSplitSign) {
                command += str[j];
            } else if (str[j] === commandSplitSign) {
                i = j + 1;
                command && commands.push(command);
                command= '';
            } else if (command.length === 0 && (str[j] === "\"" || str[j] === "\'")) {
                commandSplitSign = str[j]
            } else if (str[j] === "\"" || str[j] === "\'") {
                commandSplitSign = '_'
            }
            if (command && j === str.length - 1) {
                i = j+ 1;
                commands.push(command);
            }
        }
    }
    if (!commands[encryptIdx]) {
        console.log('ERROR')
    } else {
        console.log(commands.reduce((pre, cur, idx) => {
            pre += idx !== encryptIdx ? (!idx ? cur : `_${cur}`) : '_******'
            return pre;
        }, ""))
    }
    rl.close();
})();



/*
字符串长度小于等于127字节，只包含大小写字母，数字，下划线和偶数个双引号；
命令字之间以一个或多个下划线_进行分割；
可以通过两个双引号””来标识包含下划线_的命令字或空命令字（仅包含两个双引号的命令字），双引号不会在命令字内部出现；
请对指定索引的敏感字段进行加密，替换为******（6个*），并删除命令字前后多余的下划线_。 如果无法找到指定索引的命令字，输出字符串ERROR。

命令字的规则
0 - 第一个 _ 为一个命令字
遇到 " 后，直到再次遇到 " 为一个命令字

方法一：
采用双指针穷举的，
注意结束循环的条件
方法二：
不在双引号中的 _ 是分隔符
因此遍历字符串时
若c == '_'，且c不在双引号范围内，则此时 c时命令字分隔符，可以截断命令字
其余情况，c都可以当作命令字的组成字符

如何判断 _ 是否在双引号范围内呢
定义一个哨兵变量 isQuotaFlag，
若 isQuotaFlag == true，则说明双引号开启，遇到的字符都是在双引号内部的
若 isQuotaFlag == false， 则说明双引号闭合，遇到的字符都不在双引号内部的
遍历字符串遇到双引号对 isQuotaFlag 取反即可
*/
// 方法二：
(async () => {
    const encryptIdx = Number(await readline());
    const s = await readline();
    const str = s+ '_';
    const commands = [];
    let command = '';
    let commandSplitSign = '_'
    let isQuotaFlag = false;

    for (let i = 0; i < str.length; i++) {
        const c = str[i];
        if (c !== '_' || isQuotaFlag) {
            command += c;
        } else if (c === '"') {
            isQuotaFlag = !isQuotaFlag
        } else if (c === '_' && command) {
            commands.push(command);
            command = ''
        }
    }

    if (!commands[encryptIdx]) {
        console.log('ERROR')
    } else {
        commands[encryptIdx] = '******'
        console.log(commands.join('_'))
    }
    rl.close();
})();