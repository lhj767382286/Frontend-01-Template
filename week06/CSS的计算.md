# Browser CSS



![](https://static001.geekbang.org/resource/image/63/4c/6391573a276c47a9a50ae0cbd2c5844c.jpg)

## 环境准备

* npm i [css](https://www.npmjs.com/package/css)
* CSS parser / stringifier.



```js
var css = require('css');
var obj = css.parse('body { font-size: 12px; }', options);
css.stringify(obj, options);
```



## CSS Computing

### 浏览器

![image-20200519111916257](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexlc9ikzsj30k705z0t6.jpg)





### 步骤



#### 1. 收集 CSS 规则

* 遇到 style 标签时，我们把 css 规则保存起来
* 调用 CSS Parser 分析 CSS 规则
* 这里我们必须要仔细研究此库分析 CSS 规则的格式



```js
let currentTextNode = null;
let rules = [];

function addCSSRules(text) {
    var ast = css.parse(text);
    console.log(JSON.stringify(ast, null, "    "));
    rules.push(...ast.stylesheet.rules);
}

function emit(token) {
  // ...
  if (token.type === "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {

      // 遇到 style 结束标签时，执行添加 CSS 规则的操作
      if (top.tagName === "style") {
        addCSSRules(top.children[0].content);
      }

      stack.pop();
    }
    currentTextNode = null;
  }
  // ...
}
```





#### 2. 添加调用

*  当我们创建一个元素后，立即计算CSS
* 理论上，当我们分析一个元素时，所有CSS规则已经收集完毕
* 在真实浏览器中，可能遇到写在 body 的 style 标签，需要重新 CSS 计算的情况，这里我们忽略



#### 3. 获取父元素序列

* 在 computeCSS 函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
*  我们从上一步骤的 stack，可以获取本元素所有的父元素
* 因为我们首先获取的是“当前元素”，所以我们获得和计算父元素匹配的顺序是从内向外

![image-20200519104457979](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexkcm4exqj305l023mx4.jpg)

````js
// 首先获取的是“当前元素”，所以我们获得和计算父元素匹配的顺序是从内向外
var elements = stack.slice().reverse();
if (!element.computedStyle) {
  element.computedStyle = {};
}
// elements: [div, body, html, document]
````

#### 4. 拆分选择器

* 选择器也要从当前元素向外排列
* 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列

```js
function computeCSS(element) {
    // 首先获取的是“当前元素”，所以我们获得和计算父元素匹配的顺序是从内向外
    var elements = stack.slice().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    for (let rule of rules) {
        // 拆分选择器
        // 选择器也要从当前元素向外排列
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if (!match(element, selectorParts[0])) {
            continue;
        }

        let matched = false;
        
        // 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列
        var j = 1;
        for(var i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }

        if (j >= selectorParts.length) {
            matched = true;
        }

        if (matched) {
            // 如果匹配到，我们要加入
            console.log("Element", element, "matched rule", rule);
        }
    }
}
```





#### 5. 计算选择器与元素匹配

* 根据选择器的类型和元素属性，计算是否与当前元素匹配
* 这里仅仅实现了三种基本选择器，实际的浏览器中要处理复合选择器
*  作业(可选): 实现复合选择器，实现支持空格的 Class 选择器

```js
/**
 * 计算选择器与元素匹配
 * @param {*} element 
 * @param {*} selector 
 */
function match(element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }

    // ID 选择器
    if (selector.charAt(0) == "#") {
        var attr = element.attributes.filter(attr => attr.name === 'id')[0];
        if (attr && attr.value === selector.replace('#', '')){
            return true;
        }

    // 类选择器
    } else if (selector.charAt(0) == '.') {
        var attr = element.attributes.filter(attr => attr.name === 'class')[0];
        if (attr && attr.value === selector.replace(".", "")) {
            return true;
        }

    // 元素选择器
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }

    return false;
}
```





#### 6. 生成computed属性

* 一旦选择匹配，就应用选择器到元素上，形成 computedStyle



```js
function computeCSS(element) {
  // ...
  if (matched) {
    // 如果匹配到，我们要加入
    var computedStyle = element.computedStyle;
    for (var declaration of rule.declarations) {
      if (!computedStyle[declaration.property]) {
        computedStyle[declaration.property] = {};
        computedStyle[declaration.property].value = declaration.value;
      }
    }
    console.log(element.computedStyle);
  }
  // ...
}
```



#### 7.[确定规则覆盖关系](https://drafts.csswg.org/selectors-3/#specificity)

* CSS 规则根据 specificity 和后来优先规则覆盖
* specificity 是个 **四元组**，越左边权重越高
* 一个 CSS 规则的 specificity 根据包含的简单选择器相加而成

> 早期 IE 使用 4 个字节存权重，问题：当超过 255 会发生进位，如： 255 个 tag 选择器就等于 1 个 class 选择器。

```js
/**
 * 覆盖规则，权重计算
 */
function specificity(selector) {
    var p = [0, 0, 0, 0];
    var selectorParts = selector.split(" ");
    for (var part of selectorParts) {
        if (part.charAt(0) == "#") {
            p[1] += 1;
        } else if (part.charAt(0) == ".") {
            p[2] += 1; 
        } else {
            p[3] += 3;
        }
    }
    return p;
}
```

```
// 标准中的计算规则： https://drafts.csswg.org/selectors-3/#specificity

*               /* a=0 b=0 c=0 -> specificity =   0 */
LI              /* a=0 b=0 c=1 -> specificity =   1 */
UL LI           /* a=0 b=0 c=2 -> specificity =   2 */
UL OL+LI        /* a=0 b=0 c=3 -> specificity =   3 */
H1 + *[REL=up]  /* a=0 b=1 c=1 -> specificity =  11 */
UL OL LI.red    /* a=0 b=1 c=3 -> specificity =  13 */
LI.red.level    /* a=0 b=2 c=1 -> specificity =  21 */
#x34y           /* a=1 b=0 c=0 -> specificity = 100 */
#s12:not(FOO)   /* a=1 b=0 c=1 -> specificity = 101 */
```
