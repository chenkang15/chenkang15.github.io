// 深度优先遍历
// 先序遍历 中->左->右
// 中序遍历 左->中->右
// 后序遍历 左->右->中
// 先序遍历 
// https://leetcode.cn/problems/binary-tree-preorder-traversal/description/
// 中序遍历 
// https://leetcode.cn/problems/binary-tree-inorder-traversal/
// 后序遍历
// https://leetcode.cn/problems/binary-tree-postorder-traversal/description/
const tree = require('../../treeNode');
// ===================================================
// 递归-先序遍历
// 先序遍历，处理节点的顺序和访问节点的顺序一致
// 都是先访问根节点，然后左右子节点
function preorderTraversal(root) {
    const res = [];

    function dfs(root) {
        if (!root) {
            return
        }
        res.push(root.val);
        dfs(root.left);
        dfs(root.right);
    }
    dfs(root)
    return res
}

// 递归-中序遍历
// 中序遍历，保证访问节点的顺序，和处理节点的顺序一致
function inorderTraversal(root) {
    const res = [];

    function dfs(node) {
        if (!node) {
            return
        }
        // 中序遍历，访问顺序是 左右中
        dfs(node.left);
        res.push(node.val);
        dfs(node.right)
    }
    dfs(root)
    return res
}

// 递归-后序遍历
function postorderTraversal(root) {
    const res = [];

    function dfs(node) {
        if (!node) {
            return
        }
        // 后序遍历 访问顺序 左右中
        dfs(node.left);
        dfs(node.right);
        res.push(node.val)
    }
    dfs(root)
    return res
}


// ===================================================
// 迭代法-先序遍历
// 用栈去实现先序遍历
// 因为先序遍历节点的处理顺序是 中左右，和节点的访问顺序可以保持一致
// 所以可以通过出入栈去控制访问顺序
function preorderTraversal(root) {
    const res = [];
    const stack = [];

    if (root) {
        stack.push(root);
    }

    while (stack.length) {
        // 通过维护节点的入栈顺序，达到控制节点的访问和处理顺序
        // 先序遍历的处理顺序是 中左右
        // 栈遵循后入先出，所以首先处理根节点，然后控制入栈顺序
        // 入栈顺序就是 先右节点，再左节点
        const node = stack.pop();
        res.push(node.val);
        // 空节点不入栈
        // // 入栈顺序就是 先右节点，再左节点
        node.right && stack.push(node.right);
        node.left && stack.push(node.left);
    }

    return res
}

// 迭代法-中序遍历
// 中序遍历的节点处理顺序是 左 中 右
// 而正常流程的节点访问顺序是 先根节点也就是中节点，然后左右子节点
// 访问顺序和节点的处理顺序不一致
// 所以通过指针去控制访问顺序，通过出入栈去控制节点的处理顺序
function inorderTraversal(root) {
    const res = [];
    const stack = [];
    let cur = root;

    while (cur || stack.length) {
        // 控制访问顺序
        if (cur) { // 通过指针访问到最左的节点
            stack.push(cur);
            cur = cur.left;
        } else { // 走到这里代表访问到最左侧的子节点了，为null
            // null 不需要处理
            // 中序遍历的顺序是 左 中 右
            // 左节点 是 null，不需要处理，此时栈顶保存着当前节点的中节点（最左侧节点的根节点）
            // 处理中节点
            const node = stack.pop();
            res.push(node.val);

            // 处理完根节点，中序遍历 左中右，左节点是空，不需要处理，中节点也处理完成，
            // 修改指针为右节点，完成 中序遍历
            cur = node.right; // 处理完中节点后，通过指针控制访问顺序
        }
    }

    return res
}

// 迭代法-后序遍历
// 后序遍历的节点处理顺序是 左右中
// 先序遍历的节点处理顺序是 中左右
// 通过修改先序遍历子节点的出入栈顺序 可以改为 中右左
// 修改左右子节点的入栈顺序 为 中右左，节点的处理顺序就是 后序遍历的取反
// 将处理结果取反就是后序遍历的处理结果 左右中
function postorderTraversal(root) {
    const res = [];
    const stack = [];
    if (root) {
        stack.push(root)
    }

    while (stack.length) {
        const node = stack.pop();
        res.push(node.val);
        // 先序遍历 左右子节点的入栈顺序是先入栈 右节点，再入栈左节点
        // 这样出栈顺序就是 先出左节点，再出右节点
        // node.right && stack.push(node.right);
        // node.left && stack.push(node.left);
        // 先序遍历的处理顺序是 中左右
        // 后序遍历遍历的处理顺序是 左右中
        // 左右中 的反向就是 中右左
        // 调整入栈顺序
        node.left && stack.push(node.left);
        node.right && stack.push(node.right);
    }

    return res.reverse(); // 处理结果取反
}



// ===================================================
// 统一模板迭代法-先序遍历
// 之所以中序后序迭代不能统一模板是因为中序后序遍历的节点访问顺序和处理顺序不一致
// 中序后序遍历的访问顺序都是先访问根节点，然后通过根节点才能访问到子节点
// 而中序后序遍历的处理顺序 确实 先处理子节点，然后处理根节点
// 所以无法简单的通过入栈顺序去控制节点的访问和处理顺序，所以需要引入特殊的标记去标记节点
// 默认的出入栈顺序去控制访问顺序
// 如果出栈的是标记节点，代表栈顶的节点就是需要处理的节点
function preorderTraversal(root) {
    const res = [];
    const stack = [];

    if (root) {
        stack.push(root)
    }

    while (stack.length) {
        const node = stack.pop();
        if (node) {

            // 前序遍历 中-> 左 -> 右
            // 调整栈内节点的顺序，使出栈顺序为 中左右
            // 先序遍历是 中左右，所以节点的出栈顺序就是 中左右
            // 所以入栈顺序就是 右，左， 中，null
            // 空节点不入栈，这样栈里的null都是标记节点，代表下一个节点就需要处理
            node.right && stack.push(node.right);
            node.left && stack.push(node.left);
            stack.push(node);
            stack.push(null); // 插入标记节点，代表下一个出栈的节点就是需要处理的节点
        } else { // 此时出栈的节点是null，也就是标记节点，代表下一个节点就是需要处理的节点
            const done = stack.pop();
            res.push(done.val); // 因为是遍历，所以处理就是把当前节点的值按顺序保存到数组中
        }
    }
    return res;
}
// 中序遍历 左->中->右
// 栈模拟统一模板：中序遍历
// 因为中序遍历，后序遍历的节点的访问顺序和处理顺序不一致，
// 所以无法简单的通过入栈顺序去控制节点的访问和处理顺序，所以需要引入特殊的标记去标记节点
// 默认的出入栈顺序去控制访问顺序
// 如果出栈的是标记节点，代表栈顶的节点就是需要处理的节点
function inorderTraversal(root) {
    const res = [];
    const stack = [];

    if (root) {
        stack.push(root);
    }

    while (stack.length) {
        const node = stack.pop();
        if (node) {
            // 中序遍历 左中右
            // 出栈顺序 左中右
            // 入栈顺序就是 右中null左
            // 空节点不入栈
            node.right && stack.push(node.right);
            stack.push(node);
            stack.push(null); // 插入标记节点，代表下一个出栈的节点是需要处理的
            node.left && stack.push(node.left);
        } else { // 因为空节点不入栈，所以栈中的空节点，都代表的下一个出栈的节点是需要处理的节点
            const done = stack.pop();
            res.push(done.val) // 处理节点
        }
    }

    return res;

}
// 后序遍历 左->右->中
// 栈模拟统一模板： 后序遍历
// 因为中序遍历，后序遍历的节点的访问顺序和处理顺序不一致，
// 所以无法简单的通过入栈顺序去控制节点的访问和处理顺序，所以需要引入特殊的标记去标记节点
// 默认的出入栈顺序去控制访问顺序
// 如果出栈的是标记节点，代表栈顶的节点就是需要处理的节点
function postorderTraversal(root) {
    const res = [];
    const stack = [];

    if (root) {
        stack.push(root);
    }

    while (stack.length) {
        const node = stack.pop();
        if (node) {
            // 调整节点顺序
            // 后序遍历 左右中
            // 出栈顺序 左右中
            // 入栈顺序 中 null 右 左
            // 空节点不入栈
            stack.push(node);
            stack.push(null); // 插入标记节点，代表下一个出栈的节点是需要处理的
            node.right && stack.push(node.right);
            node.left && stack.push(node.left);
        } else { // 此时出栈的节点是标记节点，代表的下一个栈顶的节点就是需要处理的节点
            const done = stack.pop();
            res.push(done.val);//因为是遍历，所以只需要按照处理的顺序把节点的值放入到数组中就行
        }
    }
    return res;

}
// console.log(preorderTraversal(tree)) // [1,2,4,5,6,7,3,8,9]
// console.log(inorderTraversal(tree)) // [4,2,6,5,7,1,3,9,8]
console.log(postorderTraversal(tree)) // [4,6,7,5,2,9,8,3,1]