
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
笨方法，代码不太好理解
i是分隔符，所以 i 的范围是  i = nums.length-2，因为左右数组不能为空，
因此右数组至少有一个nums[nums.length-1]元素

计算i左边的和，用一个全局变量记录左边的和，其实不用也行，左边和 和遍历的顺序一致
计算i右边的和，需要单独的循环去遍历，因为i又是一个一个移动的，所以，
右边的和和左边的和每轮只差一个 list[i]; 左和 = 前左和 + list[i]，右和 = 前右和 - list[i]
比较维护最大差
*/
(async () => {
    const n = parseInt(await readline());
    const list = (await readline()).split(' ').map(Number);
    
    let preLeftSum = undefined;
    let preRightSum = undefined;
    let maxDiff = -Infinity
    for (let i = 0; i < list.length - 2; i++) {
        let leftSum = (preLeftSum || 0) + list[i];
        let rightSum
        if (preRightSum !== undefined) {
            rightSum = preRightSum - list[i]
        }
        preLeftSum = leftSum;
        let r = i + 1;
        while (r < list.length && preRightSum === undefined) {
            rightSum = (preRightSum || 0) + list[r];
            r++;
        }
        preRightSum = rightSum;
        maxDiff = Math.max(maxDiff, Math.abs(leftSum - rightSum))
    }
    console.log("======  maxDiff:", maxDiff)
    rl.close();
})();



/*
方法二：
定义一个leftSum，用于统计左数组的和，初始为0

定义一个rightSum，用于统计右数组的和，初始为sum(nums)

然后，开始从 i = 0，开始遍历输入的数组nums的每一个元素nums[i]，

leftSum += nums[i]

rightSum -= nums[i]

然后计算两个和的差值绝对值diff，比较最大的maxDiff，若大于maxDiff，则maxDiff = diff

之后，在 i++，循环上面逻辑，直到 i = nums.length-2，因为左右数组不能为空，因此右数组至少有一个nums[nums.length-1]元素
*/
(async () => {
    const n = parseInt(await readline());
    const list = (await readline()).split(' ').map(Number);
    
    let leftSum =0;
    let rightSum = list.reduce((pre, cur) => pre + cur);
    let maxDiff = -Infinity
    for (let i =0; i < list.length - 1; i++) {
        leftSum = leftSum + list[i];
        rightSum = rightSum - list[i];
        maxDiff = Math.max(maxDiff, Math.abs(leftSum - rightSum))
    }
    console.log("======  maxDiff:", maxDiff)
    rl.close();
})();
