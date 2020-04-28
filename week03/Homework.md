

# 作业

[TOC]

## 1. convertStringToNumber

## 2. convertNumberToString



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
* length 属性根据最大的下标自动发生变化，其值始终是小于 2^32 的非负整数



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











https://tc39.es/ecma262/#sec-set-immutable-prototype









![]（https://tva1.sinaimg.cn/large/007S8ZIlgy1ge426uul3aj30vy0dgdmd.jpg)