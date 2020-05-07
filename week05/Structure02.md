

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