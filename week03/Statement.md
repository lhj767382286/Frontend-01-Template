

# Statement

> 周爱民老师的课

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

* [[type]]: normal
* [[value]]: --
* [[traget]]: --

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

* [[type]]: break continue
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

##### 声明

* function
* function *
* Async function
* Async function
* var
* class
* const 
* let



##### 预处理

```js
//  预处理 P250 13.3.1.2 Static Semantics: BoundNames

```



## Runtime

> 相比于之前说的 7 种语言类型。运行时实际上还存在着另外 8 种规范类型，用于解释不同的阶段。如下面两种

* Completion Record
  * 用于描述异常、跳出等语句执行过程
* Lexical Environment
  *  用于描述变量和作用域

### [Completion Record](https://juejin.im/post/5c7c7a7ce51d4553d7648192)

> Completion Record 类型用来解释值和控制流的运行时传播。ECMAScript规范中的每个运行时语义都显式或隐式返回一个报告其结果的完成Completion Record。

* [[type]]: normal, break, continue, return, or throw
* [[value]]: Types
  * 只有 return, throw 使用这个 value
* [[target]]: label
  * 为了循环和 break, continue 存在
  * 只有循环和 switch 语句才能消费

```js
Completion Record = {
  [[type]] // Completion的类型，有 normal, break, continue, return, throw 5种类型
  [[value]] // 返回的值为ES语言值或空，仅当当[[type]] 为 normal,return, throw时有值
  [[target]] // 定向控制转移的目标label，为string或空，仅当[[type]] 为break, continue时有值
}
```





## Object

> 建议参考重学前端，极客时间



### 什么是面向对象

面向对象 - 面向对象分析与设计：

1. 一个可以触摸或者可以看见的东西
2. 人的智力可以理解的东西
3. 可以知道思考和行动（进行想象或施加动作）的东西

![image-20200425210521728](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6ber1x5yj30w00fi76w.jpg)



### 对象的本质特征

* 对象具有 **唯一标志性**
  * 即使是看起来完全相同的对象，也并非同一个对象
  * 通过内存地址来体现
* 对象具有 **状态**
  * 我们使用状态来描述对象
  * 同一个对象可能处于不同状态之下
* 对象具有 **行为**
  * 状态的改变即是行为
  * 即：对象的状态可能会因为行为产生变迁



![image-20200425211050353](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6bkeenzcj30j80hkdjd.jpg)

> 封装、复用、解耦、内聚其实是架构上的概念。



### Object-Class

> 类是一种常见的描述对象。Object-class 即表示基于类的对象系统

两种思路：

* 归类 
  * 产生重叠，即多继承结构
  * 代表语言：C++
* 分类
  * 单继承结构，会有最终的基类，如：Object。
  * 产生了 Interface
  * 代表语言：Java

![image-20200425211816904](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6bs601bkj31ga0sadqg.jpg)

Mixin: 复用



### Object-Prototype

> 原型是一种更接近人类原始认知的描述对象的方法。基于原型

我们并不试图做严谨的分类，而是采用“相似”这样的方式去描述对象。

任何对象仅仅需要描述它自己与原型的区别即可。

![image-20200425212424772](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6byjy3u2j31dy0ruk3b.jpg)

### Object Exercise

* 狗咬人
* “咬”这个行为该如何使用对象



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

我们不应该受语言描述的干扰。

在设计对象的状态和行为时，我们总是需要遵循“行为改变状态”的原则。

如何抽象？



### Object In JavaScript

> JavaScript 的对象模型。原型 不等于 属性。属性都属于运行时

![image-20200425213640170](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6cbabhmtj31b40n8tg9.jpg)

#### 属性

> Key Val 对。运行时其实没有方法这个概念，都是属性

* Data Property
* Acessor Property

![image-20200425213757637](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6ccmixtvj310s0hodi4.jpg)

![image-20200425213851039](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6cdl1o0hj31880l67eg.jpg)

![image-20200425214342526](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6cioevjfj313u0ngn4y.jpg)

#### Object API/ Grammer

* 基本 API：`{} . [] Object.defineProperty`
* 原型 API：`Object.create / Object.setPrototypeOf / Object.getPropertyOf`
* `new / class / extends`
* `new / function / prototype`

![image-20200425214514804](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6ck793h9j31ee0n011z.jpg)



#### Function Object

![image-20200425215136679](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge6cquagyzj31cq0lw141.jpg)

> 行为。类似的还有：`Number()` 和 `new Number()`、`Date()` 和 `new Date()`

```js
function go() {
  console.log(this);
  return {a:1};
}
go();
new go();

// 建议：所有需要 new 的方法，都用 class 声明
```



#### Special Object

> ECMA 262 9.4

* Array[[length]]
* Object.prototype[[setPrototypeOf]]
* ...



```js
var arr = [];
arr[100] = 1;
arr.length; // 101

Object.getOwnPropertyDescriptor(o, "length");
// {value: 101, writable: true ..}

Object.setPrototypeOf(Object.prototype, {a:1});
// 抛错误


// 归根到底 => 运行时
```





cnblogs.com/benbenalin/category/1005679.html