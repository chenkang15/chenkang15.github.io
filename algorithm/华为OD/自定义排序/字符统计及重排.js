const r1 = require('readline').createInterface({
    input: process.stdin
})

const iter = r1[Symbol.asyncIterator]();

const readline = async () => (await iter.next()).value;

(async () => {
    while(true) {
        const strArr =  (await readline()).split("");
        const charNumMap = strArr.reduce((pre, cur) => {
            pre[cur]=(pre[cur] || 0) + 1
            return pre;
        }, {});
        const resultKeys = Object.keys(charNumMap).sort((a, b) => {
            console.log(`a:${a}, b;${b}`, fommatCharNum(a) - fommatCharNum(b) )
            // return fommatCharNum(a) - fommatCharNum(b) 
            if (charNumMap[a] === charNumMap[b]) {
                return fommatCharNum(a) - fommatCharNum(b)
            }
            return charNumMap[b]- charNumMap[a]
        })
    
        console.log(resultKeys.map(k => `${k}:${charNumMap[k]}`).join(';'))
    }
})();

function isUpper(v) {
    return v >= 'A' && v <= 'Z'
}
function isLow(v) {
    return v >= 'a' && v <= 'z'
}

function fommatCharNum(v) {
    if (isUpper(v)) {
        return v.charCodeAt() + 50
    }
    return v.charCodeAt()
}