# CSS 的渲染

## 浏览器

![image-20200530123900237](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfadgo6mq0j320y0i27cz.jpg)

## 步骤

### 1. 绘制单个元素

* 绘制需要依赖一个图形环境
* 这里采用 npm 包 - images
* 绘制在一个 viewport 上进行
* 与绘制相关的属性：
  * Background-color
  * border
  * Background-image 等



### 2. 绘制 DOM

* 递归调用子元素的绘制方法完成 DOM 树的绘制
* 忽略一些不需要绘制的节点
* 实际浏览器中，文字绘制是难点，需要依赖字体库，这里忽略
* 实际浏览器中，还会对一些图层做 compositing，这里也忽略