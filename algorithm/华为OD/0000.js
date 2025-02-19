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
原本的思路是拿到目标的所有路径
但是代码实现
因为dfs，是按照访问顺序去遍历的，
导致如果先访问的顺序是通的，就不会在去访问其他顺序
如何才能实现深度优先的全遍历呢
*/
(async () => {
    const n = await readline();
    const data = (await readline()).split(' ').map(Number);
    const m = await readline();
    const secrets = [];
    const used = Array.from({
        length: m
    }, () => Array.from({
        length: n
    }, () => false))

    for (let i = 0; i < m; i++) {
        const secret = (await readline()).split(' ').map(Number);
        secrets.push(secret);
    }

    const paths = [];
    const idxSumMap = {};

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < m; j++) {
            const path = dfs(i, j, 0, []);
            console.log("🚀 ~ path:", path)
            if (path.length) {
                paths.push(path);
                idxSumMap[paths.length - 1] = getSum(path);
            }
        }
    }
    
    if (!paths.length) {
        console.log('error')
    }
    if (paths.length === 1) {
        console.log(paths[0].join(' '))
    }
    let min = Infinity;
    let minIdx = -1;
    Object.keys(idxSumMap).forEach((idx) => {
        if (idxSumMap[idx] < min) {
            minIdx = idx
        }
    })
    console.log("🚀 ~ paths:", paths[minIdx].join(' '), paths)
    
    function dfs(i, j, k, s) {
        if (
            i < 0 || i > m ||
            j < 0 || j > m ||
            secrets[i][j] !== data[k] ||
            used[i][j]
        ) {
            return []
        }

        s.push(`${i} ${j}`);
        used[i][j] = true;

        if (s.length === +n) {
            return s;
        }

        const next = (
            dfs(i - 1, j, k + 1, s).length ||
            dfs(i, j - 1, k + 1, s).length ||
            dfs(i, j + 1, k + 1, s).length ||
            dfs(i + 1, j, k + 1, s).length
        )

        if (!next) {
            used[i][j] = false;
            s.pop();
            return []
        }

        return s
    }

    function getSum (path) {
        return path.reduce((pre, cur) => {
            const [x, y] = cur.split(' ').map(Number)
            return pre + x + y
        }, 0)
    }
    rl.close();
})();