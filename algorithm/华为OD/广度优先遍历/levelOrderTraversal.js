const root = require('../../treeNode');
// 层级遍历
// 按节点层级，逐个遍历
// https://leetcode.cn/problems/binary-tree-level-order-traversal/

// 通过队列将每层的节点按照顺序推入队中
// 先进先出
// 然后逐层遍历，将下一层的节点放入队列中
// 每层遍历完，进入下一次循环时，队列中保存的都是当前层的所有节点
// 队列的长度一直在变化，因为遍历开始后，在收集下一层的节点入队
function levelOrderTraversal(root) {
    const res = [];
    const queue = [];

    if (root) {
        queue.push(root);
    }

    while (queue.length) {
        // 遍历开始前需要保存队列的长度，
        // 在开始遍历后，会收集下一层的节点进行入队，队列的长度会一直在变化
        const len = queue.length;
        const curLevel = [];
        // 开始遍历
        for (let i = 0; i < len; i++) {
            const node = queue.shift();
            // 处理节点，因为是遍历，处理就是把当前节点的值按顺序保存到数组中
            curLevel.push(node.val); 
            // 收集下一层节点进行入队
            node.left && queue.push(node.left);
            node.right && queue.push(node.right);
        }
        // 遍历结束后，队列中保存着下一层的全部子节点
        res.push(curLevel)
    }
    return res;
}

console.log(levelOrderTraversal(root)) // [ [ 1 ], [ 2, 3 ], [ 4, 5, 8 ], [ 6, 7, 9 ] ]