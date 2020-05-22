# Layout

> 排版: “排版”这个概念最初来自活字印刷，是指我们把一个一个的铅字根据文章顺序，放入板框当中的步骤，排版的意思是确定每一个字的位置。在现代浏览器中，仍然借用了这个概念，但是排版的内容更加复杂，包括文字、图片、图形、表格等等，**我们把浏览器确定它们位置的过程，叫作排版**。



## 浏览器

![image-20200519112017698](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexldbx5lxj30kg063jru.jpg)



## 排版

* 正常流排版
  * 正常流是唯一一个文字和盒混排的排版方式
* Flex 排版
* Grid 排版
* 表格排版
* ...

### [Flex 排版](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Flexbox)

> RN 已经表明：Flex 已经足够满足日常布局排版需求

* 在父内容里面垂直居中一个块内容。
* 使容器的所有子项占用等量的可用宽度/高度，而不管有多少宽度/高度可用。
* 使多列布局中的所有列采用相同的高度，即使它们包含的内容量不同。

![image-20200519112054154](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexldy8aj1j30k408mjrz.jpg)

#### 步骤

##### 1. 收集元素进行

* 根据主轴尺寸，把元素分进行
* 若设置了 `no-wrap`，则强行分配进第一行

![image-20200519112158352](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexlf2ohgqj30kk089wf3.jpg)



##### 2. 计算主轴

* 计算主轴方向
  * 找出所有 Flex 元素 
  * 把主轴方向的尺寸按比例分配给这些元素
  * 若剩余空间为负数，所有 flex 元素为 0，等比压缩剩余元素

![image-20200519112224313](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexlfiwtj7j30kd082my7.jpg)



##### 3. 计算交叉轴

![image-20200519112252304](https://tva1.sinaimg.cn/large/007S8ZIlgy1gexlg08tqkj30ke07yjs5.jpg)

