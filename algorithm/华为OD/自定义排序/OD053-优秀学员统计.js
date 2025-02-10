/*
不考虑并列的情况，按规则返回前5名员工的id即可，
如果当月打卡的员工少于5个，按规则排序返回所有有打卡记录的员工id。

加入打卡次数相同，将较早参与打卡的员工排在前面，
如果开始参与打卡的时间还是一样，将id较小的员工排在前面。

注：不考虑并列的情况，按规则返回前5名员工的id即可，如果当月打卡的员工少于5个，按规则排序返回所有有打卡记录的员工id。
*/

/*
1. 按打卡次数降序排列
2. 打卡次数相同，按参加打卡的时间先后排序
3. 打卡次数相同，参加打卡的时间先后相同，按ID的升序排列
*/

/*
sort a,b a-b < 0，a < b，a 在b前面，升序排列
*/

const user = {
    total,
    validDays: [],
}
const rl = require('readline').createInterface({
    input: process.stdin
});
const iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;

(async () => {
    const num = (await readline());
    const dayValidNums = (await readline()).split(' ');
    const userValidDayMap = {}
    for (let i = 0; i < 30; i++) {
        const dayValids = (await readline()).split(' ');
        dayValids.forEach(id => {
            if (userValidDayMap[id]) {
                userValidDayMap[id].total += 1;
                userValidDayMap[id].validDays.push(i);
            } else {
                userValidDayMap[id] = {
                    total: 1,
                    validDays: [i]
                }
            }
        });
    }
    console.log("🚀 ~ userValidDayMap:", userValidDayMap)
    

    const validIds = Object.keys(userValidDayMap);
    const result = validIds.sort((a, b) => {
        if (userValidDayMap[a].total !== userValidDayMap[b].total) {
            return userValidDayMap[b].total - userValidDayMap[a].total;
        } else if (
            userValidDayMap[a].validDays.join(',') !==
            userValidDayMap[b].validDays.join(',')
        ) {
            return isEarlier(a, b);
        } else  {
            return a - b
        }
    })

    console.log(result.slice(0, 5).join(' '));
    rl.close();
})();

function isEarlier(a, b) {
    const len = a.length;
    while (i < len) {
        if (a < b) {
            return -1
        }
        i++;
    }
}
/*
输入描述
第一行输入为新员工数量N，表示新员工编号id为0到N-1，N的范围为[1,100]

第二行输入为30个整数，表示每天打卡的员工数量，每天至少有1名员工打卡。

之后30行为每天打卡的员工id集合，id不会重复。
*/