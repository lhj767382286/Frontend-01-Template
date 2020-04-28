# Statement

[TOC]

## Grammer

### 简单语句

* ExpressionStatement
* EmptyStatement
* DebuggerStatement
* ThrowStatement
* ContinueStatement
* BreakStatement
* ReturnStatement

```js
a = 1 + 2;

;

debugger;

throw a; // 后面可跟一个表达式。可以 throw 任何东西。当然运行时错误也会抛 throw

continue;
continue label1; // 后面可跟标签名，表示名实际是一个 identifier，变量名

break;
break labe2;

return;
```



#### Completion Record

> 每个语句运行时返回的 Completion Record.

* ExpressionStatement
  * `Completion{[[Type]]: normal, [[Value]]: GetValue(exprRef), [[Target]]: empty}`
* EmptyStatement
  * `Completion{[[Type]]: normal, [[Value]]: empty, [[Target]]: empty}`
* DebuggerStatement
  * 若调试状态：预先定义的 Completion 值
  * 否则，`Completion{[[Type]]: normal, [[Value]]: empty, [[Target]]: empty}`
* ThrowStatement
  * ` Completion{[[Type]]: throw, [[Value]]: GetValue(exprRef), [[Target]]: empty}`
* ContinueStatement
  * 无 Identifier：`Completion{[[Type]]: continue, [[Value]]: GetValue(exprRef), [[Target]]: Identifier}`
  * 有 Identifier：`Completion{[[Type]]: continue, [[Value]]: GetValue(exprRef), [[Target]]: empty}`
* BreakStatement
  * 无 Identifier：`Completion{ [[Type]]: break, [[Value]]: empty, [[Target]]: empty }`
  * 有 Identifier：`Completion{ [[Type]]: break, [[Value]]: empty, [[Target]]: Identifier }`
* ReturnStatement
  * 是 async：`Completion{ [[Type]]: return, [[Value]]: Await(GetValue(exprRef)), [[Target]]: empty }`
  * 不是 async：`Completion{ [[Type]]: return, [[Value]]: GetValue(exprRef), [[Target]]: empty }`



### 复合语句

* BlockStatement
* IfStatement
* SwitchStatement
* IterationStatement
* WithStatement
* LabelledStatement
* TryStatement



#### Block

> C 系语言中非常重要。

```html
<script>
// 多条语句扩起来 => 一条语句
// 新版本 ecma 中 => 提供作用域
{
	// ...
	// ...
}

// 注意区别对象
{
  a: 1, // a 会被理解为一个 label。虽然合法。但不会被理解为一个正常的对象
}
</script>
```

##### Completion Record

* `{}`
  * `NormalCompletion(empty)`
* `{ statementList }`
  * 参考下方代码注释

```js
{
  const a = 1;
  // 正常情况下是 normal。但是执行到一个非 normal 的语句时，就不执行了
  // 所以类似：return、continue、break; 打断顺序
  throw 1;	
  let b = 2;
  b = foo();
}
```



#### Iteration

* `while(...)...`
* `do ... while(...)`
* `for(...; ...; ...) ...`
  * `var`
  * `const / let`
* `for(... in ...)...`
  * `in`
* `for(... of ...)...`
* ~~`for await( of )`~~



```js
for (let i = 0; i < 10; i++) {
  console.log(i);	// 0 ... 9
}


var i = 0;
for (; i < 10; i++) {
  let i = 0;
  console.log(i); // 0 ... 0
}



for (let i = 0; i < 10; i++) {
  let i = 0;
  console.log(i);	// 0 ... 0
}
// 类似于父作用域
{
  let i = 0;
  {
		let i = 1;
    console.log(i);
  }
  console.log(0);
}
// 1, 0


// 遍历对象属性
for(let p in {a:1, b:2}){
  console.log(p); // a, b
}
for (... in ...) // 后者有没有 in, 与实际的 in 运算符产生冲突。 P715


// 遍历数组
for (let p of [1, 2, 3]) {
  console.log(p); // 1, 2, 3
}
 
// 对应关系：for of => Iterator => Generator/Array
// 与 generator 搭配
function *g() {
  yield 0;
  yield 1;
  yield 4;
}
for (let p of g()) {
  console.log(p); // 1, 2, 4
}
```



#### Try

```js
try {
  // ...
} catch (...) {
  // ...
} finally {
  // ...
}
```

##### Completion Record

* [[type]]: return
* [[value]]: --
* [[target]]: label



#### 标签、循环、break、continue

* LabelledStatement
* IterationStatement
* ContinueStatement
* BreakStatement
* SwitchStatement

##### Completion Record

* [[type]]: break/continue
* [[value]]: --
* **[[target]]: label**

只有循环和 switch 语句才能消费 label



### 声明

* FunctionDeclaration
* GeneratorDeclaration
* AsyncFunctionDeclaration
* AsyncGeneratorDeclaration
* VariableStatement
* ClassDeclaration
* LexicalDeclaration



#### 关键字

* function
* function *
* Async function
* Async function
* var
* class
* const 
* let



#### FunctionDeclaration

```js
function foo() {
}

var o = function foo(){
  
}
```

#### GeneratorDeclaration

> 可以理解为范围多个值的函数。场景：**让函数分步多次返回值**。

```js
function* foo() {
  yield 1;
  yield 2;
}

var o = function* foo(){
}


function* foo() {
  yield 1;
  yield 2;
  
  var i = 0;
  while(true) {
    yield i++;
  }
}
var gen = foo();
gen.next();	// {value: 0, done: false}
gen.next(); // {value: 1, done: false}
gen.next();	// {value: 2, done: false}
```



#### AsyncFunctionDeclaration

```js
var i = 0;
function tick() {
  console.log(i++);
  setTimeout(tick, 1000);
};
tick();


function sleep (time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  });
}

void async function () {
  let i = 0;
  while(true) {
    console.log(i++);
    await sleep(1000);
  }
}();


```



#### AsyncGeneratorDeclaration

```js
async function* foo() {
  var i = 0;
  while(true) {
    console.log(i);
    yield i++;
    await sleep(1000);
  }
}

// 异步 generator 只能在异步中使用
void async function() {
  var gen = foo();
  console.log(await gen.next());
  console.log(await gen.next());
  console.log(await gen.next());
}();

// 可以使用 for await 代替
void async function() {
  var gen = foo();
  for await(let e of g) {
    console.log(e);
  }
}();

```



#### VariableStatement

* 如果有 var，不建议写在 function 的子结构 (如 `if`) 中，直接写在 function 下
* 不要在任何的 block 里去写 var

```js
var x = 0;
function foo() {
  var o = {x:1};
  x = 2;
  with(o) {
    var x = 3;
  }
  console.log(x); // 2
  console.log(o.x); // 3
}

foo();
console.log(x); // 0
```



#### ClassDeclaration

````js
var cls1 = 0;
function foo() {
  cls1 = 1;	// 报错
  class cls1 { 
  }
  class cls1 {	// 重复声明也会报错
  }
}
foo();
````

#### 其他

##### 预处理

```js
//  预处理 P250 13.3.1.2 Static Semantics: BoundNames
var a = 2;
void function () {
  a = 1;
  return;
  var a;
}();
console.log(a); // 2

var a = 2;
void function () {
  a = 1;
  return;
  const a;
}();
console.log(a); //  SyntaxError: Missing initializer in const declaration
```

##### 作用域

```js
var a = 2;
void function () {
  a = 1;
 {
   var a;
 }
}();
console.log(a);	// 2

var a = 2;
void function () {
  a = 1;
 {
   let a;
 }
}();
console.log(a);	// 1
```



## Runtime

> 相比于之前说的 7 种语言类型。运行时实际上还存在着另外 8 种规范类型，用于解释不同的阶段。如下面要讲到的 Completion Record，用于描述异常、跳出等语句执行过程。

### [Completion Record](https://juejin.im/post/5c7c7a7ce51d4553d7648192)

> Completion Record 类型用来解释值和控制流的运行时传播情况，如执行相关的控制转移语句(continue、break、return、throw)。ECMAScript 规范中的每个运行时语义都显式或隐式返回一个报告其结果的 Completion Record。



#### Fields

* [[Type]]: 
  * 取值：One of normal, break, continue, return, or throw
* [[Value]]: 
  * 取值：任何语言类型 / empty
  * 只有当 type 为 return, throw 时才有意义
* [[Target]]: 
  * 取值：string / empty (实际上是一个 label)
  * 为了循环和 break, continue 存在
  * 只有循环和 switch 语句才能消费

```js
Completion Record = {
  [[Type]] // Completion的类型，有 normal, break, continue, return, throw 5种类型
  [[Value]] // 返回的值为ES语言值或空，仅当当[[type]] 为 normal,return, throw时有值
  [[Target]] // 定向控制转移的目标label，为string或空，仅当[[type]] 为break, continue时有值
}
```



#### 类型

* 当 [[Type]] 取值为 normal 时：**Normal completion**
* 当 [[Type]] 取其余值时：**Abrupt completion**



#### Abstract Operation

> 具体需结合语句分析，可参考：https://www.w3cschool.cn/wsqzg/wsqzg-5nup25oz.html 或 ECMA 262 标准

## Object

> 建议参考极客时间- 重学前端

### 什么是面向对象

面向对象 - 面向对象分析与设计：

1. 一个可以触摸或者可以看见的东西
2. 人的智力可以理解的东西
3. 可以知道思考和行动（进行想象或施加动作）的东西



### 对象的本质特征

> 所有任何一个对象都是唯一的，这与它本身状态无关。

* 对象具有 **唯一标志性** - identifier
  * 即使是看起来完全相同的对象，也并非同一个对象
  * 通过内存地址来体现
* 对象具有 **状态** - state
  * 我们使用状态来描述对象
  * 同一个对象可能处于不同状态之下
* 对象具有 **行为** - behavior
  * 状态的改变即是行为
  * 即：对象的状态可能会因为行为产生变迁

> 封装、复用、解耦、内聚其实是架构上的概念。



### Object-Class

> 类是一种常见的描述对象。Object-class 即表示基于类的对象系统

两种思路：

* 归类 
  * 产生重叠，即多继承结构
  * 代表语言：C++
* 分类
  * 单继承结构，会有最终的基类：Object。
  * 产生了 Interface
  * 代表语言：Java



![image-20200427164128113](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge8f0r3necj30kp0cawf4.jpg)



> Mixin: 复用



### Object-Prototype

* 原型是一种更接近人类原始认知的描述对象的方法
* 我们并不试图做严谨的分类，而是采用“相似”这样的方式去描述对象。
* 任何对象仅仅需要描述它自己与原型的区别即可

![image-20200427164152729](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge8f15evkjj30it0cvq47.jpg)

### Object Exercise

* 狗咬人
* “咬”这个行为该如何使用对象



我们不应该受语言描述的干扰。

在设计对象的状态和行为时，我们总是需要遵循“行为改变状态”的原则。

```js
// 错误。应该是狗急了。方法应该是改变自身的状态
class Dog {
  bite (human) {
    // ...
  }
}

// 对
class Human {
  hurt (damage) {
    // ...
  }
}
```





### Object In JavaScript

> 注意：原型不是属性。属性都属于运行时

* 在 JS 运行时，原生对象的描述方式非常简单，我们只需要关心原型和属性的两个部分



![image-20200427164746870](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge8f7aic0yj30ai08mt8u.jpg)

#### Property

* JavaScript 用属性来统一抽象对象的状态和行为
  * 运行时其实没有方法这个概念，只有属性
* 属性分为两类：
  * Data Property - 数据属性
    * 用于描述状态
    * 注意：数据属性中，如果存储函数，也可以用于描述行为。
  * Acessor Property - 访问器属性
    * 用于描述行为



![image-20200427165049158](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge8faghs2zj30ak089q36.jpg)

##### 原型链

属性访问算法：

* 流程：
  * 当我们访问属性时，如果当前对象没有
  * 则会沿着原型着原型对象是否有次名称的属性
  * 而原型对象还可能有原型，因此存在“原型链”
* 这个算法保证了：每个对象只需要描述自己和原型的区别即可



![image-20200427165836807](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge8fikeavwj306j09n0sr.jpg)



#### Object API/ Grammer

> 需要掌握 1, 2, 3

* 基本 API：`{} . [] Object.defineProperty`
* 原型 API：`Object.create / Object.setPrototypeOf / Object.getPropertyOf`
* `new / class / extends`
* `new / function / prototype`



#### [Function Object](https://tc39.es/ecma262/#sec-ecmascript-function-objects)

> JavaScript 中特殊的对象，函数对象。即，带有 `[[call]]` 就是函数，带有 `[[constructor]]` 就是构造器

* 函数对象的定义是：
  * 具有 [[call]] 私有字段的对象
* 构造器对象的定义是：
  * 具有私有字段 [[construct]] 的对象

函数对象具有：

* 一般对象的属性和原型

* **一个行为 [[[call](https://tc39.es/ecma262/#sec-ecmascript-function-objects-call-thisargument-argumentslist)]]**

  * 使用 Function 关键字、箭头运算符、Function 构造器创建的对象，都会有 `[[call]]` 这个行为

  * 当使用类似 `f()` 语法把对象当成函数调用时，会访问 `[[call]]` 这个行为

  * 如果对象没有  `[[call]]` 行为，则会报错

    

![image-20200427170549626](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge8fq2rkgkj304i02pt8j.jpg)



> 行为。类似的还有：`Number()` 和 `new Number()`、`Date()` 和 `new Date()`

```js
Date(); // "Mon Apr 27 2020 17:29:21 GMT+0800 (中国标准时间)"
new Date(); // {}

// 建议：所有需要 new 的方法，都用 class 声明
function go() {
  console.log(this);
  return {a:1};
}
go();	// Window
new go();	// {a: 1}
```



#### Special Object

> ECMA 262 9.4

* Array[[length]]
* Object.prototype[[setPrototypeOf]]
* ...



```js
// 如 Array

var arr = [];
arr[100] = 1;
arr.length; // 101

Object.getOwnPropertyDescriptor(arr, "length");
// {value: 101, writable: true ..}

Object.setPrototypeOf(Object.prototype, {a:1});
// 抛错误， Object 万物之始


// 归根到底 => 运行时和对象
```



#### [Host Object](https://www.w3cschool.cn/wsqzg/wsqzg-4lx125lf.html)

> 宿主对象

JS 对象：

* 宿主对象（host Objects）
  * 由 JavaScript 宿主环境提供的对象，它们的行为完全由宿主环境决定
* 内置对象（Built-in Objects）
  * 固有对象（Intrinsic Objects ）：由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。
  * 原生对象（Native Objects）：可以由用户通过 Array、RegExp 等内置构造器或者特殊语法创建的对象。
  * 普通对象（Ordinary Objects）：由 `{}`语法、Object 构造器或者 class 关键字定义类创建的对象，它能够被原型继承。
* 特殊行为的对象：
  * 在固有对象和原生对象中，有一些对象的行为跟正常对象有很大区别:
    * Array
    * Object.prototype
    * String
    * Arguments
    * namespace
    * 类型数组与缓冲数组
    * bind 后的 function



宿主：浏览器中的 window、 window 又有许多属性。

对于 window 的属性：

* 一部分来自 JavaScript 语言：规定了全局对象属性
* 一部分来自浏览器环境：W3C 各种标准规定的 Window 对象的其它属性。

宿主对象也分为固有的和用户可创建的两种：

* 比如 document.createElement 就可以创建一些 DOM 对象

宿主也会提供一些构造器，比如我们可以使用 new Image 来创建 img 元素



## 总结

![Statement](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge8n7hs95xj30u0175x05.jpg)