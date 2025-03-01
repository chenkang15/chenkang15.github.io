
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
初始化一个m*n的数组
广度遍历每匹马走n步，到达点 格式为 id_步数
遍历数组，看是否所有马到达
输出所有马到达同一点的最小步数
*/
(async () => {
    const [m, n] = (await readline()).split(' ').map(Number);
    const grid = [];
    for (let i = 0; i < m; i++) {
        const row = (await readline()).split('');
        grid.push(row)
    }

    const signGrid = Array.from({
        length: m
    }, () => Array.from({
        length: n
    }, () => null));

    const offsets = [
        [+1, +2],
        [+1, -2],
        [+2, +1],
        [+2, -1],
        [-1, +2],
        [-1, -2],
        [-2, +1],
        [-2, -1],
    ]
    let hourseNum = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const hourse = grid[i][j]
            if (hourse !== '.') {
                hourseNum++
                hourseMove(i, j, Number(hourse), `${i}_${j}`)
            }
        }
    }

    console.log('????', signGrid, hourseNum)

    function hourseMove(i, j, k, id) {
        const queue = [];
        queue.push([i, j, k, id]);
        // signGrid[i][j] = [`${id}_0`];
        signGrid[i][j] = {[id]: 0};
        let num = 0;

        while (queue.length) {
            const [x, y, step] = queue.shift();
            num++;
            for (let [offsetX, offsetY] of offsets) {
                const newX = x + offsetX;
                const newY = y + offsetY;
                if (
                    newX < 0 || newX >= m ||
                    newY < 0 || newY >= n ||
                    num > step
                ) {
                    continue
                }

                if (
                    signGrid[newX][newY]
                ) {
                    // for (let set of signGrid[newX][newY]) {
                    //     const matchGroup = set.match(new RegExp(`^(${id})_(\\d)`));
                    //     if (!matchGroup) {
                    //         continue
                    //     }
                    //     const [, name, s] = matchGroup;
                    //     if (name !== id) {
                    //         signGrid[newX][newY].push(`${id}_${num}`);
                    //     }
                    //     if (name === id && +num < +s) {
                    //         signGrid[newX][newY].push(`${id}_${num}`);
                    //     }
                    // }
                    const s = signGrid[newX][newY][id];
                    if (+num < +s ) {
                        signGrid[newX][newY][id] = +num
                    }
                } else {
                    // signGrid[newX][newY] = [`${id}_${num}`];
                    signGrid[newX][newY] = {[id]: num};
                }

                queue.push([newX, newY, k - 1, id]);

            }
        }
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const hourseSet = signGrid[i][j];
            if (hourseSet ) {
                console.log("🚀 ~ hourseSet:", hourseSet)
            }
        }
    }

    rl.close();
})();
