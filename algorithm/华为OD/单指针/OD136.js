
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
黄金宝箱满足排在它之前的所有箱子数字和等于排在它之后的所有箱子数字之和；
第一个箱子左边部分的数字和定义为0；最后一个箱子右边部分的数字和定义为0.

定义 leftSum = 0, 求出 总的rightSum,
当宝箱是 序号0， 左和 0 ，右和 rightSum - list[0]
当宝箱是 序号1， 左和 0 + list[0] ，右和 rightSum - list[0] - list[1]
当宝箱是 序号2， 左和 0 + list[0] + list[1]，右和 rightSum - list[0] - list[1] - list[2]
当宝箱是 序号3， 左和 0 + list[0] + list[1]+ list[2]，右和 rightSum - list[0] - list[1] - list[2] - list[3]

即定义一个leftSum，用于统计左数组的和，初始为0

定义一个rightSum，用于统计右数组的和，初始为sum(list)

然后，开始从 i = 0，开始遍历输入的数组list的每一个元素list[i]，

leftSum += list[i - 1]

rightSum -= list[i]
*/
(async () => {
    const list = (await readline()).split(',').map(Number);
    let leftSum = 0;
    let rightSum = list.reduce((pre, cur) => pre + cur);
    let res = -1;
    // i = 0 是特殊的，因为 list[i - 1] 不存在
    // 两种处理手段，一个是兼容 list[i - 1] || 0
    // 一种是提前判断，因为宝箱是0的时候，左值是 0 ，右值 是 总rightSum - list[0]
    // 单独写 if 判断，然后循环就可以从 i = 1的时候开始循环了，这样数组取值就不会越界了
    // if (leftSum === rightSum - list[0]) {
    //     return 0
    // }
    for (let i = 0; i < list.length; i++) {
        leftSum += list[i - 1] || 0;
        rightSum -= list[i];
        if (leftSum === rightSum) {
            res = i;
            break
        }
    }
    console.log("======  res:", res)
    rl.close();
})();