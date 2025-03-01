
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

方法一：

排序
穷举所有组合
定义两个指针，
i 从0-n-1-1
j 从i+1到 n-1
比较 i+ j是否大于最低能力值
两人< 最低能力值， j指针 右移

两人等于最低能力值，分一对
两人> 最低能力值， 分一对, 记录j指针，代表用过

usedMap
1，3，5，7，9
*/
(async () => {
    const n = parseInt(await readline())
    const users = (await readline()).split(' ').map(Number).sort((a, b) => a- b);
    const low = parseInt(await readline())

    const usedMap = {};
    let res = 0;
    for (let i = 0; i < n; i++) {
        let j = i + 1;
        while(j < n) {
            if (usedMap[j]) { // 一个人只能被用一次
                j++;
                continue
            }
            const sum = users[i] + users[j];
            if (sum < low) {
                j++
            } else { // 大于等于最低值
                res++;
                usedMap[j] = 1
                break
            }
        }
    }
    console.log("======  res:", res)
    rl.close();
})();



/*
方法二：
组队要求是：
可以1人组队，也可以2人组队
团队的能力值之和需要大于等于最低能力minCap要求
1. 为了尽可能多组队尽量让单人组队，即：
需要将能力值大于等于minCap的筛选出来，单人组队

2. 剩余的人，按照能力值升序排序，定义L,R指针，初始时L=0，R=k-1，k是剩余人总数
接着尝试L，R进行组队：
如果L，R两人的能力之和大于等于minCap，则组队成功，L++，R--
否则，说明L无法和任何人组队，因为R已经是当前最高能力的人，L无法和R组队，则也意味着无法和能力值比R低的人组队，
因此L++，让L++ 和队尾的人组队
*/
(async () => {
    const n = parseInt(await readline())
    const users = (await readline()).split(' ').map(Number).sort((a, b) => a- b);
    const low = parseInt(await readline())

    let res = 0;
    let l = 0;
    let r = n - 1;
    // 单人组队
    while (r >= l && users[r] > low) {
        r--;
        res++;
    }

    while (l < r) {
        const sum = users[l] + users[r];
        if (sum >= low) { // 组队成功，L++，R--
            l++;
            r--;
            res++;
        } else { // r 是当前能力最高的了，r不行，l这个人没救了，l右移，下一位
            l++
        }
    }
    console.log("======  res:", res)
    rl.close();
})();
