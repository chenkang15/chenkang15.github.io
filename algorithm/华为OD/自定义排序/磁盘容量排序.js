const rl = require('readline').createInterface({
    input: process.stdin,
});

const iter = rl[Symbol.asyncIterator]();

const readline = async () => (await iter.next()).value;

(async () => {
    const n = (await readline());

    const inputs = []
    for (let i = 0; i < Number(n); i++) {
        inputs.push(await readline())
    }

    const inputSizeMap = inputs.reduce((pre, cur) => {
        pre[cur] = calc(cur)
        return pre;
    }, {})
    console.log("🚀 ~ inputSizeMap ~ inputSizeMap:", inputSizeMap)

    inputs.sort((a, b) => inputSizeMap[a] - inputSizeMap[b]);
    for (let v of inputs) {
        console.log(v)
    }
})();

const unitMap = {
    M: 1,
    G: 1024,
    T: 1024 * 1024
}

function calc(val) {
    const units = val.match(/(\d+)[MGT]/g)
    const totalM = units.reduce((pre, cur) => {
        const [, num, unit] = cur.match(/(\d+)([MGT])/)
        pre += num * unitMap[unit]
        return pre;
    }, 0)
    return totalM
}