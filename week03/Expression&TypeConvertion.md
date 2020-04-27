# 表达式及类型转换

[TOC]

## Expression

### Tree vs Priority

* 优先级 - 其实是通过表达式生成树的方式实现的
* 四则运算：
  * 数学角度：运算符的优先级
  * 语言的实现与定义的角度：树的结构 (下层结构优先级更高)
* 产生式（第二周内容）：
  * **在定义加法、乘法表达式的时，把乘法表达式作为加法表达式的子规则**
  * 这样在解析形成 AST 时，乘法节点就一定是加法节点的子节点，从而会被优先计算



```
<AdditiveExpression> ::= <MultiplicativeExpression> | 
	<AdditiveExpression> "+" <MultiplicativeExpression>
	
<MultiplicativeExpression> ::= <DecimalExpress>  |
	<MultiplicativeExpression> "*" <DecimalExpress> 
```



因此，我们可以通过文法的嵌套，实现对运算优先级的支持。这样我们在解析  `1 + 2 * 3` 这个算术表达式时会形成类似下面的 AST：

![image-20200424164904296](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge4ydphxd6j30bv06j74f.jpg)



下面来看一下优先级最高的几个运算符：Member > New > Call.

### Left Hand Side

> Member、New、Call 三层又被称为 Left Hand Side. 可以理解为 = 号左边。具体看后面 LHS 与 RHS。
>
> 所谓 LHS，就是可以被赋值的表达式。

* 对于左值表达式：
  * 极限现象就是 call
* 运行时必须是 reference

* 语法上必须是 left hand side

```js
a.b = c;
a + b = c;
```



#### Member Expression

> Member 运算，成员访问/属性访问。ECMA 262 P201

* `a.b`
  * 访问属性
* `a[b]`
  * 通过变量去访问属性
  * 动态语言，相当于具备了 `java` 的反射能力
* foo \`string\`
* `super.b`
* `super['b']`
* `new.target`
* `new Foo()`



##### foo \`string\`



```javascript
let name = 'irving';
function foo () {
  console.log(arguments);	// [['Hello', '!'], 'irving']
}
foo `Hello ${name}!`; 
```



##### new.target

* 作用：

  * 检测函数或构造方法是否是通过 [new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符被调用的
  * 在通过 [new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符被初始化的函数或构造方法中，`new.target` 返回一个指向构造方法或函数的引用

* 限制：

  * 只能在函数中使用
  * 在普通的函数调用中，`new.target` 的值是 `undefined`

  

```javascript
// 1. 普通函数
function Foo() {
	console.log(new.target);
  // if (!new.target) // 抛错
}

Foo(); // undefined
new Foo(); // foo{..}


// 2. 构造方法
class A {
  constructor() {
    console.log(new.target)
    console.log(new.target.name);
  }
}

class B extends A { constructor() { super(); } }

A(); // TypeError: Class constructor A cannot be invoked without 'new'
new A(); // "A"
new B(); // "B"


// 3. 伪造对象
var fakeObj = {};
Object.setPrototypeOf(fakeObj, Foo.prototype);
fakeObj.constructor = Foo;
Foo.apply(fakeObj);
// ES5 语法中无法判断 fakeObj 是否是 new 出来的： instanceof 走的是原型链
// 所以引入 new.target. 判断是不是被 new 运算符调用
```

##### [Reference](https://juejin.im/post/5c7c7a7ce51d4553d7648192#heading-7)

> 具体参考后文

Member Expressions 实际返回的是一个 Reference 类型。

* Reference 类型组成：
  * Object
  * Key
* 目前有写的能力运算符：
  * `delete` - 删除的是引用的地址
  * `assign`

```js
var o = {x: 1};
o.x + 2
1 + 2
// 实际 o.x + 2 与 1 + 2 没有任何区别

// 但是下面两者就有很大的区别，这是因为有一个引用机制。实际 o.x 返回的是一个 Reference。
// 而上面加法时会把 reference 自动解掉
delete o.x
delete 1

// 可以认为 Reference，像指针，即能读也能写。有些运算符是有写的能力，有些只有读的能力
class Reference {
  constructor (object, property) {
    this.object = object;
    this.property = property;
  }
}
```



#### New Expression

* `new Foo`

```javascript
function cls1(s){
  console.log(s)
}
function cls2(s) {
	console.log("2", s);
  return cls1;
}

// 带括号的优先级更高
new new cls2("good")

// 2 good
// cls1 {}
```

#### Call Expression

> 函数调用

* foo()
* super()
* foo()['b']
* foo().b
* foo() \`abc\`



```javascript
new a()['b']
// 先 new 再取 member
```



因此，Member、New以及Call 这三层的大部分的一些特殊处理都是为了处理 New 的运算的正确性，是为了让 New 更符合预期合理。



### Right Hand Side

> 优先级从高往下讲

#### Update Expression

> Todo: 理清 [left-hand side expression](https://stackoverflow.com/questions/3709866/whats-a-valid-left-hand-side-expression-in-javascript-grammar)、[ECMAScript 规范中的Reference Specification Type的含义](https://www.zhihu.com/question/31911373)

* a ++
* a --
* -- a
* ++ a



```javascript
++ a ++	// Invalid left-hand side expression in prefix operation
++ (a++)	// Invalid left-hand side expression in prefix operation

// P178 no LineTerminator  语法与词法特殊之处

var a = 1, b = 1, c = 1

a
++
b
++
c
// a = 1, b = 2, c = 2

a/*

*/++
b/*
*/
// a = 1, b = 3
```



#### Unary Operators

> 单目运算符

* Delete a.b
* void foo()
  * 生成 `undefined` 最好的方式是 `void 0`
  * 避免局部变量覆盖问题
* typeof a
  * `null` - `object`
  * `function` - `function`
* `+ a`
* `- a`
* `~ a`
* `!a`
* `await a`



```javascript
void 在 js 中是一个运算符

function(var i = 0; i < 10; i++) {
  var button = document.createElement("button");
  document.body.appendChild(button)
  button.innterHTML = i
  void function(i){
    button.onClick = function () {
      console.log(i)
    }(i);
  }(i);
}

// 加 void 是比较好的实践：
// 1. 语义正确
// 2. 如果前面忘记写分号，用"("会有问题
```



#### Exponental Operators

* `**` 

```
唯一一个右结合的运算符
```

#### Multiplicative Operators

* `*`
* `/`
* `%`

#### Additive Operators

> 加法从运行时的角度来看实际上有两种：Number、String 类型的加法。

* `+ `
* `-`



####  Shift Operators

* `<<`
* `>>`
* `>>>`



#### Relational Operators

* `<`
* `>`
* `<=`
* `>=`
* `instanceof`
* `in`

#### Equality Operators

* `==`
* `!=`
* `===`
* `!==`

#### Bitwise Operatiors

* `&`
* `^`
* `|`

#### Logical Operators

* `&&`
* `||`

```js
function foo1(){
  console.log(1);
  return false;
}

function foo2() {
  console.log(2)
}

foo1() || foo2()	// 1, 2
foo1() && foo2()	// 1

// 实际情况：不是先把 foo1, foo2 结果计算出来才执行操作符运算
// 所以可以把逻辑操作符当作 if / else 使用
```



#### Conditional Operator

	* `?:`

```js
// js 中三目运算，同样也是短路逻辑。与其他语言不同(C++ 没有短路逻辑)

true ? foo1() : foo2()
false ? foo1() : foo2()
```



### [LHS and RHS](https://segmentfault.com/a/1190000003793498)

* 是引擎执行阶段时执行的两种变量的查找方式
  * LHS 查找发生在：赋值给变量的时候，如: `var a = 2;`
  * RHS 查找发生在：查找某个变量的值，如: `console.log(a);`
* 区分：
  * 根据查找的目的进行区分
    * LHS 查找的目的是 **对变量进行赋值** - 写
    * RHS 查找的目的是 **获取变量的值** - 读
  * 此外，LHS 表示存储计算机内存的对象



```javascript
var c = 1;	// LHS lookup (目的是对变量 c 赋值)

var foo = function (a) { // 2 个 LHS 对变量 foo 及 形式参数 a 赋值)
  var b = a;	// LHS (对变量 b 赋值) / RHS (获取变量 a 的值)
  return a + b + c;	// 3 个 RHS (获取变量 a, b, c 的值）
}

foo(2)	// RHS (目的是获取 foo 的值)
```



## Type Convertion

### Left Hand Side

#### Member Expression

* a.b / a[b] / super.b / super['b']
  * 左边必须是对象
  * 右边可以是 `symbol` 或者是 `string`
* foo \`string\`
  * foo 必须是对象，至于是否是函数看运行时

### Right Hand Side

#### Update Expression

> 自增必须得是 Number

#### Unary Expression

* Delete a.b
  * delete 后面必须是 Reference 类型，否则报错
* Void foo()
  * 后面可以是任何类型，都返后 undefined
* Typeof a
  * 后面可以是任何类型
* `+ a` / `-a`
* `~ a`
* `! a`
  * 可以是任何类型
* `await a`
  * 一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 对象或者任何要等待的值
  * 如果等待的不是 Promise 对象，则返回该值本身



### Boxzing

#### 装箱



> 实际上不是所有基本类型都可以装箱，只有一下四种基本类型可以装箱。因为 `undefind`、`null` 没有对应的 `Class`

* Number

* String

* Boolean

* Symbol

  

> Number、String、Boolean 三个当不使用 New 调用时，起到的作用就是强制类型转换。另外 Symbol 不能通过 new 去调用，可以直接调用，然后通过 Object 去装箱（也可通过 `(function(){return this;}).apply(Symbol(1))`）。

```js
String('1'); // "1"
new String("1"); // String {"1"}
typeof new String("1");	// "object"
typeof String('1');	// "string"

Number('1'); // 1
new Number('1'); // Number {1}

new Object("1");	// String {"1"}
Object("1");	// String {"1"}

new Symbol("1"); // TypeError: Symbol is not a constructor
Symbol("1"); // Symbol(1)
typeof Symbol("1"); // "symbol"
new Object(Symbol("1")); // Symbol {Symbol(1)}
typeof new Object(Symbol("1")); // "object"

Symbol.constructor	//  Function() { [native code] }
Symbol.prototype	// Symbol {Symbol(Symbol.toStringTag): "Symbol", constructor: ƒ, toString: ƒ, valueOf: ƒ, …}
// 所有普通对象构造函数的操作，symbol 都有，但是不能 new

new Object(undefined);
```



#### 拆箱

* 优先级：[toPrimitive](https://tc39.es/ecma262/#sec-toprimitive) > valueOf > toString
* 但不是简单的优先级调用问题：
  * 有 toPrimitive
    * 只调用 toPrimitive
  * 无 toPrimitive，尝试调用 [OridinaryToPrimitive(O, hint)](https://tc39.es/ecma262/#sec-ordinarytoprimitive)
    * 根据 `hint` 去优先调用 ValueOf 或者 toString，一般默认
    * `hint` 目前只有在 [`new Date().toJSON()`](https://tc39.es/ecma262/#sec-date.prototype.tojson) 调用时有使用



```js
1 + {};	// "1[object Object]"
1 + { valueOf(){ return 2; }}; // 3
1 + { toString(){ return 3; }};	// 4
1 + { toString(){ return "3"; }};	// "13"
1 + {  valueOf(){ return 2; }, toString(){ return "3"; }, };	// 3
"1" + { valueOf(){ return 2; }, toString(){ return "3"; },  };	// "12"


"1" + { [Symbol.toPrimitive](){return 4}, valueOf(){ return 2; }, toString(){ return "3"; }};	// "14"
"1" + { [Symbol.toPrimitive](){return {}}, valueOf(){ return 2; }, toString(){ return "3"; }};	// TypeError: Cannot convert object to primitive value
"1" + { valueOf(){ return {}; }, toString(){ return "3"; }};	// "13"
```



### 小结



![image-20200426182736605](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge7cguudcjj30m009jq7h.jpg)



## [Reference](https://juejin.im/post/5c7c7a7ce51d4553d7648192#heading-7)



> ES 里数据类型分为两种：一种是语言类型，如 Boolean、Number、String、Undefined、Null、Object、Symbol。另外一种是规范类型，即仅能在规范中使用，用来描述 ES 语义，无法在规范外使用的类型，如 List 和 Record、Set、Reference、Property Descriptor、Lexical Environment 和 Environment Record、Data Block。关于 Reference：[ECMA262 6.2.4 The Reference Specification Type](https://tc39.es/ecma262/#sec-reference-specification-type) 或者 [Know thy reference](http://perfectionkills.com/know-thy-reference/)

Reference 类型用来解释诸如 `delete`，`typeof`，`=`，`super` 关键字和其他语言特征等 **运算符的行为**。

### Three Components

> A Reference is a resolved name or property binding.  A Reference consists of three components：

* **Base** Value Component
  * 取值：undefined、an Object、a Boolean、a String、a Symbol、a Number、 a BigInt、an EnvironmentRecord
  * **当取值为 undefined 时，表示该 Reference 不能被解析**
* Referenced **Name** Component
  * 取值：a String、a Symbol
* Boolean-valued **Strict** Reference Flag
* thisValue Component
  * 这个组件只有当 Reference 是 Super Reference（using the super keyword） 的时候才存在
  * 这个组件的取值不可能是：an Environment Record



```js
// 按规范的描述，Reference 是一个 name binding，由三部分组成：
{
  // 值为：undefined, Object, Boolean, String, Symbol, Number, Environment Record. 
  baseValue 
  // String 或 Symbol值。
  teferencedName 
  // 布尔值，标识是否为严格模式
  strictReference 
}

// 示例：
let a = {
  b: 'test'
}
// 查找 b 时就会得到一个 Reference 类型，其值为：
{
  baseValue: a,
  referencedName: b,
  strictReference: false
}

// 其存在的目的是保证类似于 typeof a.b、delete a.b 和 a.b = 'ooxx' 能够按照预期执行
// https://www.jianshu.com/p/4b0d61b3ac54
```



### Abstract Operations

> V 是 Reference 类型

* GetBase(V)
* GetReferencedName(V)
* IsStrictReference(V)
* HasPrimitiveBase(V)
* IsPropertyReference(V)
* IsUnresolvableReference(V)
* IsSuperReference(V)
* GetValue(V)
* PutValue(V, W)
* GetThisValue(V)
* InitializeReferencedBinding(V, W)



#### GetBase(V)

* 作用：获取 V 的 `base` 组件



#### GetReferencedName(V)

* 作用：获取 V 的 `name` 组件



#### IsStrictReference(V)

* 作用：获取 V 的 `strict` 组件



#### HasPrimitiveBase(V)

* 作用：用来判断 V 的 `base` 组件的值是否是这几个原始值 `Boolean, String, Symbol, Number`



#### IsPropertyReference(V)

* 作用：用来判断 V 是否是 **属性 Reference**，即:
  * `base` 值为 `Object` 
  * 或者 `HasPrimitiveBase ( V )` 为 `true`。



#### IsUnresolvableReference(V)

* 作用：用来 V 判断是否是无法解析的 Reference，即:
  * `base` 的值为 `undefined`



#### IsSuperReference(V)

* 作用：判断 V 是不是 Super Reference，即:
  * 有没有 `thisValue`  组件



#### GetValue(V)

具有以下步骤：

1. V 不是 Reference 类型：直接返回 V
2. V 是 Reference 类型
   1. 获取 V 的 `base` 组件
   2. V 是 UnresolvableReference：抛错 `ReferenceError`
   3. V 不是 UnresolvableReference：
      1. V 是 PropertyReference
         1. `base` 是原始类型 `Boolean / String / Number /Symbol`
            1. 装箱：让 `base = ToObject(base)`
            2. 返回： ` base.[[Get]](GetReferencedName(V), GetThisValue(V))`
         2. `base` 是 `Object`
            1. 返回： ` base.[[Get]](GetReferencedName(V), GetThisValue(V))`
      2. V 不是 PropertyReference
         1. 则 base 一定是 Environment Record
         2. 返回：`base.GetBindingValue(GetReferencedName(V), IsStrictReference(V))`

> **注意**: 这里提到的 **`base = ToObject(base)`**，其实就是为什么 **`string、number` 不是对象却能够使用 `String、Number`对象上的方法的原因**。



```js
// 如这里，会先进行 LHS 查询找到 'irving'.toUpperCase() 是什么才执行函数
'irving'.toUpperCase();

{
  BaseValue: 'irving',
  ReferencedName: 'toUpperCase',
  StrictReference: false
}

// 1. 判断得出是 PropertyReference
// 2. 判断 base('irving') 是原始类型，则装箱: base = ToObject(base)
// 3. 返回: ` base.[[Get]](GetReferencedName(V), GetThisValue(V))`

```



#### PutValue(V, W)

具有以下步骤：

1. V 不是 Reference 类型，返回错误：`ReferenceError`
2. V 是 Reference 类型：
   1. 获取 V 的 `base` 组件
   2. V 是 UnresolvableReference：
      1. 严格模式：抛错 `ReferenceError`
      2. 非严格模式：
         1. 获取全局对象 `GlobalObject`
         2. 执行：`Set(globalObj, GetReferencedName(V), W, false)`
   3. V 不是 UnresolvableReference：
      1. V 是 PropertyReference
         1. `base` 是原始类型的值
            1. `base = ToObject(base)`
         2. 执行：`base.[[Set]](GetReferencedName(V), W, GetThisValue(V))`
         3. 若执行 2 执行返回 `false` 并且是严格模式：抛错 `TypeError`
      2. V 不是 PropertyReference
         1. 则确定：base 是 Environment Record 类型
         2. 返回：`base.SetMutableBinding(GetReferencedName(V), W, IsStrictReference(V))`



```js
// 上面提到的非严格模式下的一系列操作，参考下面例子：

a = 1; // 没有声明直接赋值操作。会在全局对象上新建一个属性，并为其赋值

// 当Reference为 Environment Record时，
// 大概进行的操作就是在类型为Environment Record 的base上创建一个可变绑定，并赋值。
```



#### GetThisValue(V)

* 作用：当 V 是 SuperReference 时，返回 `thisValue` 组件的值



#### InitializeReferencedBinding(V, W)

* 作用：此时 `base` 为 `EnvironmentRecord`，执行 `base.InitializeBinding(GetReferencedName(V), W)` 操作，即初始化绑定。



### 连等赋值示例

```js
// 示例:
const o = {
  m() { console.log(this === o) }
}
(o.m)();	// ture
(o.n = o.m)(); // false


// Reference 类型的值对应着一个叫做 GetValue 的方法，该方法返回的结果才是对象 o 的 m 属性所对应的值
// 为什么不对括号里面的表达式执行结果调用 getValue 方法之后再返回，其实希望保证 delete 和 typeof 这些操作符和括号表达式一起工作的时候能够符合我们的预期
// 例如，delete (o.m) 和 delete o.m 将会表现的一致。
// 因此：(o.m)() 与 o.m() 表现一致
// 因为赋值操作的返回结果是对右侧表达式的执行结果调用 getValue 方法。所以 ...

// https://segmentfault.com/a/1190000004224719
var a = {n: 1};
var b = a;
a.x = a = {n: 2};
a.x // --> undefined
b // --> {n: 1, x: {n: 2}}
// 左值，就是可以被赋值的表达式，在ES规范中是用内部类型引用(Reference)描述的：
// foo.bar 可以作为一个左值，表示对 foo 这个对象中 bar 这个名称的引用
// 变量 email 可以作为一个左值，表示对当前执行环境中的环境记录项 envRec 中email这个名称的引用；
// 函数名 func 可以做左值，然而函数调用表达式 func(a, b) 不可以

// 赋值操作符的右结合：
// A1 = A2 = A3 = A4
// A1 = (A2 = (A3 = A4))
// 步骤：
// 1. 计算 A1 得 refA1
// 2. 计算 A2 得 refA2
// 3. 计算 A3 得 refA3
// 4. 计算 A4 得 ValA4
// 即：refA1 = (refA2 = (refA3 = valA4))
// 1. 将 valA4 赋值（PutValue）给 refA3
// 2. 将 valA4 赋值给 refA2
// 3. 将 valA4 赋值给 refA1

// 赋值表达式 A = B, JS 引擎计算步骤：
// 1. 计算表达式A，得到一个引用 refA；
// 2. 计算表达式B，得到一个值 valueB；
// 3. 将 valueB 赋给 refA 指向的名称绑定；
// 4. 返回 valueB。

// 问题解析：
// 设定：
// 对象 N1 为 {n: 1}
// 依次计算表达式 a.x 和 a，得到两个引用：a.x 表示对象 N1 中的 x。而 a 相当于 envRec.a，即当前环境记录项中的 a:
// [[N1]].x = [[encRec]].a = {n: 2}
// [[]]表示引用指向的对象。
```



## 总结

![表达式及类型转换](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge8b7yllirj30u01seu0y.jpg)





