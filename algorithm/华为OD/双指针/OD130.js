
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
采用双指针，从左侧开始遍历，移动右指针，如果左右指针对应的序列的和大于目标值，
移动左指针
等于目标和，记录子序列长度
小于目标和，继续移动右指针

直到右指针到尾部，且左右指针的和小于目标值

初始化 左指针 为0，窗口总和为0，右指针 为 -1
然后判断窗口和sum 和目标值 target的大小关系
如果 判断窗口和sum > 目标值 targe,则应该缩小窗口，即左指针右移，且窗口和减去移出的左值
 sum -= Val(left); // 先减去左值，然后再移动指针，调换顺序的化，减去的就不是移出窗口的值了
 left ++,
如果 判断窗口和sum < 目标值 targe,则应该扩大窗口，即右指针右移，且窗口和加上新移入的右值
 right++;// 先移动指针，把新值移入到窗口范围，在计算窗口和
 sum += Val(right);
如果 判断窗口和sum == 目标值 targe，则计算窗口长度，右指针-左指针 + 1；长度等于坐标差+1

之所以初始化 左指针 为0，右指针 为 -1,窗口总和为0
是为了统一处理 窗口和 和 目标值的关系，这样初始化，代表窗口现在没有长度
left = 0; right = 0;代表现在窗口长度为 0-0，是长度为1，只包含0元素的窗口

如果初始化 左指针 为0，右指针 为 0, 也就是当前为长度为1，只包含0元素的窗口，所以窗口总和应该为 Val(0)

之所以这么初始化，是为了让循环中，比较 窗口值，和目标值的处理逻辑统一，方便理解
*/
(async () => {
    const arr = (await readline()).split(',').map(Number);
    const target = parseInt(await readline());

    let maxLen = -1;
    // 初始化 左指针 为0，右指针 为 -1,窗口总和为0
    let curSum = 0;
    let left = 0;
    let right = -1;

    // 左指针 为0，右指针 为 0, 窗口总和应该为 Val(0)
    // let curSum = arr[0];
    // let left = 0;
    // let right = 0;
    while (left < arr.length && right < arr.length) {
        if (curSum < target) { // 移动右指针
            right++;
            curSum += arr[right];
        } else if (curSum > target) { // 移动左指针
            
            curSum -= arr[left];
            left++;
        } else { // 等于目标值
            maxLen = Math.max(maxLen, right - left + 1);
            curSum -= arr[left];
            left++;
        }

        if (right === arr.length - 1 && curSum < target) {
            break
        }
    }

    console.log(maxLen);
    rl.close();
})();
