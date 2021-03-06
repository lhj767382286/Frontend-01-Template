# 第一周总结

> 让努力的结果可查询

[TOC]

## 学习内容

### 前端技能模型

* 领域知识
  * 涉及：与业务强相关
  * 提升：根据自身所处行业学习
* 前端知识
* 编程能力
  * 涉及：数据结构、算法、复杂的逻辑拆分实现等
  * 通俗：解决难，写不出来的问题
  * 提升：刻意联系、刷题
* 架构能力
  * 通俗：多个程序协同问题。 解决大，写不出来的问题
  * 提升：阅读优秀开源项目源码
* 工程能力
  * 通俗：解决人多的问题

![](http://assets.processon.com/chart_image/5e96d6137d9c0842ab3c6fb1.png)


### 学习方法


#### 整理法

* 整理的关键在于：**为知识建立关系**
* 建立关系时需关注知识的 **完备性**
* 涉及四种常见关系：
  * 顺序关系：子节点是父节点的步骤，子节点间有先后顺序。
    * 如：编译中包含词法分析、语法分析、代码优化、代码生成
  * 组合关系：父节点描述一个事物，子节点描述这个事物的各个部分
    * 如：CSS 规则包含选择器、属性、值
  * 纬度关系：
    * 如：JavaScript 包含文法、语义、运行时
  * 分类关系：父类是个集合，子类是集合的子集
    * 如：CSS 简单选择器包含 ID 选择器、class 选择器、通用选择器 ...


#### 追溯法

* 关键：根据线索层层溯源
* 线索：
    * 源头：
      * 最早出现的论文、杂志
      * 最初的实现案例
    * 标准和文档：
      * [w3.org](https://www.w3.org/)
      * [whatwg.org](https://whatwg.org/)
      * [developer.mozilla.org](https://developer.mozilla.org/zh-CN/)
      * [scholar.google.com](https://scholar.google.com/)
      * [docs.microsoft.com](https://docs.microsoft.com/zh-cn/)
      * [developer.apple.com](https://developer.apple.com/)
    * 大师：
      * [Tim Berners-Lee](https://en.wikipedia.org/wiki/Tim_Berners-Lee)
      * [Brendan Eich](https://en.wikipedia.org/wiki/Brendan_Eich)
      * [Bjarne Stroustrup](https://en.wikipedia.org/wiki/Bjarne_Stroustrup)


```
example:
1. google search : closure =>
2. wiki: closure =>
3. 查看 history 部分 =>
4. Peter J. Landin 1964 定义 =>
5. scholar.google.com 搜索：Peter J. Landin =>
6. pdf 搜索 closure =>
7. 查看前后文
```

### 关于面试

#### 面试过程

* 打断：
  * 打断意味着不感兴趣
  * 打断是一种提示
* 争论
  * 争论与压力面试
  * 争论的技巧
* 难题
  * 重在展示分析过程
  * 缩小规模

#### 题目类型

> 区分度、深度、覆盖面

* 项目型问题
* 知识型问题
* 开放性问题
* 案例性问题
* 有趣的问题


### 职业发展相关

#### 业务型成就

> 站在业务角度思考问题

* 业务目标
  * 理解公司业务核心
  * 目标转化为指标
* 技术方案
  * 业务指标到技术指标的转化
  * 形成纸面方案、完成小规模试验
* 实践方案
  * 确定实施目标、参与人
  * 管理实施进度
* 结果评估
  * 数据采集、数据报表
  * 向上级汇报


```
example: 应用手势

业务目标&指标：点击率
技术方案：给 tab 组建增加手势操作
实施 I：在业务中加入对应功能并上线
结果：点击率提升 3 倍
实施 II：编写通用 tab 组件，向所有导购业务推广，形成制度
结果 +：推广到所有导购业务，符合预期
```

#### 工程型成就

* 目标：质量、效率
* 方案与实施：
  * 规章制度
  * 库
  * 工具
  * 系统
* 结果：线上监控


```
example: XSS 攻击的预防

目标&指标：XSS 攻击白帽子反馈漏洞
技术方案：整理安全手册，review 历史代码，代码嫂买哦工具
实施：对全体前端宣讲，整体 review 代码，更改代码发布流程
结果：XSS 漏洞大幅减少
```

#### 技术难题

* 目标：行业内公认的技术难点
* 方案与实施：
  * 依靠扎实的编程能力、架构能力形成解决方案
* 结果：问题解决


```
example: 爬取某东商品价格

背景：在某浏览器插件项目中，需要爬取各网站价格比价，但是各网站会采用图片价格等手段防御
方案：引入 JS 端的数字识别技术，靠 AI 技术解决
```


### 工具链与持续集成

#### 工具链

* 工具链的作用
  * 规定了每个工具在工具链的位置
  * 保证了在同一工具链里的工具能互相配合
* 工具的分类
  * 脚手架
  * 本地调试
  * 单元测试
  * 发布
* 工具链体系的设计
  * 版本问题
    * 版本策略 - 保证一个团队里都使用同一版本
  * 数据统计
    * 如：组件使用率，报错率
```
init => run => test => publish

其中还隐含 add, build。一共六个
```

#### 持续集成

> 持续集成：每天都集成 。最终集成：项目各自开发，到最后阶段才集成。

##### 客户端软件持续集成

* Daily build
  * 如：每晚使用一台机器把所有人提交的代码拉下来 build 一个新的软件的版本
  * 结果：每天会产生一个新的软件的版本
* BVT (Build Verification Test)
  * 检查 build 结果：把软件的主要流程都跑通的一种自动化测试，通常由测试工程师提供

##### 前端持续集成

> 每次 check-in build 出来就使用 Rule check 一遍以保证代码质量和 build 质量

* Check-in build
  * 每提交一次代码，都 build 一次
* Link + Rule Check
  * Rule Check（规则检查，如检查图片大小）


### 技术架构

* 客户端架构：解决软件需求规模带来的复杂性
* 服务端架构：解决大量用户访问带来的复杂性
* 前端架构：解决大量页面需求带来的重复劳动问题

因此，前端技术架构的最主要的使命就是提高复用的比率和提高复用率。

#### 复用

> 组件的定义和基础设施，就是组件化方案

三个层次的复用：

* **库：** 有复用价值的代码
  * URL
  * AJAX
  * ENV
* **组件：** UI上多次出现的元素
  * 轮播
  * Tab
* **模块：** 经常被使用的业务区块
  * 登录

### 构建知识体系

> 运用前面讲到的学习方法去整理前端技术体系，待补充...

![](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdvoai93swj30u00x04qp.jpg)

### 其他

#### 如何读源码

1. 帮写文档
2. fix bug
3. 单步追踪调试 bug，理清局部脉络
4. 提交作者 review


#### 数据结构

> 80% 解决排序问题。20%特殊领域, 如图

1. 工作场景中大部分排序都是可哈希的。
2. 不可哈希可以用二叉树结构。
