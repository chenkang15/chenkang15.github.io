
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
0,0 位置为1，上下左右把0元素转换为1，看足够长时间后，矩阵还剩下多少非1元素
从0,0位置遍历，每次可以上下左右移动，遇到2，不能移动，遇到0 转换为1，放入队列中，
最后遍历矩阵，看还剩多少非1 元素
需要记录路径，访问过后改为的1元素，没必要继续放入队列中


*/

const offsets = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
];
let matrx = [];
let visited = [];
(async () => {
    const [m, n] = (await readline()).split(' ').map(Number);
    for (let i = 0; i < m; i++) {
        const row = (await readline()).split(' ').map(Number);
        matrx.push(row);
        visited.push(Array.from({
            length: row.length
        }, () => false));
    }

    bfs();

    let num = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrx[i][j] !== 1) {
                num++
            }
        }
    }

    console.log(num);
    rl.close();
})();

function bfs() {
    const queue = [
        [0, 0]
    ]; // 初始化0，0固定为1，开始传递
    matrx[0][0] = 1;
    visited[0][0] = true;

    while (queue.length) {
        const [x, y] = queue.shift();
        for (let offset of offsets) {
            const newX = x + offset[0];
            const newY = y + offset[1];
            
            
            if (
                newX >= 0 && newX < matrx.length &&
                newY >= 0 && newY < matrx[0].length &&
                !visited[newX][newY] &&
                matrx[newX][newY] === 0 
            ) {
                // 只有0节点才入队列，其实就没必要维护visited数组了，
                // 因为被访问后的节点都已经变成0了，不会再被放入队列中了
                matrx[newX][newY] = 1;
                visited[newX][newY] = 1;
                queue.push([newX, newY]);
            }
        }
    }
}