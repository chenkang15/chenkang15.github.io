
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
开始汽车坐标00
终点坐标m-1 n-1
初始化汽车为满油，保证能到终点的情况下，求出发最小油量（最小路径）

每次移动有四种可能性
[
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
]
层级遍历，直到终点，或者油量耗尽

维护到达新节点的初始油量、剩余油量，是否加过油

初始化记录每点坐标为极大值，然后，通过推入点，记录从起始点到该点初始最低油量 dist_init
注意点可以重复经过，但是为了避免死循环，需要设置终止条件
1. 如果我们在当前点的初始最低油量大于dist_init[x][y]则说明当前路径到达(x,y)不是最优的，
因此当前路径也没必要继续往后探索了，可以终止当前路径的探索。
2. 如果我们在当前点的初始最低油量小于dist_init[x][y]则说明当前路径到达(x,y)更优，
花费更少的初始油量 init，此时我们更新 dist_init[x][y] = init
3. 如果我们在当前点的初始最低油量等于dist_init[x][y]，则当前剩余油量最多的路径最优

所以需要维护两个矩阵， 
dist_init[x][y] 记录到达x,y点，初始最低油量是多少
dist_remain[x][y] 记录到达x,y点，剩下多少油量

所以需要维护节点需要维护 x,y, init初始化油量, 剩余油量

而维护节点的 init初始化油量, 剩余油量，
需要判断 新坐标的 类型，加油站或者普通类型
如果在 A点 初始化最少到达油量是 init = 30, 剩余油量是20
从A点移动到B点，B点需要消耗40的油量
B点有两种可能，加油站或者是普通地点


如果是加油站，这代表到达这点之后剩余油量会加满，
如果不是加油站，就需要
*/
(async () => {
    const [m, n] = (await readline()).split(',').map(Number)
    const areaArr = []
    for (let i = 0; i < m; i++) {
        const row = (await readline()).split(',').map(Number)
        areaArr.push(row);
    }

    const offsets = [
        [-1, 0], // 上
        [0, 1], // 右
        [1, 0], // 下
        [0, -1], // 左
    ]

    // 记录路径中位置的几个状态
    class Node {
        constructor(x, y) {
            this.x = x; // 位置横坐标
            this.y = y; // 位置纵坐标
            this.init = 0; // 到达此位置所需的最少初始油量
            this.remain = 0; // 到达此位置时剩余可用油量
            this.flag = false; // 到达此位置前有没有加过油
        }
    }

    function bfs() {

        // 如果左上角和右下角不可达，则直接返回-1
        if (areaArr[0][0] === 0 || areaArr[m - 1][n - 1] === 0) {
            return -1;
        }

        // 广搜队列
        const queue = [];
        // 创建起始位置节点
        const node = new Node(0, 0);

        if (areaArr[0][0] === -1) { // 如果初始位置就是加油站
            // 如果起始位置就是加油站，则到达(0,0)位置所需初始油量为0，且剩余可用油量为100，且需要标记已加油
            node.init = 0;
            node.remain = 100;
            node.flag = true;
        } else {
            // 如果起始位置不是加油站，则到达(0,0)位置所需的初始油量至少为matrix[0][0], 剩余可用油量为0，未加油状态
            node.init = areaArr[0][0];
            node.remain = 0;
            node.flag = false;
        }

        queue.push(node);

        // 初始化最小油量矩阵
        // dist_init[x][y] 用于记录起点 (0, 0) 到达 (x, y) 的所有可达路径中最优路径（即初始油量需求最少的路径）的初始油量
        const dist_init = Array.from({
            length: m
        }, () => Array.from({
            length: n
        }, () => Infinity));

        // 初始化剩余油量矩阵
        // dist_remain 用于记录起点 (0,0) 到达 (x,y) 的所有可达路径中最优路径（即初始油量需求最少的路径）的最大剩余可用油量
        // 即如果存在多条最优路径，我们应该选这些路径中到达此位置剩余油量最多的
        const dist_remain = Array.from({
            length: m
        }, () => Array.from({
            length: n
        }, () => 0))

        // 初始化起点（0,0）到达自身位置（0,0）所需的最少初始油量和最多剩余油量
        dist_init[0][0] = node.init;
        dist_remain[0][0] = node.remain;


        // 广搜
        while (queue.length) {
            const node = queue.shift();

            // 从当前位置cur开始向上下左右四个方向探路
            for (let offset of offsets) {
                const nexX = node.x + offset[0];
                const nexY = node.y + offset[1];

                // 新位置越界 或者 新位置是障碍，则新位置不可达，继续探索其他方向
                if (
                    nexX < 0 || nexX >= m || // x 超出边界
                    nexY < 0 || nexY >= n || // y 超出边界
                    areaArr[nexX][nexY] === 0 // 新坐标不可达
                ) {
                    continue // 此路不通
                }


                // 到达新位置 nexX，nexY，取出状态，因为新地方如果是加油站，和普通地点逻辑不一样
                let init = node.init; // 到达新位置 之前 所需的最少初始油量
                let remain = node.remain; // 到达新位置  之前 的剩余油量
                let flag = node.flag; // 达到新位置 之前 ，是否加过油

                // 新位置有可能是加油站
                if (areaArr[nexX][nexY] === -1) {
                    // 新位置如果是加油站的化，代表当前的油量就可以到达，newX, newY
                    // 如果新位置是加油站，则加满油
                    remain = 100;
                    flag = true; // 标记加过油了
                } else {
                    // 新位置不是加油站，需要消耗多少油
                    // 如果新位置不是加油站，则需要消耗matrix[newX][newY]个油
                    remain -= areaArr[nexX][nexY]
                }
                // 如果到达新位置后，剩余油量为负数
                // 判断剩余油量是否足够到达 newX, newY
                if (remain < 0) {
                    if (flag) { // 如果加过油了，剩余油量还不够到达这点，这条路径就不可达
                        // 如果之前已经加过油了，则说明到达此路径前是满油状态，因此我们无法从初始油量里面"借"油
                        continue // 返回看别的路
                    } else { // 没有加过油，试试，多带点初始化油量是否能够到这点
                        // 如果之前没有加过油，则超出的油量（-remain），可以从初始油量里面"借"，即需要初始油量 init + (-remain) 才能到达新位置
                        init -= remain;
                        // 由于初始油量 init + (-remain) 刚好只能支持汽车到达新位置，因此汽车到达新位置后剩余可用油量为
                        remain = 0;
                    }
                }

                // 如果到达新位置所需的初始油量超过了满油100，则无法到达新位置
                if (init > 100) {
                    // 初始化最多就是100油量，这点需要100+油量，说明也不可以到达
                    continue
                }

                // 这里代表可以到达
                // 比较当前路径是否是有效（较优）路径
                // 如果可达新位置，则继续检查当前路径策略到达新位置(newX, newY)所需的初始油量init是否比其他路径策略更
                if (init > dist_init[nexX][nexY]) {
                    // 有其他路径能到达这点，并且携带的初始油量比这条路径少
                    // 如果不是，则无需探索新位置(newX, newY)
                    continue
                } else if (init < dist_init[nexX][nexY]) {
                    // 当前路径策略到达新位置(newX,newY)所需初始油量init更少

                    // 当前路径携带的初始油量比之前的路径少，更新路径，并且把这点加入到队列中
                    // 则当前路径策略更优，记录更优路径的状态
                    dist_init[nexX][nexY] = init
                    dist_remain[nexX][nexY] = remain

                    // 将当前新位置加入BFS队列
                    const next = new Node(nexX, nexY);
                    next.init = init;
                    next.remain = remain;
                    next.flag = flag;
                    queue.push(next)
                } else if (remain > dist_remain[nexX][nexY]) {
                    // init和前面路径策略相同，但是当前路径策略剩余可用油量remain更多
                    // 当前路径携带的初始油量比之前的路相等，需要比较到达这点的时候，那条路径剩余的油量更多
                    // 剩余油量更多的 路径更优
                    // 则当前路径策略更优，记录更优路径的状态
                    dist_init[nexX][nexY] = init
                    dist_remain[nexX][nexY] = remain

                    // 将当前新位置加入BFS队列
                    const next = new Node(nexX, nexY);
                    next.init = init;
                    next.remain = remain;
                    next.flag = flag;
                    queue.push(next)
                }
                // 处理完所有可能性，遍历下一个点
            }


        }

        return dist_init[m - 1][n - 1] === Infinity ? -1 : dist_init[m - 1][n - 1]
    }
    console.log(bfs())
    rl.close();
})();