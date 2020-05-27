# Layout

> 排版: “排版”这个概念最初来自活字印刷，是指我们把一个一个的铅字根据文章顺序，放入板框当中的步骤，排版的意思是确定每一个字的位置。在现代浏览器中，仍然借用了这个概念，但是排版的内容更加复杂，包括文字、图片、图形、表格等等，**我们把浏览器确定它们位置的过程，叫作排版**。



## 浏览器

![image-20200519112017698](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexldbx5lxj30kg063jru.jpg)



## 排版

浏览器中的三代排版技术：

* 第一代：正常流排版
  
  * 正常流是唯一一个文字和盒混排的排版方式
  * `display: Block、inline-block、inline`
  * `position: relative、absolute、`
  * `float`
  
* 第二代：Flex 排版

  * 最简单实现
  * RN 证明：Flex 已经足够满足日常布局排版需求

* 第三代：Grid 排版

  

### [Flex 排版](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Flexbox)

#### 应用

* 在父内容里面垂直居中一个块内容。
* 使容器的所有子项占用等量的可用宽度/高度，而不管有多少宽度/高度可用。
* 使多列布局中的所有列采用相同的高度，即使它们包含的内容量不同。

#### 主要概念

* Main Axis - 主轴
  * 代表元素排布的方向
* Cross Axis - 交叉轴
  * 代表跟主轴垂直的方向
* 关系：
  * 默认情况下主轴是水平的
    * Flex-driection: row 时，主轴是水平的
    * Flex-direction: column 时，主轴是垂直的
  * 没有折行现象（即 `flex-wrap: nowrap`） 时，不存在交叉轴

* `flex-driection: row`
  * Main: width、x、left、right
  * Cross: height、y、top、bottom
* `flex-direction: column`
  * Main: height、y、top、bottom
  * Cross: width、x、left、right





#### 主要变量

* 三个存属性名的变量
  * mainSize
    * 'width' - 当主轴方向是水平方向时（即 `flex-direction: row | row-reverse`）
    * 'height' - 当主轴方向是垂直方向时（即 `flex-direction: column | column-reverse`）
  * mainStart
    * left - 当 `flex-direction: row` 时
    * right - 当 `flex-direction: row-reverse` 时
    * top - 当 `flex-direction: column` 时
    * bottom - 当 `flex-direction: column-reverse`
  * mainEnd
    * right - 当 `flex-direction: row` 时
    * left - 当 `flex-direction: row-reverse` 时
    * bottom - 当 `flex-direction: column` 时
    * top- 当 `flex-direction: column-reverse`
* 排版的起点
  * mainBase
    * 0 - 当 `flex-direction: row | column` 时
    * containerStyle.width - 当 `flex-direction: row-reverse`
      * containerStyle.height - 当 `flex-direction: column-reverse`
* 排版的方向
  * mainSign
    * +1 - 当 `flex-direction: row | column`
    * -1 - 当 `fex-direction: row-reverse | coluimn-reverse`

```js
// 3个存属性名的变量
mainSize: ['width' | 'height']
mainStart: ['left' | 'right' | 'top' | 'bottom']
mainEnd: ['right' | 'left' | 'bottom' | 'top']

// 排版的起点(开始的位置)
mianBase: [0 | container.width | container.height]

// 排版的方向
mainSign: [+1 | -1]


// 交叉轴类似
// 注意 wrap-reverse 会改变交叉轴的方向
// 需要将 crossStart、 crossEnd 互换
```



#### 步骤

##### 1. 收集元素进行

* 根据主轴尺寸（mainSize），把元素分进行
* 若设置了 `no-wrap`，则强行分配进第一行

![：](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexlf2ohgqj30kk089wf3.jpg)

```js
// 特例
1. 父元素没有设置 mainSize 这个属性 => 撑开（所有主元素 mainSize 累加）


2. 子元素有 flex 属性: 意味着可伸缩，代表着这一行无论有多少元素一定能放进去
3. 父元素有 nowrap: 所有元素往第一行里塞
4. 其他情况：
	4.1 item 本身超 container.mainSize => item.mainSize = container.mainSize
	4.2 container 当前 flexLine 放不下 item => 新开 flexLine
  4.3 直接进行
	

// 变量
var mainSpace = elementStyle[mainSize] // 行剩余空间
var crossSpace = 0; // 交叉轴尺寸
```

##### 2. 计算主轴

> Flex 元素是可以填满剩余宽度（主轴尺寸）的。所以在计算主轴时，意味着首先需要知道剩余宽度是多少。因此，在计算主轴时，我们会认为所有的 flex 元素宽度是个 `?`，我们会先把其他的元素都排完，最后才把剩余宽度按 flex 属性的比例分配。当剩余空间为负数时，按等比压缩剩余元素。

* 计算主轴方向
  * 找出所有 Flex 元素 
  * 把主轴方向的尺寸（mainSize）按比例分配给这些元素
  * 若剩余空间为负数，所有 flex 元素为 0，等比压缩剩余元素

![image-20200524123835629](https://tva1.sinaimg.cn/large/007S8ZIlgy1gf3fqdhimxj30ta0nm0w4.jpg)

![image-20200524123900034](/Users/irvingliang/Library/Application Support/typora-user-images/image-20200524123900034.png)

![image-20200524123917787](https://tva1.sinaimg.cn/large/007S8ZIlgy1gf3fr2c2dwj30tk0oa41x.jpg)





##### 3. 计算交叉轴

![image-20200519112252304](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexlg08tqkj30ke07yjs5.jpg)

