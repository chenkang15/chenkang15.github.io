const arr = [
    {age: 18},
    {age: 8, name: 'zm'},
    {age: 8, name: 'ck'},
    {age: 38},
    {age: 28},
]

console.log(
    arr.sort((a,b) => b.age - a.age)
)

console.log(
    [1,3,9,5,2].sort((a, b) => a - b)
)

// console.log(['a', 'c', 'b', 'A', 'C'].sort(function strcmp(a, b) {
//     if (a == b) {
//       return 0;
//     } else if (a > b) {
//       return 1;
//     } else {
//       return -1;
//     }
//   }))


// console.log('a'.charCodeAt())
// console.log('A'.charCodeAt())
// console.log(97-65)


console.log('3M12G9M'.match(/(\d+)[MGT]/g))
console.log('300M'.match(/(\d+)([MGT])/))


const unitMap = {
    M: 1,
    G: 1024,
    T: 1024 * 1024
}

function calc(val) {
    const units = val.match(/(\d+)[MGT]/g)
    const totalM = units.reduce((pre, cur) => {
        const [, num, unit] = cur.match(/(\d+)([MGT])/)
        console.log("🚀 ~ totalM ~ num, unit:", num, unit)
        pre += num * unitMap[unit]
        return pre;
    }, 0)
    return totalM
}


console.log(calc('2G'))