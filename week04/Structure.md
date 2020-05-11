# 结构体

> 重点：宏任务与微任务及执行次序

* function
* class
* Js 引擎

##  说明

* 事件循环

  * 宏任务
  * 微任务

* 又称“宏/微任务队列”

* **是 JS 语言的调用方去使用 JS 的一种方式**

  * 若仅执行一段代码是不需要所谓的事件循环

* 实际上既不是 JS 引擎的内容，也不是 JS 语言的一部分

  

## 一个例子



#### 没有事件循环

```objc
int main (int argc, char * argv[]) {
  @autoreleasepool {
    // var context = new JSContext
    JSContext* context = [[JSContext alloc] init];
      
    // context.evalulateScript("");
    JSValue* result = [context evalulateScript:@"1+1"];
    
    // console.log(result.toString());
    NSLog(@"%@", [result toString]);
  }
  
  return 0;
}
```



#### 事件循环

* Scanf - getCodes
  * 对于 setTimeout 类的 API 就是 - sleep
  * 对于浏览器而言可能就是等待 html 引擎把 code 的片段加载

```objc
int main (int argc, char * argv[]) {
  @autoreleasepool {
    // var context = new JSContext
    JSContext* context = [[JSContext alloc] init];
      
    // context.evalulateScript("");
    JSValue* result;
    
    while(true) {
      char sourcecode[1024];
      
      scanf("%s", &sourcecode);
      
      NSString* code = [NSString stringWithUTF8String:sourcecode)];
      
      result = [context evalulateScript:code];
      
      NSLog(@"%@", [result toString]);
    }
  }
  
  return 0;
}
```



那么，获取到的 JS 片段的类型/方式有几个？

* **3 种**
  * 模块
  * 普通代码片段
  * 函数

```html
<script>
 	// 1. 普通代码片段 - 与 src 一样
	var a = 1;
  a++;
  
  // 2. 函数
  setTimeout(function(){}, 1000)
</script>

<!-- 3. 模块 -->
<script type="module">
	var a = 1;
  a++;
</script>
```

对于 Object-C 有[两种](https://developer.apple.com/documentation/javascriptcore/jscontext)。



执行 function:

```objective-c
int main (int argc, char * argv[]) {
  @autoreleasepool {
   
    JSContext* context = [[JSContext alloc] init];
    JSValue* result;
    
    NSString* code = @"(function(x){ return x * x;})"
      
    result = [context evaluateScript:code];
    
		JSValue* arg1 = [JSValue valueWithInt32:4 inContext: context]
    
    NsLog(@"%@", [result callWithArguments:@[arg1]]);
}
  
// 16
```



执行 Promise:

```objective-c
int main (int argc, char * argv[]) {
  @autoreleasepool {
   
    JSContext* context = [[JSContext alloc] init];
    JSValue* result;
    
    NSString* code = @"new Promise(resolve => resolve()).then(() => this.a = 3), function () { return this.a };";
      
    result = [context evaluateScript:code];
    
    NsLog(@"%@", [[result callWithArguments:@[]] toString]);
}
  // 3
  // 因此可以认为在这次的 evaluate 中，做了两件事，一是执行了 new Promise(resolve => resolve()).then(() => this.a = 3), function () { return this.a };" 代码，二是把 then 里的函数执行了。我们称之为微任务。
```

![image-20200504224131680](https://tva1.sinaimg.cn/large/007S8ZIlgy1gegsrl9p2qj30rg0e6q8c.jpg)

* Task -> 宏任务或事件循环
* 子任务 -> Promise 队列或微任务
  * 微任务在 JS 引擎内
  * JS 代码都是微任务，只是哪些微任务组成的宏任务



![image-20200504225337170](https://tva1.sinaimg.cn/large/007S8ZIlgy1gegt44uyjij30w20esq79.jpg)



setTimeout、setInterval 不是 JS 本身自带 API，是 JS 宿主浏览器提供的 API，所以是宏任务。而 Promise 是本身自带的 API，所以是微任务。这样设计的原因是：Promise 是 JS 标准的一部分，JS 提供微任务的机制/模式就是为了在标准中去解释 Promise。

任务列表里有很多宏任务，每个宏任务里有自己维护的微任务列表，每个宏任务执行第二个宏任务之前会把自己的微任务列表执行完。



宏任务，微任务：宏任务不在 JS 标准中，而微任务 Promise 在 JS 标准内。所以 JS 标准规定 JS 引擎内部必须有一个序列。早年浏览器都是从外部提供任务队列，所以现在产生了宏任务与微任务的区分。纯粹的 JS 环境其实是没有宏任务的。

```
实际浏览器中如何区分：
1. 一个代码片段就是一个宏任务
2. 一次函数调用就是一个宏任务
	2.1 UI 交互如：click 事件，点击就产生一个宏任务
  2.2 setTimeout，到时间就会产生一个宏任务
  2.3 setInterval，每隔一段时间就产生一个宏任务
  
  
  // 一个 script 标签就是就算一个宏任务
```



```objective-c
// 伪代码
int main() {
   JSContext* context = [[JSContext alloc] init];
  // var taskQueue = [{time:3000, code:@"", function: f}];
  while (true) {
   	// var task = taskQueue.shift();
    // sleep(task.time);
    // [context evaluateScript: task.code]
    // 或 [task.f callWithArguments:@[]]
  }
}
```



```objective-c
new Promise

setTimeout(function(){
  
}, 0)
```





# 程序结构化

* JS Context =>Realm
  * 上下文
  * 粒度而言，最大
  * [Realm：位面](https://tc39.es/ecma262/#realm)

* 宏任务
* 微任务
* 函数调用

![image-20200507200704811](https://tva1.sinaimg.cn/large/007S8ZIlgy1gek55qjaxnj30ca07yab7.jpg)

























## Realm

### [Global 上所有的对象](https://tc39.es/ecma262/#sec-global-object)

* 可访问的

```js
var set = new Set();
var queue = [
    'eval',
    'isFinite',
    'isNaN',
    'parseFloat',
    'parseInt',
    'decodeURI',
    'decodeURIComponent',
    'encodeURI',
    'encodeURIComponent',
    'Array',
    'Date',
    'RegExp',
    'Promise',
    'Proxy',
    'Map',
    'WeakMap',
    'Set',
    WeakSet,
    Function,
    Boolean,
    String,
    Number,
    Symbol,
    Object,
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    ArrayBuffer,
    SharedArrayBuffer,
    DataView,
    Float32Array,
    Float64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Atomics,
    JSON,
    Math,
    Reflect
];

let current;
while (current.length) {
  current = queue.shift();
	set.add(current);
  for (let p in current) {
    console.log(p)
    if (current[p] instanceof Object) {
      queue.push(current[p]);
    }
  }
}
```



* LexicalEnvironment
* VariableEnvironment



Environenet Records