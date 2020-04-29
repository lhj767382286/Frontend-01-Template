# 作业

[TOC]

## 1. convertStringToNumber



```js
function convertStringToNumber(string, radix = 10) {
  if (radix > 10) {
    return;
  }
  let flag = /e|E/.test(string);
  if (!flag) {
    let chars = string.split('');
    let number = 0;
    let i = 0;
    while (i < chars.length && chars[i] != '.') {
      number = number * radix;
      number += chars[i].codePointAt(0) - '0'.codePointAt(0);
      i++;
    }
    if (chars[i] === '.') {
      i++;
    }
    let fraction = 1;
    while (i < chars.length) {
      fraction /= radix;
      number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
      i++;
    }
    return number;
  } else {
    let logNumber = Number(string.match(/\d+$/)[0]);
    let number = string.match(/^[\d\.]+/)[0].replace(/\./, '');
    if (/e-|E-/.test(string)) {
      return Number(number.padEnd(logNumber + 1, 0));
    } else {
      return Number(number.padStart(logNumber + number.length, 0).replace(/^0/, '0.'));
    }
  }
}
```



## 2. convertNumberToString

```js
function convertNumberToString(number, radix) {
  let integer = Math.floor(number);
  let fraction = String(number).match(/\.\d+$/);
  if (fraction) {
    fraction = fraction[0].replace('.', '');
  }
  let string = '';
  while (integer > 0) {
    string = String(integer % radix) + string;
    integer = Math.floor(integer / radix);
  }
  return fraction ? `${string}.${fraction}` : string;
}
```



## 3. 找出 JavaScript 标准里有哪些对象是我们无法实现出来的，都有哪些特性？写一篇文章，放在学习总结里。

### 对象分类

> 节选自极客时间 winter 老师的《重学前端》

我们无法绕开代码实现一个跟原生数组行为一模一样的对象：原生数组底层实现了一个自动随下标变化的 length 属性。在浏览器环境中，我们也无法单纯依靠 JavaScript 代码实现 div 对象，只能依靠 `document.createElement` 来创建。说明：**JavaScript 的对象机制并非简单的属性集合 + 原型**。

* 宿主对象（host Objects）：由 JavaScript 宿主环境提供的对象，它们的行为完全由宿主环境决定。

* 内置对象 （Built-in Objects）：由 JavaScript 语言提供的对象。

  * 固有对象 （Intrinsic Objects）：由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例

  * 原生对象 （Native Objects）：可以由用户通过 Array、RegExp 等内置构造器或者特殊语法创建的对象

  * 普通对象（Ordinary Objects）：由 `{}` 语法、Object 构造器或者 class 关键字定义类创建的对象，它能够被原型继承

    

此外，在固有对象和原生对象中，有一些对象的行为跟正常对象有很大区别。称之为 **特殊行为的对象**，Special Object：

### [特殊行为的对象](https://tc39.es/ecma262/#sec-built-in-exotic-object-internal-methods-and-slots)

* Array：
  * [[length]] 
  * length 属性根据最大的下标自动发生变化
* Object.prototype:
  *  [[setPrototypeOf]]
  * Object.prototype 作为所有正常对象的默认原型，不能再给它设置原型
* String: 为了支持下标运算，String 的正整数属性访问会去字符串里查找
* Arguments: arguments 的非负整数型下标属性跟对应的变量联动
* 模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧
* 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊
* bind 后的 function：跟原来的函数相关联



#### [Array](https://tc39.es/ecma262/#sec-array-exotic-objects) 

> Array Exotic Objects

* 每个 Array 对象都有一个 length 属性
* length 属性根据最大的下标自动发生变化，其值始终是小于 2^32 的非负整数（即：`+0 ≤ array_index < 2^32 - 1`）
* Array Object 区别于 Ordinary Object 的地方：
  * 重写了内部方法 - [[DefineOwnProperty(P, Desc)]](https://tc39.es/ecma262/#sec-array-exotic-objects-defineownproperty-p-desc)
  * 新增了内部方法
    * [ArrayCreate(length, [, proto])](https://tc39.es/ecma262/#sec-arraycreate)
    * [ArraySpeciesCreate(originalArray, length)](https://tc39.es/ecma262/#sec-arrayspeciescreate)
    * [ArraySetLength(A, Desc)](https://tc39.es/ecma262/#sec-arraysetlength)

下面主要看看一下 **`[[DefineOwnProperty]](P, Desc)`** （P 是属性名, Desc 是属性描述符，A 是 array object）的处理步骤：

1. P 是 "length"
   1. Return ArraySetLength(A, Desc)
2. P 是 array index:
   1. 获取 A 的 length 属性：`oldLenDesc = OridinaryGetOwnProperty(A, "length")`
   2. 获取 A 的 length 属性的值: `oldLen = oldLenDesc.[[Value]]`
   3. 将 P 转换成 Number 并用 index 存储：`index = toUnit32(P)`
   4.  比较 index 与 oldLen 大小
      1. index >= oldLen
         1. Length 属性不可写: return false
         2. Length 属性可写：
            1. 改写数组 index 的值：`OridinaryDefinedOwnProperty(A, P, Desc)`
            2. 改写 oldLenDesc ：`oldLenDesc.[[Value]] = index + 1`
            3. 改写 Length 属性：`OridinaryDefinedOwnProperty(A, "length", oldLenDesc)`
            4. 返回：true 
3. P 既不是 length 也不是 array index:
   1. 返回：` OrdinaryDefineOwnProperty(A, P, Desc)`



参考说明：

| 所用到内部方法                                               | 作用             | 示例                                                         |
| ------------------------------------------------------------ | ---------------- | ------------------------------------------------------------ |
| [OridinaryGetOwnProperty](https://tc39.es/ecma262/#sec-ordinarygetownproperty) | 获取对象的属性   | 如数据属性：`{value: 1, writable: true, enumerable: true, configurable: true}` |
| [toUnit32](https://tc39.es/ecma262/#sec-touint32)            | 将 P 转成 Number |                                                              |
| [OridinaryDefinedOwnProperty](https://tc39.es/ecma262/#sec-ordinarydefineownproperty) | 改写对象属性     |                                                              |





#### [Object.prototype](https://tc39.es/ecma262/#sec-immutable-prototype-exotic-objects)

>  根据标准描述：Object.prototype 作为一个 immutable prototype exotic object 具有不可变的 [[Prototype]] 内部插槽。

* Object.prototype 是一个 immutable prototype exotic object
* immutable prototype exotic object 具有不可变的 [[Prototype]] 插槽
* **Immutable Prototype Exotic Object 的 SetPrototypeOf(O, V) 处理规则与  [Ordinary Object](https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-setprototypeof-v) 不一样**
  * Immutable Prototype Exotic Object 的处理规则是：[`SetImmutablePrototype(O, v)`](https://tc39.es/ecma262/#sec-set-immutable-prototype)
  * Ordinary Object  的处理规则是 [`OrdinarySetPrototypeOf(O, V)`](https://tc39.es/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-setprototypeof-v)



[`SetImmutablePrototype(O, v)`](https://tc39.es/ecma262/#sec-set-immutable-prototype) 的处理规则如下：

1. 获取 O 的原型：执行 `current = O.[[GetPrototypeOf]]()`
2. 判断 V 与 current 是否相等：[` [SameValue](V, current) `]((https://tc39.es/ecma262/#sec-samevalue))
   1. 相等：返回 true
   2. 不相等：返回 false



由此可见：**Object.prototype 作为所有正常对象的默认原型，不能再给它设置原型**（V 为 null 时除外，因为 Object.prototype 对象的原型本身就是 `null`）：

```js
Object.setPrototypeOf(Object.prototype, {})	
// TypeError: Immutable prototype object '#<Object>' cannot have their prototype set

Object.setPrototypeOf(Object.prototype, null)
// {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}
```



#### [String](https://tc39.es/ecma262/#sec-string-exotic-objects)

> String Exotic Objects

* 每个 String 对象都有一个 length 属性
  * length 的值等于单值（code unit elements）的数量
  * 此外，实现了虚拟整数索引与字符串中的每个单值（code unit elements）一一对应
* String Object 区别于 Ordinary Object 的地方：
  * 重写了内部方法
    * [GetOwnProperty(P)](https://tc39.es/ecma262/#sec-string-exotic-objects-getownproperty-p) - StringGetOwnProperty ( S, P )
    * [DefineOwnProperty(P, Desc)](https://tc39.es/ecma262/#sec-string-exotic-objects-defineownproperty-p-desc)
    * [OwnPropertyKeys](https://tc39.es/ecma262/#sec-string-exotic-objects-ownpropertykeys)
  * 新增了内部方法
    * [StringCreate(value,  prototype)](https://tc39.es/ecma262/#sec-stringcreate)
  * 新增了内部插槽(interal slot)
    * [[StringData]]

```js
Object.getOwnPropertyDescriptors("ab");

{
  0: {value: "a", writable: false, enumerable: true, configurable: false},
  1: {value: "b", writable: false, enumerable: true, configurable: false},
  length: {value: 2, writable: false, enumerable: false, configurable: false}
}

"ab"[0]	// "b"
"ab"[2] // undefined

// StringGetOwnProperty(S, P) 执行步骤大概如下；
// 1. 如果 P 不是字符串，返回：undefined
// 2. 获取 P 转为 Number 的数值并存为 index（具体参考 canonicalNumberIndexString: https://tc39.es/ecma262/#sec-canonicalnumericindexstring）
// 3. 如果 index === undefined，返回：undefined
// 4. 如果 IsInteger(index) === false, 返回：undefined
// 5. 如果 index === -0, 返回 undefined

// 6. 获取 S 对象的 [[StringData]] 内容，存为： str
// 7. len = str.length
// 8. 如果 index < 0 || len <= index，返回：undefined
// 9. resultStr = {length:1, 0: {value: str[index]}}
// 10. 返回：{[[Value]]: resultStr, ...}
```



#### [Arguments](https://tc39.es/ecma262/#sec-arguments-exotic-objects)

> Arguments Exotic Objects

* 非负整数型下标属性跟对应的变量联动
* Arguments Object 区别于 Ordinary Object 的地方：
  * 新增了内部插槽 
    * [[ParamterMap]]
  * 重写了内部方法
    * GetOwnProperty(P)
    * DefineOwnPropery(P, Desc)
    * Get(P, Receiver)
    * Set(P, V, Receiver)
    * Delete(P)

> 关于  Arguments 对象的创建过程，可以参考：[ES5/可执行代码与执行环境 - Arguments 对象的创建]([https://www.w3.org/html/ig/zh/wiki/ES5/%E5%8F%AF%E6%89%A7%E8%A1%8C%E4%BB%A3%E7%A0%81%E4%B8%8E%E6%89%A7%E8%A1%8C%E7%8E%AF%E5%A2%83#.E5.88.9B.E5.BB.BA_Arguments_.E5.AF.B9.E8.B1.A1](https://www.w3.org/html/ig/zh/wiki/ES5/可执行代码与执行环境#.E5.88.9B.E5.BB.BA_Arguments_.E5.AF.B9.E8.B1.A1))



#### [Namespace](https://tc39.es/ecma262/#sec-module-namespace-exotic-objects)

* 与一般对象完全不一样
* 内部方法大部分被重写
* 比较重要的地方，内部插槽：
  * [[Moudle]] - 看作引入的模块
  * [[Exports]] - 看作导出的模块



### 解答

* Array：
  * [[length]] 
  * length 属性根据最大的下标自动发生变化
* Object.prototype:
  *  [[setPrototypeOf]]
  *  Object.prototype 作为所有正常对象的默认原型，不能再给它设置原型
* String: 为了支持下标运算，String 的正整数属性访问会去字符串里查找
* Arguments: arguments 的非负整数型下标属性跟对应的变量联动
* 模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧
* 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊
* bind 后的 function：跟原来的函数相关联









https://tc39.es/ecma262/#sec-set-immutable-prototype



![]（https://tva1.sinaimg.cn/large/007S8ZIlgy1ge426uul3aj30vy0dgdmd.jpg)
