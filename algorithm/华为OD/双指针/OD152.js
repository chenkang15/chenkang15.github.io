
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
购买三件商品的最大花费，任意组合
如果商品列表是乱序的，购买三个商品的最大花费，就需要三个指针，穷举计算出所有组合的价值
但如果商品列表是有序的，升序，就只需要计算窗口内商品的价值，
如果窗口价值高于总钱数，缩小窗口，低于总钱数，扩大窗口，移动窗口到尾部，且窗口的价值小于总价值
滑动窗口这个思路不对，并且我也不会写
不对的原因是，假设升序列表是 1，2，3，4，5，6，7，8，9，10
钱总数是10，让选三个物品，而连续的三个物品最大价值是 2，3，4 = 9。而 2 + 3 + 5 = 10，是最大的，
所以连续的的不一定是最大价值。需要移动三个指针去穷举所有组合，

而移动指针的思路是定义三个指针
L, 指针的移动返回是从0 - n-1,
M, 指针是从 L+1
R, 指针是从 n-1 开始移动，

如果 三个指针的总和 sum 大于 总钱数 money，需要缩小，R 指针左移，总和减小
如果 三个指针的总和 sum 小于 总钱数 money，记录结果，当前有可能是最大的， L 指针右移，总和增大
如果 三个指针的总和 sum 等于 总钱数 money，直接返回，必然是最大的

移动L指针，穷举所有可能


*/
(async () => {
    const list = (await readline()).split(',').map(Number).sort((a, b) => a - b);
    const money = parseInt(await readline());

    if (list.length < 3) {
        return -1
    }
    
    let maxSum = -1;
    for (let l = 0; l < list.length; l++) {
        let m = l+1;
        let r = list.length - 1;

        while (m < r) {
            let sum = list[l] + list[m] + list[r];
            if (sum < money) {
                maxSum = Math.max(maxSum, sum);
                m++
            } else if (sum > money) {
                r--
            } else {
                maxSum= sum;
                break
            }
        }
    }
    console.log("======  maxSum:", maxSum);
    rl.close();
})();
