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
计算每块区域的敌人数量，
穷举每个点位，计算这个点位可到达的地方总共有几个敌人
bfs 搜索当前点位可达到的地方有多少个敌人
如果地点被遍历过了，就返回
visited的矩阵记录是否遍历过

广度搜索需要确认的是，需要判断清什么情况下把下一个节点放入队列中
什么情况下提前返回
*/
(async () => {

    // 矩阵行数，矩阵列数，区域敌军数量上限
    const [n, m, k] = (await readline()).split(' ').map(Number);
    // 地图矩阵
    const matrix = [];
    for (let i = 0; i < n; i++) {
        const row = (await readline()).split('');
        matrix.push(row)
    }
    // 访问矩阵
    const visited = Array.from({
        length: n
    }, () => Array.from({
        length: m
    }, () => false));

    // 上、下、左、右偏移量
    const offsets = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ]
    let num = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            // 如果(i,j)位置未访问过，且不是墙，则进入广搜，广搜结果是广搜区域内的敌军数量，如果数量小于k，则该区域符合要求
            if (!visited[i][j] && matrix[i][j] != "#") {
                num += bfs(i, j) < k ? 1 : 0;
            }
        }
    }

    console.log(num)


    function bfs(i, j) {
        let num = 0; // 该区域敌军数量
        if (matrix[i][j] === '#') {
            // 如果源位置是E，则敌军数量+1
            num += 1;
        }
        // 标记源位置访问过
        visited[i][j] = true;
        // 广搜依赖于队列结构，先进先出
        const queue = [
            [i, j]
        ];

        while (queue.length) {
            const [x, y] = queue.shift();
            // 遍历该位置的上下左右
            for (let offset of offsets) {
                const newX = x + offset[0];
                const newY = y + offset[1];

                // 处理新坐标点
                // 如果新位置不越界，且未访问过，且不是墙，则继续广搜
                if (
                    newX >= 0 &&
                    newX < n &&
                    newY >= 0 &&
                    newY < m &&
                    !visited[newX][newY] &&
                    matrix[newX][newY] != "#"
                ) {
                    if (matrix[newX][newY] === "E") {
                        num += 1;
                    }
                    visited[newX][newY] = true;

                    queue.push([newX, newY]);
                }


            }
        }

        return num
    }
    rl.close();
})();