// 使用状态机完成 "abababx" 的处理

function match(string) {
    let state = start;
    for (let c of string) {
        state = state(c);
    }
    return state === end;
}


function start(c) {
    if (c === "a") {
        return foundA;
    } else {
        return start;
    }
}


function end(c) {
    return end;
}

function foundA(c) {
    if (c === "b") {
        return foundB;
    } else {
        return start(c);
    }
}

function foundB(c) {
    if (c === 'a') {
        return foundA2;
    } else {
        return start(c);
    }
}

function foundA2(c) {
    if (c === 'b') {
        return foundB2;
    } else {
        return start(c);
    }
}

function foundB2(c) {
    if (c === 'a') {
        return foundA3;
    } else {
        return start(c);
    }
}

function foundA3(c) {
    if (c === 'b') {
        return foundB3;
    } else {
        return start(c);
    }
}

function foundB3(c) {
    if (c === 'x') {
        return end;
    } else if (c === 'a') {
        return foundA3;
    } else {
        return start(c);
    }
}

console.log(match('abababx'));  // true
console.log(match('aabababcxx')); // false
console.log(match('aabababcx')); // false
console.log(match('aabbababcx')); // false
console.log(match('aababababx')); // true
console.log(match('aabababxabx')); // false