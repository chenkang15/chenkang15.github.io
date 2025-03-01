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
方法一：
把创建所有节点的map，然后通过在map上节点，维护层级关系，
最后根据目标节点，层级遍历
*/
(async () => {
    const n = parseInt(await readline());
    class Node {
        constructor(val) {
            this.val = val;
            this.children = [];
        }
    }

    const nodeMap = {};
    for (let i = 0; i < n; i++) {
        const [ch, pa] = (await readline()).split(' ');
        const chNode = nodeMap[ch] || new Node(ch);
        const paNode = nodeMap[pa] || new Node(pa);
        paNode.children.push(chNode);
        nodeMap[ch] = chNode;
        nodeMap[pa] = paNode;
    }

    const target = await readline();
    
    const targetNode = nodeMap[target]

    function bfs(root) {
        const queue = [root]
        const res = [];
        while (queue.length) {
            const node = queue.shift();
            res.push(node.val);
            for (let child of node.children) {
                queue.push(child)
            }
        }

        return res
    }
    const res = bfs(targetNode);
    res.shift();
    console.log(res)
    rl.close();
})();



/*
方法二
只维护父级节点树，然后根据父级节点树，逐层遍历节点，如果子节点也在树上，继续逐层遍历
*/
(async () => {
    const n = parseInt(await readline())
    const tree = {}
    for (let i = 0; i < n; i++) {
        const [ch, pa] = (await readline()).split(' ');
        tree[pa] = tree[pa] || new Set();
        tree[pa].add(ch)
    }

    const ta = await readline();

    if (!tree[ta]) {
        return ''
    }

    const res = [];

    const queue = [...tree[ta]]
    while (queue.length) {
        const cur = queue.shift();
        res.push(cur);
        if (tree[cur]) {
             queue.push(...tree[cur])
        }
    }
    console.log(res)
    rl.close();
})();