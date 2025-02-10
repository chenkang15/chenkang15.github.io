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
所有发动机围成一个圆环，发动机 0 和 发动机n-1是相邻的
所以 发动机 i 与发动机j之间，
有两种关联方式，即一个从左边，一个从右边。
路径间隔分别是 abs(i - j)，n - abs(i - j)，
那么如果启动点是i，那么关联点j的启动时间就是 ti + Min(abs(i - j), n - abs(i - j))
如果只有一种关联方式，那么发动机 0 和 发动机n-1之间就有n个间隔

定义n个发动机被启动的时间定义为无穷大，然后循环穷举每个点被其他发动机启动的时刻
保留最小的时间
*/
(async () => {
    const [n, e] = (await readline()).split(' ').map(Number);
    const runTimes = Array.from({
        length: n
    }, () => 2 * n + 1);
    
    for (let i = 0; i < e; i++) {
        const [t, p] = (await readline()).split(' ');
        runTimes[p] = t; // 设置发动机的手动启动时刻
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const innerTime = Math.abs(j - i);
            const outerTime = n - Math.abs(j - i);
            // 最短时间
            const dis = Math.min(innerTime, outerTime);
            // 比较初始化关联启动时间 和 被发动机i关联启动的时间
            // 因为默认初始化关联启动时间巨大，肯定大于只有被手动启动发动机关联启动
            // 循环穷举后，保留下来的一定是被某个手动启动发动机关联启动的最小时间
            runTimes[j] = Math.min(runTimes[j], runTimes[i] + dis)
            // console.log("🚀 ~ runTimes[j], runTimes[i] + dis:", runTimes[j], runTimes[i] + dis)
        }
    }

    let max = 0;
    const laters = []
    for (let i = 0; i < n; i++) {
        if (runTimes[i] < max) {
            continue
        }
        if (runTimes[i] > max) {
            laters.length = 0;
            max = runTimes[i]
        }
        laters.push(i)
    }
    console.log(laters.length)
    console.log(laters.sort((a, b) => a - b))
    rl.close();
})();