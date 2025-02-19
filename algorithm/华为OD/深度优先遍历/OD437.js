const rl = require('readline').createInterface({
    input: process.stdin
});;

const iter = rl[Symbol.asyncIterator]();

const readline = async () => (await iter.next()).value;


/*
深度优先遍历
以每一个坐标点为起始点，开始进行深度优先遍历，直到路径等于目标字符串
深度优先遍历
需要注意的是 递归的判断条件
在什么情况下提前结束
记录路径
前遍历的方向移动
什么情况下回退
以及完成遍历的处理（）
*/
(async () => {
    
    const inputNum = parseInt(await readline());

    const charArr = [];

    for (let i = 0; i < inputNum; i++) {
        const chars = (await readline()).split(',');
        charArr.push(chars)
    }

    const target = await readline();
    const used = Array.from({length: inputNum}, () => Array.from({
        length: inputNum
    }, () => false));
    const result = []

    for (let i = 0; i < inputNum; i++) {
        for (let j = 0; j < inputNum; j++) {
            dfs(i, j, 0)
        }
    }

    console.log(result.join(', '))
    function dfs(i, j , k) {
        if (
            i < 0 || i >= inputNum ||
            j < 0 || j >= inputNum ||
            charArr[i][j] !== target[k] ||
            used[i][j]
        ) {
            return false;
        }

        used[i][j] = true;
        result.push(`${i}, ${j}`);

        if (result.length === target.length) {
            return true
        }

        const next = (
            dfs(i - 1, j , k + 1) ||
            dfs(i + 1, j , k + 1) ||
            dfs(i, j - 1 , k + 1) ||
            dfs(i, j + 1 , k + 1)
        )

        if (!next) {
            used[i][j] = false;
            result.pop();
            return false
        }

        return true
    }
    rl.close();
})();