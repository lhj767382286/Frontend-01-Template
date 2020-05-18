# HTML 的解析

## 浏览器

![image-20200511231602994](https://tva1.sinaimg.cn/large/007S8ZIlgy1geox3lony2j31z80gu41t.jpg)



## 步骤



### 1. 拆分文件

* 为了方便文件管理，我们把 parser 单独拆到文件中
* parser 接受 HTML 文本作为参数，返回一颗 DOM 树



### 2. 创建状态机



#### 分析

* 其他语言词法使用产生式定义，而 HTML 则直接把状态机的状态写出来。

* 另外在 HTML 标准的 Tokenization 章节中，HTML 定义 80+ 状态，其中包含处理 RCDATA、SCRIPT、注释、DOCTYPE 等标签的状态，这里我们只关心大概不到 20+ 状态。

* EOF：End Of File

  * EOF 存在：文本节点的结束可能在文件结束时自然结束，在没有遇到特殊标签之前，可能分析还会保持着一个等待着继续补全字符的状态

  * 解决方法：

    * 使用常量 Symbol 处理 EOF
    * `const EOF = Symbol("EOF")`
    * 把 EOF 当作一个特殊的字符，在整个循环结束传给 state，起到标识文件结尾的作用

    

```js
const EOF = Symbol("EOF");

module.exports.parseHTML = function parseHTML(html){
  let state = data;
  for(let c of string) {
    state = state(c);
  }
  state = state(EOF);
}
```





#### 总结

* 我们用 FSM(有限状态机) 来实现 HTML 的分析
* 在 [HTML 标准中的 Tokenization ](https://html.spec.whatwg.org/multipage/parsing.html#data-state)中，已经规定了 HTML 的状态
* Toy-Browser 只挑选其中一部分的状态，完成一个最简版本



### 3. 解析标签

#### 分析

* [data state]( https://html.spec.whatwg.org/multipage/parsing.html#data-state)

* [tag open state](https://html.spec.whatwg.org/multipage/parsing.html#tag-open-state)

* [tag name state](https://html.spec.whatwg.org/multipage/parsing.html#tag-name-state)

* [end tag open state](https://html.spec.whatwg.org/multipage/parsing.html#end-tag-open-state)

* [self closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state)

  

```html
<html maaa=a >
    <head>
        <title>cool</title>
    </head>
    <body></body>
</html>
```



![img](https://static001.geekbang.org/resource/image/8b/b0/8b43d598bc1f83a8a1e7e8f922013ab0.png)



#### 总结

* 主要标签有：开始标签，结束标签和自封闭标签
* 在这一步我们暂时忽略属性



### 4. 创建元素

* 在状态机中，处理状态迁移，我们还会要加入业务逻辑
* 我们在标签结束状态提交标签 token



### 5. 处理属性

#### 分析



* 属性：
  * [before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state)
  * [attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-name-state)
  * [after attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-name-state)
* 值：
  * [before attribute value state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-value-state)
  * 带引号：
    * [attribute value (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state)
    * [attribute value (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(single-quoted)-state)
    * [after attribute value (quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-value-(quoted)-state)
  * 不带引号：
    * [attribute value (unqoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(unquoted)-state)

```html
<p maa=a
   
<p maa="a"

<p maa='a'
```



#### 总结

* 属性值分为单引号、双引号、无引号三种写法。因此需要较多状态处理
* 处理属性的方式跟标签类似
* 属性结束时，我们把标签加到标签 Token 上



### 6. 构建 DOM 树

* 从标签构建 DOM 树的基本技巧是 **使用栈**
* 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
* 自封闭节点可视为入栈后立即出栈
* 任何元素的父元素是它入栈的前的栈顶



### 7. 文本节点

* 文本节点与自封闭标签处理类似
* 多文本节点需要合并





