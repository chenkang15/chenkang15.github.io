
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
x#y = 4*x+3*y+2
x$y = 2*x+y+3
其中 x、y 是无符号整数
地球人公式按C语言规则计算
火星人公式中，#的优先级高于$，相同的运算符，按从左到右的顺序计算

方法一：
因为 #的优先级高于$，相同的运算符，按从左到右的顺序计算
使用正则 先匹配出 x#y，能获得 x,y 的值，然后按照 4*x+3*y+2 计算出 x#y
按照从左到右的顺序计算，把#符号算完，剩下的就是 $ 符号
然后 使用正则 先匹配出 x$y

方法二：
使用replace对字符串进行替换
*/
(async () => {
    const encryption = await readline();
    const reg1 = /(\d+)#(\d+)/
    const reg2 = /(\d+)\$(\d+)/
    let opStr = encryption;
    let target = opStr.match(reg1);
    while (target) {
        const [curTarget, x, y] = target;
        opStr = opStr.replace(curTarget, 4*(+x)+3*(+y)+2);
        console.log("🚀 #### opStr:", opStr)
        target = opStr.match(reg1);
    }
    target = opStr.match(reg2);
    while (target) {
        const [curTarget, x, y] = target;
        opStr = opStr.replace(curTarget, 2*(+x)+(+y)+3);
        target = opStr.match(reg2);
    }
    console.log(opStr)
    rl.close();
})();


/*
方法二：
使用replace对字符串进行替换
replace 方法，替换字符串，如果是正则的化，且有捕获组，
则第二个参数如果是函数的话，参数分别是，匹配字符串，第一个捕获组，第二个捕获组
同match函数
*/
(async () => {
    const encryption = await readline();
    const reg1 = /(\d+)#(\d+)/
    const reg2 = /(\d+)\$(\d+)/
    let opStr = encryption;
    while (opStr.includes('#')) {
        opStr = opStr.replace(reg1, (match, x, y) => 4*Number(x)+3*Number(y)+2)
    }
    opStr = opStr.split('$').reduce((x, y) => {
        return 2*Number(x)+Number(y)+3
    })
    console.log(opStr)
    rl.close();
})();
