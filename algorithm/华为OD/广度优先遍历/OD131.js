
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
首先，根据输入得到一个地图矩阵。

然后，定义一个visited集合，用于记录访问过的点的坐标，或者将访问过的点赋值为0，避免一些点被二次访问。

之后，开始遍历矩阵的每一个元素，如果

该元素的值>0（代表有价值）
该元素位置未被访问过
那么就可以从该点向上、下、左、右四个方向开始广搜。
*/

/*穷举每一点，看该点的相邻点的总价值是多少
因为要找出最大价值堆，初始化 worth 一个最小值，然后遍历，
如果某点的价值高过 worth，替换
如果该点是 0 ，无价值，跳过，探索下一个点

bfs 广度搜索
如果新点超过边界，或者访问过，或者没有价值 === 0 ，就跳过

如果该点有价值，就加入队列，标记访问

visited
matrix
*/
const offsets = [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0],
];
let matrix = [];
let visited = [];
(async () => {
    let line
    while (line = (await readline())) {
        matrix.push([...line]);
        visited.push(Array.from({length: line.length}, () => false));
    }

    let worth = -1;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] !== 0 || !visited[i][j]) {
                worth = Math.max(worth, bfs(i, j))
            }
        }
    }
    console.log(worth)
    rl.close();
})();


function bfs (i, j) {
    const queue = [[i, j]];
    let worth = parseInt(matrix[i][j]);
    visited[i][j] = true
    while (queue.length) {
        const [x, y] = queue.shift();
        for (let offset of offsets) {
            const newX = x + offset[0];
            const newY = y + offset[1];

            if (
                newX <0 || newX >= matrix.length||
                newY <0 || newY >= matrix[0].length||
                matrix[newX][newY] === '0' ||
                visited[newX][newY]
            ) {
                continue
            }

            worth +=parseInt(matrix[newX][newY]);
            visited[newX][newY] = true;
            queue.push([newX, newY])
        }
    }

    return worth
}