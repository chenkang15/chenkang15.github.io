// console.dir(process)


// const rl = require("readline").createInterface({
//     input: process.stdin
// });
// var iter = rl[Symbol.asyncIterator]();
// const readline = async () => (await iter.next()).value;

const rl = require('readline').createInterface({
    input: process.stdin
});
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

(async () => {
    const [n, m] = (await readline()).split(" "); // 第 1 行输入两个整数，学生人数 n 和科目数量 m。
    const subjects = (await readline()).split(" "); // 第 2 行输入 m 个科目名称，彼此之间用空格隔开。
    console.log("🚀 ~ subjects:", subjects)
    const subjectsRankIdxMap = subjects.reduce((pre, cur, idx) => {
        pre[cur] = idx
        return pre;
    }, {})
    const students = [];
    // 第 3 行开始的 n 行，每行包含一个学生的姓名和该生 m 个科目的成绩（空格隔开）
    for (let i = 0; i < n; i++) {
        const temp = (await readline()).split(" ");
        const name = temp[0];
        const scores = temp.slice(1).map(Number);
        const score_sum = scores.reduce((pre, cur) => pre+=cur);
        // 前 m-1 为各科成绩，m为总分
        const rank = [...scores, score_sum];
        students.push({name, rank});
    }
    // 用作排名的科目名称
    const subject  = await readline(); // 第n+2行，输入用作排名的科目名称。若科目不存在，则按总分进行排序。
    // 用作排名的科目序号
    let rankIdx = subjectsRankIdxMap[subject];
    // 若科目不存在，则按总分进行排序。
    if (rankIdx === undefined) {
        rankIdx = m
    }
    // 排序科目不存在，按总分排序，fangfang和minmin总分相同，按姓名的字典
    students.sort((a, b) => {
        return a.rank[rankIdx] !== b.rank[rankIdx] ? 
        b.rank[rankIdx] - a.rank[rankIdx] :
        strcmp(a.name, b. name)
    })
    console.log(students)
    console.log(students.map((a) => a.name).join(" "));
})();

function strcmp(a, b) {
 if (a === b) {
    return 0
 } else if (a > b) {
    return -1
 } else {
    return 1
 }
}