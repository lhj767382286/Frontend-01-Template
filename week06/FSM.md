# [有限状态机](https://zh.wikipedia.org/wiki/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA)

[TOC]

## 概念

> **有限状态机**: finite-state machine，FSM。又称**有限状态自动机**（英语：finite-state automation，[缩写](https://zh.wikipedia.org/wiki/縮寫)：**FSA**），简称**状态机**，是表示有限个[状态](https://zh.wikipedia.org/wiki/状态)以及在这些状态之间的转移和动作等行为的[数学计算模型](https://zh.wikipedia.org/wiki/计算模型_(数学))。

### 简介

* 一种编程的思想
* 应用广泛：
  * 游戏、AI、编译原理构建 AST、正则表达式的实现处理字符串
* 分类：
  * Moore 机 -  输出只依赖于状态
  * Mealy 机 -  输出依赖于输入和状态

### 概念

* 每个状态都是一个机器
  * 在每个机器里，我们可以做计算、存储、输出......，几乎可以在机器做编程能做的所有事
  * 所有的这些机器接受的输入都是一致的
  * 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数（无副作用）
* 每一个机器知道下一个状态
  * 每个机器都有确定的下一个状态（[Moore](https://blog.csdn.net/Reborn_Lee/article/details/88918615)）
  * 每个机器根据输入决定下一个状态（Mealy）

> 平时里使用变量表示某个状态，而状态机是把每个状态都设计成一个独立的机器。所有机器可以理解为参数一致的函数。一般使用 mealy 状态机。

## 应用

### 有限状态机处理字符串

#### 在一个字符串中，找到字符 “a”

```js
function match(string) {
  for (let c of string) {
    if (c == 'a')
      return true;
  }
  return false;
}

match('I am groot')
```



#### 在一个字符串中，找到字符 "ab"

```js
function match(string) {
  let foundA = false;
  for (let c of string) {
    if (c == 'a')
      foundA = true;
    else if (foundA && c == 'b')
      return true;
    else 
      foundA = false;
  }
  return false;
}

match('I am groot')
```



#### 在一个字符串中，找到字符 "abcdef"

```js
function match(string){
  let foundA = false;
  let foundB = false;  
  let foundC = false;
  let foundD = false;
	let foundE = false;
	
  for(let c of string){
    if (c == "a") {
      foundA = true;
    } else if (foundA && c == "b") {
      foundB = true;
    } else if (foundB && c == "c") {
      foundC = true;
    } else if (foundC && c == "d") {
      foundD = true;
    } else if (foundD && c == "e") {
      foundE = true;
    } else if (foundE && c == "f") {
      return true;
    } else {
      foundA = false;
      foundB = false;
      foundC = false;
      foundD = false;
      foundE = false;
    }
  }
  
  return false;
}
```



#### JS 中的有限状态机 (Mealy)

```js
// 每个函数是一个状态
function state(input) { // 函数参数就是输入
  // 在函数中，可以自由地编写代码，处理每个状态的逻辑
  return next; // 返回值可以作为下一个状态
}


// 以下是调用
while(input) {
  // 获取输入
  state = state(input); // 把状态机的返回值作为下一个状态
}
```



#### 使用有限状态机处理字符串

```js
// state 当前状态

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
    // 状态不变
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
    return start;
  }
}

function foundB(c) {
  if (c === "c") {
    return foundC;
  } else {
    return start;
  }
}

function foundC(c) {
  if (c === "d") {
    return foundD;
  } else {
    return start;
  }
}

function foundD(c) {
  if (c === "e") {
    return foundE;
  } else {
    return start;
  }
}

function foundE(c) {
  if (c === "f") {
    return end;
  } else {
    return start;
  }
}


console.log(match('I ab grabcdefoot')); // true

```

问题：如果是在 "aabcdef" 中，找到 "abcdef" 呢？

#### 在 “aabc” 中，找到字符 “abc”

> return start(c) => 把本状态代理到 start （把字符重新入让 start 处理一遍）

```js
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
        // 状态不变
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
    if (c === "c") {
        return end;
    } else {
        return start(c);
    }
}


console.log(match('aabc')); // true
```



#### 如何用状态机处理诸如 “abcabx” 这样的字符串

##### 原来思路

> 处理 `match(abcabcabx)` 会返回 `false`。实际上当走到需要找 `x` 这个状态时，证明前面肯定是 `ab`，而后面根据查找可以是 `c/x`。

```js
// 在 abcabcabx 找 abcabx
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
        // 状态不变
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
        return start;
    }
}

function foundB(c) {
    if (c === "c") {
        return foundA2;
    } else {
        return start;
    }
}

function foundA2(c) {
    if (c === "a") {
        return foundB2;
    } else {
        return start;
    }
}

function foundB2(c) {
    if (c === "b") {
        return foundX;
    } else {
        return start;
    }
}

function foundX(c) {
    if (c === "x") {
        return end;
    } else {
        return start;
    }
}


console.log(match('abcabcabx')); // false
```



##### 现在思路

> foundB(c)

```js
// 在 abcabcabx 找 abcabx

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
        // 状态不变
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
        return start;
    }
}

function foundB(c) {
    if (c === "c") {
        return foundA2;
    } else {
        return start;
    }
}

function foundA2(c) {
    if (c === "a") {
        return foundB2;
    } else {
        return start;
    }
}

function foundB2(c) {
    if (c === "b") {
        return foundX;
    } else {
        return start;
    }
}

function foundX(c) {
    if (c === "x") {
        return end;
    } else {
        return foundB(c);
    }
}


console.log(match('abcabcabx')); // true
```

## 作业

1. 使用状态机完成 "abababx" 的处理
2. 如何用状态机处理完全未知的 pattern
   1. [参考 KMP 算法](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm)
   2. `match(pattern, string)`
   3. `match("ab?bx", "I am ababx! hhha")`
   4. 关键利用闭包生成状态



![image-20200514204311528](https://tva1.sinaimg.cn/large/007S8ZIlgy1ges9jhltbyj30sm0fk477.jpg)

