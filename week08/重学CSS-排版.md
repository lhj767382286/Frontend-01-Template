# 重学 CSS - 排版

## 盒

* 三个角度
  * 源代码：标签 Tag
  * 语义：元素 Element
  * 表现：盒 Box

<img src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbf7mnqywj30wi0lathp.jpg" alt="image-20200531102507712" style="zoom:50%;" />

```js
DOM 树中存储主要是元素，此外还有文本节点、注释节点、Doctype 等。

元素和一些其他类型的节点统称为节点(Node)。因此 DOM 树中存储的单位是 Node。元素是 Node 的一种。

CSS 选择器选不中任何元素之外的节点，如不能选择注释节点。

CSS 选择器选中的元素，在排版时可能产生多个盒：一是 inline 元素在分行情况下一定会产生多个盒；二是存在伪元素的情况，如一个元素带两个伪元素。
```





## 盒模型

width 根据 box-sizing 分为两种盒模型：

* content-box
  *  现代浏览器默认表示 content-width
* border-box
  * content-box 中 width 计算不符合人的直接
  * 补丁：
    * box-sizing 属性调整 width 表示的是



<img src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbgf3ddyzj313c0lsq84.jpg" alt="image-20200531110654292" style="zoom:50%;" />



```js
为啥 border-box 不叫margin-box：不包含 margin-box

为什么没有 margin box: margin会出现重叠、magin 有合并
```





## 正常流

> normal flow

###  思考：我们如何写字

* 从左到右写
* 同一行写的文字都是对齐的
* 一行写满了，就换到下一行



### 正常流排版

> 总步骤与 flex 类似

* 收集 **盒** 进 **行**
* 计算 **盒** 在 **行** 中的排布
  * 考虑盒与文字的排布
    * 左右排布问题
    * 上下排布问题
* 计算 **行** 的排布
  * 关键：按行高从上到下依次排
  * 还有一些元素占一整行的
    * block-box
    * line-box

<img src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbgpp8qk5j30wi0eemzr.jpg" alt="image-20200531111706490" style="zoom:50%;" />



如上图左侧部分，为正常流排版中的行内的排布计算部分，称之为 Inline Formatting Context (简称为 IFC)。它的排列方式是 **从左往右**，涉及两种内容：一是英文字母，如上图中的 `T`、`e`，属匿名 inline box；二是 `inline-box`，Inline Box 有自己的宽高、与文字混合排布。当元素 `display` 属性被设置为 `inline`、`inline-block`、`inline-flex` 等时，在排版中就会被当成 `inline-box` 去计算排布。



如上图右侧部分，为正常流排版中的行的排布计算部分，称之为 Block Formatting Context （简称为 BFC）。它的排布方式为 **从上到下**，同样涉及两种内容：一是 Line-Box，又称为行盒，实际不会对应任何一个实际元素，可以看作为一个虚拟元素 (如 css 选择器中的 `p:first-line` 选择器)；二是 Block-box。当元素被设置为 `block`、`flex` 等时，在排版中就会被当成 `block-box` 去计算排布。



因此，无论是 BFC 还是 IFC 都是非常简单的概念，是其他行为使得 BFC 变的复杂。可以简单理解为从左到右排就是 IFC，从上到下就是 BFC。



### 正常流的行模型 - IFC

* 文字与文字、文字与 inline-box 之间混排的关系

* 重要概念：

  * 文字本身占据一定空间 （如下图黄框）
  * 文字间有对齐关系（如下图红线，baseline）
    * 中文实际上没有基线问题，其他文字有
  * 行内的盒 inline-box 与文字也存在对齐关系
  * 此外还有行高的概念

  

  

  <img src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbi3yzyoqj30ka08qwfj.jpg" alt="image-20200531120524758" style="zoom:50%;" />

  

#### Line

```html
<div style="font-size:50px;line-height: 100px; background-color: pink; ">
    Hello
    <div style="line-height: 70px; width: 100px; height: 100px; background-color: aqua; display: inline-block">
        world!
    </div>
</div>
```

![_Users_irvingliang_work_study-winter_home-work_Frontend-01-Template_week08_codes_normal-flow_line.html](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfblwm5vadj30e6037q2w.jpg)

从上面代码及图示可以看到：Hello 和 world 完美对齐的，但实际上两者的行高是不一致的，Hello 的行高是 100px，而 World 的行高则是 70px。这说明 Hello 和 World 之间是存在一条对齐的基准线，这条基准线既不是行顶也不是行底，而是 **基线**。而我们可以通过一定的手段看到这条基线。

```html
<div style="font-size:50px;line-height: 100px; background-color: pink; ">
    <div style="vertical-align:baseline;overflow: visible; display: inline-block; width: 1px; height: 1px;">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    Hello
    <div style="line-height: 70px;width: 100px; height: 100px; background-color: aqua; display: inline-block">
        world!
    </div>
</div>
```

![_Users_irvingliang_work_study-winter_home-work_Frontend-01-Template_week08_codes_normal-flow_line_02.html](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbm4tauelj30e6037wef.jpg)

如上面代码及图所示：红线即是所谓的基线，baseline。



若此时我们把 World 去掉，则会出现下图的情况，原因在于：**[一个 line-box 如果里面没有任何文字的情况下，它的基线在底部](https://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/)**(**一个 inline-block 元素，如果里面没有 inline 内联元素，或者 overflow 不是 visible，则该元素的基线就是其 margin 底边缘，否则，其基线就是元素里面最后一行内联元素的基线。**)。查看发现元素的 `computedStyle` 发现： `vertical-align: baseline` 是没有发生改变，但 baseline 变成了盒子的下沿，但有文字时就是文字的下沿。

```html
<div style="font-size:50px;line-height: 100px; background-color: pink; ">
    <div style="vertical-align:baseline;overflow: visible; display: inline-block; width: 1px; height: 1px;">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    Hello
    <div style="line-height: 70px;width: 100px; height: 100px; background-color: aqua; display: inline-block"></div>
</div>
```

![_Users_irvingliang_work_study-winter_home-work_Frontend-01-Template_week08_codes_normal-flow_line_03.html](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbmbaf76fj30e603ot8k.jpg)



这种现象在我们使用时会带来意想不到的麻烦，因此一般而言：inline-block 会配合`vertical-align: bottom/top` 属性使用。

```html
<div style="font-size:50px;line-height: 100px; background-color: pink; ">
    <div style="vertical-align:baseline;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    Hello
    <div style="vertical-align: bottom; line-height: 70px;width: 100px; height: 150px; background-color: aqua; display: inline-block"></div>
</div>
```



![_Users_irvingliang_work_study-winter_home-work_Frontend-01-Template_week08_codes_normal-flow_line_04.html (1)](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbmobhj5hj30e6046a9x.jpg)

![_Users_irvingliang_work_study-winter_home-work_Frontend-01-Template_week08_codes_normal-flow_line_04.html (2)](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbmovo7yfj30e6046a9x.jpg)



> 我们可以通过改变 `#showVerticalAlign` 中的 `vertical-align` 属性的值查看当前行的 `top`、`bottom`、`middle`、`baseline` 等基线的位置。



从上图我们可以看到最外层 div 的行高实际已经被撑高为 150px。但给 inline-box 设置不同的 `vertical-align` 属性值可以看到对齐的位置是不一样的，表现为文字偏移。这是因为：**当有子元素超过父元素 line-height 时，行模型的各参考线会受行内最高元素的高度影响，line-height 将以最高元素的高度为准，具体表现为 top, bottom 的改变，而且文字排布会始终以最高元素的对齐为准，保证最高元素的对齐方式时准确的。**



```html
<div style="font-size:50px;line-height: 100px; background-color: pink; ">
    <div style="vertical-align:baseline;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:top;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:bottom;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:middle;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:text-top;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:text-bottom;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    Hello
    <div style="vertical-align: bottom; line-height: 70px;width: 100px; height: 150px; background-color: aqua; display: inline-block">World1</div>
  	<div style="vertical-align: top; line-height: 70px;width: 100px; height: 50px; background-color: aqua; display: inline-block">World2</div>
  	<div style="vertical-align: top; line-height: 70px;width: 100px; height: 550px; background-color: plum; display: inline-block">World3</div>
</div>
```

![_Users_irvingliang_work_study-winter_home-work_Frontend-01-Template_week08_codes_normal-flow_line_05.html (7)](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbuqyeqhwj30p90fat9b.jpg)



当最高子元素 `vertical-align` 设置为 `middle` 时：

![_Users_irvingliang_work_study-winter_home-work_Frontend-01-Template_week08_codes_normal-flow_line_05.html (8)](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbur759gyj30p90fa74w.jpg)



**建议 inline-block 只使用 top, bottom, middle 之一，否则会带来意想不到的问题。** 



如当 world3 的 设置为`vertical-align: text-top` 时：



![_Users_irvingliang_work_study-winter_home-work_Frontend-01-Template_week08_codes_normal-flow_line_05.html (9)](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbux9y98jj30p90fpwf3.jpg)



如当 world1 的 设置为`vertical-align: text-bottom` 时：



![_Users_irvingliang_work_study-winter_home-work_Frontend-01-Template_week08_codes_normal-flow_line_05.html (10)](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfbv3mhdnej30p90hit9c.jpg)



可以发现：**行高上边沿是由 text-bottom 撑开的，下边沿是由 text-top 撑开的。** 可以得出正常流的交叉轴的尺寸 crossSpace 的计算方式是：先算上沿，再算下沿，然后减去 text 的高度。



#### [行盒模型](https://www.zhangxinxu.com/wordpress/2010/01/css-float%e6%b5%ae%e5%8a%a8%e7%9a%84%e6%b7%b1%e5%85%a5%e7%a0%94%e7%a9%b6%e3%80%81%e8%af%a6%e8%a7%a3%e5%8f%8a%e6%8b%93%e5%b1%95%e4%b8%80/)

```html
<p>这是一行普通的文字，这里有个 <em>em</em> 标签。</p>
```

这段HTML代码涉及到：

* 4种 boxes
  * containing box
  * content area
  * line boxes
  * inline boxes
* 关系：
  * 在 containing box 里，一个一个的 inline box 组成了 line boxes 



#####  1. content area

> 内容区域

* 指一种围绕文字 **看不见** 的盒子
* 其大小仅受字符本身特性控制
* 本质上是一个字符盒子 (character box)
* 对于替换元素 - 内容区域可以看成元素自身
* 可以把文本选中的背景色区域理解为内容区域





![content area示意 >> 张鑫旭-鑫空间-鑫生活](https://image.zhangxinxu.com/image/blog/201001/2010-01-20_223108.png)

##### 2. inline box

> 内联盒子

* inline box 不会让内容成块显示，而是排成一行
* 分为两种：
  * inline box：外部含内联标签，如：`span`、`a`、`em`
  * 匿名 inline box：光秃秃文字

![inline boxes示意 >> 张鑫旭-鑫空间-鑫生活](http://image.zhangxinxu.com/image/blog/201001/2010-01-20_220341.png)



##### 3. line box

> 行框盒子

* 每一行就是一个 line box
* 每一个 line box 又是由一个个 inline box 组成的

![line boxes示意 >> 张鑫旭-鑫空间-鑫生活](http://image.zhangxinxu.com/image/blog/201001/2010-01-20_221641.png)



##### 4. containing box

> 包含盒子，在规范中称之为 containing block

* 如 p 标签就是一个 containing box
* containing box 由一行行的 line box 组成

```html
<p>...</p>
```



#### vertical-align

> 存在一定问题

> [代码](https://github.com/lhj767382286/Frontend-01-Template/blob/master/week08/codes/normal-flow/line_06.html)

* baseline - 拿自己的 baseline 对齐行的 baseline

*  top/middle/bottom - 拿自己的 top/middle/bottom 对齐行的 top/middle/bottom

* text-top/ text-bottom - 拿自己的 text-top/text-bottom 对齐行的text-top/text-bottom

  

![_Users_lianghaijie_work_my-codes_Frontend-01-Template_week08_codes_normal-flow_line_06.html](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfdrv14oooj30vv0fa0th.jpg)



#### getClientRects

```html
<div style="font-size:50px;line-height: 100px; background-color: pink; ">
    <div style="vertical-align:baseline;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:top;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:bottom;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:middle;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:text-top;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <div style="vertical-align:text-bottom;overflow: visible; display: inline-block; width: 1px; height: 1px;" id="showVerticalAlign">
        <div style="width:1000px;height: 1px; background-color: red;"></div>
    </div>
    <span style="background: grey">Hello Hello Hello Hello Hello Hello Hello Hello Hello</span>
    <div style="vertical-align: bottom; line-height: 70px;width: 100px; height: 150px; background-color: aqua; display: inline-block">World1</div>
    <div style="vertical-align: top; line-height: 70px;width: 100px; height: 50px; background-color: aqua; display: inline-block">World2</div>
    <div style="vertical-align: top; line-height: 70px;width: 100px; height: 550px; background-color: plum; display: inline-block">World3</div>
</div>

<scirpt>
	$0.getClientRects();
  // 一个 span 产生的两个盒的位置 
  // 可以看作是 line-box里的 inline-box
  DOMRectList: {
  	// DOMRect
  	0: {
      x: 113.9375
      y: 23
      width: 649.359375
      height: 70
      top: 23
      right: 763.296875
      bottom: 93
      left: 113.9375
 	 	},
  	1: {
      x: 8
      y: 173
      width: 516.15625
      height: 70
      top: 173
      right: 524.15625
      bottom: 243
      left: 8
    }
  }
</scirpt>
```

![_Users_lianghaijie_work_my-codes_Frontend-01-Template_week08_codes_normal-flow_line_07_span.html (1)](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfe6r6fsecj30la0m8wfd.jpg)



### Float 与 clear



### margin 折叠



### Overflow: visible 与 BFC

