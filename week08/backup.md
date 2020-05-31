CSS

* 排版
* 渲染
* 交互



## 排版部分

### 盒 (Box)

![image-20200530190906987](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfaoqkkpotj30yq0m4wpd.jpg)

```
换行会产生多个盒

为啥border-box不叫margin-box：不包含 margin-box

为什么没有margin box: margin会出现重叠、magin 有合并

margin是空隙空白的意思，盒子间的空白，包进去那就是padding了，语义
```

![image-20200530192319557](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfap5bbs11j30rl0o812v.jpg)

### 盒模型

![image-20200530191454136](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfaowjo3hoj31660litf1.jpg)





### 正常流



![image-20200530193041370](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfapcyxr2hj30gk0dg41j.jpg)



####  正常流排版

* 收集盒进行
* 计算盒在行中的排布
* 计算行的排布

![image-20200530193616647](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfapis4qnpj317s0iuq6g.jpg)

```
line-box

block-box


inline formatting context: IFC

block formatting context: BFC



BFC 本身简单，但是其他的行为导致 BFC 复杂
```



#### 正常流的盒模型

* 基线 - base line

![image-20200530194149204](https://tva1.sinaimg.cn/large/007S8ZIlgy1gfapojht48j30ro0e8tae.jpg)

```
line-box 里面没有文字的话: base-linev在盒子底部

vertical-align: bottom / top



```

<img src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gfapx54oolj30ck05mwey.jpg" alt="image-20200530195004306" style="zoom:50%;" />

<img src="https://tva1.sinaimg.cn/large/007S8ZIlgy1gfapzi2i3pj30f206mt97.jpg" alt="image-20200530195220471" style="zoom:50%;" />

