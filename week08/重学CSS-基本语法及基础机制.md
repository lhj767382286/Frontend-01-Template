# 重学 CSS - 基本语法及基本机制

[TOC]





## [选择器](https://time.geekbang.org/column/article/84365)

### 选择器语法

#### 简单选择器

* 全体选择器：`*`
* 类型选择器：`div svg | a` 
  * `|` - nampspace
* class 选择器：`.cls`
* id 选择器：`#id`
* 属性选择器：`[attr=value]`
  * `[att]` - 是检查元素是否具有这个属性
  * `[att=val]` - 精确匹配
  * `[att~=val]` - 多种匹配，val 可是用空格分割的序列
  * `[att|=val]` - 开头匹配，检查一个元素的值是否是以 val 开头
* 伪类选择器：`:hover`
  * 普通型
  * 函数型
* 伪元素选择器：`::before`

![](https://static001.geekbang.org/resource/image/4c/ce/4c9ac78870342dc802137ea9c848c0ce.png)



```html
<!-- 选中 svg 下面的 a-->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JS Bin</title>
</head>
<body>
<svg width="100" height="28" viewBox="0 0 100 28" version="1.1"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <desc>Example link01 - a link on an ellipse
  </desc>
  <a xlink:href="http://www.w3.org">
    <text y="100%">name</text>
  </a>
</svg>
<br/>
<a href="javascript:void 0;">name</a>
</body>
</html>

@namespace svg url(http://www.w3.org/2000/svg);
@namespace html url(http://www.w3.org/1999/xhtml);
svg|a {
  stroke:blue;
  stroke-width:1;
}

html|a {
  font-size:40px
}
```







#### 复合选择器

* `<简单选择器><简单选择器><简单选择器>`
* `* 或 div 必须写在最前面`



#### 复杂选择器

* `<复合选择器><sp><复合选择器>` - 后代，表示选中所有符合条件的后代节点
* `<复合选择器>">"<复合选择器>` - 子代，表示选中符合条件的子节点
* `<复合选择器>"~"<复合选择器>` - 后继，表示选中所有符合条件的后继节点（即跟当前节点具有同一个父元素，并出现在它之后的节点）
* `<复合选择器>"+"<复合选择器>` - 直接后继，表示选中符合条件的直接后继节点（即 nextSlibling）
* `<复合选择器>"||"<复合选择器>` - 列选择器，表示选中对应列中符合条件的单元格



```css
/* 表示选中所有具有 class 为 a 的后代节点中 class 为 b 的节点 */
.a .b 

/* 选中所有“具有 class 为 a 的子节点中，class 为 b 的节点” */
.a>.b

/* 选中所有具有 class 为 a 的后继中，class 为 b 的节点 */
.a~.b 

/* 选中所有具有 class 为 a 的下一个 class 为 b 的节点 */
.a+.b
```





### 选择器优先级

#### 简单选择器计数

* ID selectors
  * `#id`
* class selectors、attributes selectors、[pseudo-classes selectors](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)
  * `.cls`
  * `[name="irving"]`
  * `:hover`、`:first-child `、`last-child` ...
* type selectors、[pseudo-elements selectors](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)
  * `::first-line`、`::before`



```css
#id div.a#id {
  /*......*/
}

[0, 2, 1, 1]
S = (0 * N ^ 3) + (2 * N ^ 2) + (1 * N) + 1
取 N = 1000000
S = 2000000000000 + 1000000 + 1 = 2000001000001
```



#### 练习

##### `div#a.b .c[id=x]`

```js
[0, 1, 3, 1]
```

##### `#a:not(#b)`

```js
[0, 2, 0, 0]
```

##### `*.a`

```js
[0, 0, 1, 0]
```

##### `div.a`

```js
[0, 0, 1, 1]
```



### 伪类选择器

伪类选择器是一系列由 CSS 规定好的选择器，它们以冒号开头。伪类选择器有普通型和函数型两种。伪类是很大的一类简单选择器，它是选择器能力的一种补充。



#### 链接与行为伪类选择器

> 第一批设计出来的伪类，最常用的一批。

* `any-link` - 任意的链接，包含 `a`、`area` 和 `link` 都可能匹配到这个伪类
* `:link` - 表示未访问过的链接
* `:visited` - 表示已经访问过的链接
* `:hover` - 表示鼠标悬停在上的元素
* `:active` - 表示用户正在激活这个元素，如用户按下按钮，鼠标还未抬起时，这个按钮就处于激活状态
* `:focus` - 表示焦点落在这个元素之上
* `:target` - 用于选中浏览器 URL 的 hash 部分所指示的元素



在 Selector Level 4 草案中，还引入了 target-within、focus-within 等伪类，用于表示 target 或者 focus 的父容器。



#### 树结构关系伪类选择器

> :root 伪类表示树的根元素，在选择器是针对完整的 HTML 文档情况，我们一般用 HTML 标签即可选中根元素。但是随着 scoped css 和 shadow root 等场景出现，选择器可以针对某一子树来选择，这时候就很需要 root 伪类了。



* `:empty` - 伪类表示没有子节点的元素，这里有个例外就是子节点为空白文本节点的情况

* `:nth-child` 

  * 函数型伪类

  ![](https://static001.geekbang.org/resource/image/1e/a9/1ebdba2978a22c13844d108318b271a9.png)

* `:nth-last-child`
  * 与 `:nth-child` 的区别仅仅是从后往前数
* `:first-child ` - 第一个元素
* `:last-child` - 表示最后一个元素
* `:only-child` - 选中唯一一个子元素
* `of-type` 系列
  * `:nth-child`  的变形语法糖
  * `S:nth-of-type(An+B)` 等于 `:nth-child(|An+B| of S)`
  * 类似的还有
    *  `nth-last-of-type`
    * `first-of-type`
    * `last-of-type`
    * `only-of-type`

#### 逻辑型伪类选择器

* `:not` - 函数型，用于选中内部的简单选择器命中的元素
* `:where`、`:has`



```css
*|*:not(:hover)
```



选择器 3 级标准中，not 只支持简单选择器，在选择器 4 级标准，则允许 not 接受一个选择器列表，这意味着选择器支持嵌套，仅靠 not 即可完成选择器的一阶真值逻辑完备，但目前还没有看到浏览器实现它。



此外，在 Selector Level 4 草案中，还引入了:is :where :has 等逻辑伪类。



#### 其它伪类选择器

> 有一些草案中或者不常用的选择器，大概了解即可

* 国际化：用于处理国际化和多语言问题
  * dir
  * lang
* 音频 / 视频：用于区分音频视频的播放状态
  * play
  * pause
* 时序：用于配合读屏软件等时序性客户端的伪类
  * current
  * past
  * future
* 表格：用于处理 table 的列的伪类
  * nth-col
  * nth-last-col



### [伪元素机制](https://time.geekbang.org/column/article/84633)

> 伪元素本身不单单是一种选择规则，它还是一种机制。伪元素机制：伪元素的语法跟伪类相似，但是实际产生的效果却是把不存在的元素硬选出来。



目前兼容性达到可用的伪元素有以下几种：

* `::first-line` - 表示元素的第一行
* `::first-letter` - 表示元素的第一个字母
* `::before`
* `::after`



#### `::first-line` 

* CSS 标准规定：**first-line 必须出现在最内层的块级元素之内**

```html
<div>
  <::first-line>content content content content</::first-line>
  content content content content
  content content content content
  content content content content
  content content content content
  content content content content
</div>
```



虽然听上去很简单，但是实际上，我们遇到的 HTML 结构要更为复杂，一旦元素中不是纯文本，规则就变得复杂了。

CSS 标准规定了 first-line 必须出现在最内层的块级元素之内。



```html
<style>
    div>p#a {
        color:green;
    }

    div::first-line { 
        color:blue; 
    }
</style>

<div>
    <p id="a">First paragraph</p>
    <p>Second paragraph</p>
</div>
```

这段代码最终结果第一行是蓝色，因为 p 是块级元素，所以伪元素出现在块级元素之内，所以 **内层的 color 覆盖了外层的 color 属性**。



![_Users_lianghaijie_work_my-codes_Frontend-01-Template_week08_codes_css-selectors_first-line.html](https://tva1.sinaimg.cn/large/007S8ZIlgy1gff8mu2kt5j308e01o0sl.jpg)



若此时把 p 换成 span，结果就是相反的：

```html
<style>
    div>span#a {
        color:green;
    }
    div::first-line { 
        color:blue; 
    }
</style>
<div>
    <span id=a>First paragraph</span><br/>
    <span>Second paragraph</span>
</div>
```



![_Users_lianghaijie_work_my-codes_Frontend-01-Template_week08_codes_css-selectors_first-line.html (1)](https://tva1.sinaimg.cn/large/007S8ZIlgy1gff8pdblyvj308e018a9x.jpg)



这段代码的最终结果是绿色，这说明伪元素在 span 之外。



#### `::first-letter`

* CSS 标准：**可以在所有标签之内**

```html
<div>
  <::first-letter>c</::first-letter>ontent content content content
  content content content content
  content content content content
  content content content content
  content content content content
  content content content content
</div>
```



执行下面这段代码，我们可以看到，首字母变成了蓝色，这说明伪元素出现在 span 之内。

```html
<style>
    div>span#a {
        color:green;
    }

    div::first-letter { 
        color:blue; 
    }
</style>

<div>
    <span id=a>First paragraph</span><br/>
    <span>Second paragraph</span>
</div>
```



CSS 标准只要求 **`::first-line` 和 `::first-letter `实现有限的几个 CSS 属性，都是文本相关，这些属性是下面这些**。



![](https://static001.geekbang.org/resource/image/6e/48/6e050ee9f7a0b1657388271cceb0c548.png)

#### `::before` 与 `::after`

* 与前两个不同： **不是把已有的内容套上一个元素，而是真正的无中生有，造出一个元素**
* `::before` -  表示在元素内容之前插入一个虚拟的元素
* `::after` - 则表示在元素内容之后插入
* **两个伪元素所在的 CSS 规则必须指定`content` 属性才会生效**
  * 支持 content 为 counter



```html
<style>
    p.special::before {
        display: block;
        content: "pseudo! ";
    }
</style>
<p class="special">I'm real element</p>
```

![_Users_lianghaijie_work_my-codes_Frontend-01-Template_week08_codes_css-selectors_pseudo-elements_before&after.html](https://tva1.sinaimg.cn/large/007S8ZIlgy1gff9axvj19j308e0183yb.jpg)

