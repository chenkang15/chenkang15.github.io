
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
3<4<5<6<7<8<9<10<J<Q<K<A<2<B(小王)<C(大王)
最大的顺子：3-4-5-6-7-8-9-10-J-Q-K-A
构建最大的顺子升序顺子队列
遍历手中的牌和已经出的牌，每张牌最多有四张，把已经四张的牌从队列中移除(标记)
遍历记录最长的顺子
*/
(async () => {
    const mine = (await readline()).split('-');
    const used = (await readline()).split('-');
    const maxArr = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const nulMap = {};
    const usedMap = {};

    markUserNull(mine);
    markUserNull(used);

    let maxlen = 0;
    let res = []
    for (let i = 0; i < maxArr.length; i++) {
        const cur = maxArr[i];
        if (nulMap[cur]) {
            continue
        }
        let r = i + 1;
        let order = [];
        order.push(cur);
        while (r < maxArr.length) {
            const next = maxArr[r];
            if (nulMap[next] ) {
                i = r;
                break
            }
            order.push(next);
            
            if (order.length >= 5) {
                if (order.length < maxlen) {
                    // i - r-1 短了，啥都不用做
                } else if (order.length === maxlen) {
                    // 当前顺子的长度等于最大的长度
                    // 序列最大的记录 1,2,3,4,5 < 2,3,4,5,6
                    // 不用想后遍历的替换前遍历的
                    res = order
                } else {
                    maxlen = order.length;
                    res = order
                }
            }
            r++
        }
    }
    function markUserNull(arr) {
        for (let i = 0; i < arr.length; i++) {
            usedMap[arr[i]] = (usedMap[arr[i]] || 0) + 1;

            if (usedMap[arr[i]] === 4) {
                nulMap[arr[i]] = 1;
            }
        }
    }

    console.log(maxlen ? res : 'NO-CHAIN')
    // NO-CHAIN
    rl.close();
})();