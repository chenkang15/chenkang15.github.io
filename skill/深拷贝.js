function deepClone(obj) {
    let res = {};
    // 类型判断的通用方法
    function getType(obj) {
        return Object.prototype.toString.call(obj).replaceAll(new RegExp(/\[|\]|object /g), "");
    }
    const type = getType(obj);
    const reference = ["Set", "WeakSet", "Map", "WeakMap", "RegExp", "Date", "Error"];
    if (type === "Object") {
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                res[key] = deepClone(obj[key]);
            }
        }
    } else if (type === "Array") {
        console.log('array obj', obj);
        obj.forEach((e, i) => {
            res[i] = deepClone(e);
        });
    }
    else if (type === "Date") {
        res = new Date(obj);
    } else if (type === "RegExp") {
        res = new RegExp(obj);
    } else if (type === "Map") {
        res = new Map(obj);
    } else if (type === "Set") {
        res = new Set(obj);
    } else if (type === "WeakMap") {
        res = new WeakMap(obj);
    } else if (type === "WeakSet") {
        res = new WeakSet(obj);
    } else if (type === "Error") {
        res = new Error(obj);
    }
    else {
        res = obj;
    }
    return res;
}

// ==================================================================================== //

function deepClone(obj) {
    let res = null;
    // 类型判断的通用方法
    function getType(obj) {
        return Object.prototype.toString.call(obj).replaceAll(new RegExp(/\[|\]|object /g), "");
    }
    const type = getType(obj);
    const reference = ["Set", "WeakSet", "Map", "WeakMap", "RegExp", "Date", "Error"];
    if (type === "Object") {
        res = {};
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                res[key] = deepClone(obj[key]);
            }
        }
    } else if (type === "Array") {
        console.log('array obj', obj);
        res = [];
        obj.forEach((e, i) => {
            res[i] = deepClone(e);
        });
    }
    // 优化此部分冗余判断
    // else if (type === "Date") {
    //     res = new Date(obj);
    // } else if (type === "RegExp") {
    //     res = new RegExp(obj);
    // } else if (type === "Map") {
    //     res = new Map(obj);
    // } else if (type === "Set") {
    //     res = new Set(obj);
    // } else if (type === "WeakMap") {
    //     res = new WeakMap(obj);
    // } else if (type === "WeakSet") {
    //     res = new WeakSet(obj);
    // }else if (type === "Error") {
    //   res = new Error(obj);
    //}
    else if (reference.includes(type)) {
        res = new obj.constructor(obj);
    } else {
        res = obj;
    }
    return res;
}

// ==================================================================================== //
function deepClone(obj) {
    let res = null;
    const reference = [Date, RegExp, Set, WeakSet, Map, WeakMap, Error];
    if (reference.includes(obj && obj.constructor)) {
        res = new obj.constructor(obj);
    } else if (Array.isArray(obj)) {
        res = [];
        obj.forEach((e, i) => {
            res[i] = deepClone(e);
        });
    } else if (typeof obj === "object" && obj !== null) {
        res = {};
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                res[key] = deepClone(obj[key]);
            }
        }
    } else {
        res = obj;
    }
    return res;
}

// ==================================================================================== //

function deepClone(obj, hash = new WeakMap()) {
    if (hash.has(obj)) {
        return obj;
    }
    let res = null;
    const reference = [Date, RegExp, Set, WeakSet, Map, WeakMap, Error];

    if (reference.includes(obj && obj.constructor)) {
        res = new obj.constructor(obj);
    } else if (Array.isArray(obj)) {
        res = [];
        obj.forEach((e, i) => {
            res[i] = deepClone(e);
        });
    } else if (typeof obj === "object" && obj !== null) {
        res = {};
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                res[key] = deepClone(obj[key]);
            }
        }
        hash.set(obj, res);
    } else {
        res = obj;
    }
    return res;
}





// ==================================================================================== //

// 判断类型的方法移到外部，避免递归过程中多次执行
const judgeType = origin => {
    return Object.prototype.toString.call(origin).replace(new RegExp(/\[|\]|object /g), "");
};
const reference = ["Set", "WeakSet", "Map", "WeakMap", "RegExp", "Date", "Error", "Function"];
function deepClone(obj) {
    // 定义新的对象，最后返回
     //通过 obj 的原型创建对象
    const cloneObj = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));

    // 遍历对象，克隆属性
    for (let key of Reflect.ownKeys(obj)) {
        const val = obj[key];
        const type = judgeType(val);
        if (reference.includes(type)) {
            cloneObj[key] = new val.constructor(val);
        } else if (typeof val === "object" && val !== null) {
            // 递归克隆
            cloneObj[key] = deepClone(val);
        } else {
            // 基本数据类型和function
            console.log(type, val);
            cloneObj[key] = val;
        }
    }
    return cloneObj;
}




(function test() {
    const map = new Map();
    map.set("key", "value");
    map.set("ConardLi", "coder");

    const set = new Set();
    set.add("ConardLi");
    set.add("coder");

    const target = {
        field1: 1,
        field2: undefined,
        field3: {
            child: "child",
        },
        field4: [2, 4, 8],
        empty: null,
        map,
        set,
        bool: new Boolean(true),
        num: new Number(2),
        str: new String(2),
        symbol: Object(Symbol(1)),
        date: new Date(),
        reg: /\d+/,
        error: new Error(),
        func1: () => {
            let t = 0;
            console.log("coder", t++);
        },
        func2: function (a, b) {
            return a + b;
        },
    };
    //测试代码
    const test1 = deepClone(target);
    target.field4.push(9);
    console.log('test1: ', test1, test1.func1 === target.func1);
})();