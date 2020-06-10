# 重学 HTML

## HTML 的定义: XML 与 SGML

### [DTD](https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)

XML 文件的文档类型定义（Document Type Definition）可以看成一个或者多个 XML 文件的模板，在这里可以定义 XML 文件中的元素、元素的属性、元素的排列方式、元素包含的内容等等。

DTD（Document Type Definition）概念缘于 SGML，每一份 SGML 文件，均应有相对应的 DTD。对 XML 文件而言，DTD 并非特别需要，well-formed XML 就不需要有 DTD。DTD 有四个组成如下：

- 元素（Elements）
- 属性（Attribute）
- 实体（Entities）
- 注释（Comments）

由于 DTD 限制较多，使用时较不方便，近来已渐被 XML Schema 所取代。

#### 常用实体

- " `"`
- \> `>`
- < `<`
- & `&`

#### 合法元素

- Element
- Text 文本
- Comment
- DocumentType <!Doctype html>
- ProcessingInstruction 处理信息(没有用)
- CDATA

## DOM API

### NODE

- Element 元素型节点
- Document 文档根节点
- Character 字符数据 包括文本节点 注释 处理信息
- DocumentFragment 文档片段 不会产生真实 dom 减少 dom 操作 可以作为性能优化的手段
- DocumentType 文档类型节点

### 导航类操作

- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling

### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

### 高级操作

- compareDocumentPosition 用于比较两个节点关系的函数
- contains 检查一个节点是否包含另外一个节点
- isEqualNode 检查两个节点是否完全相同
- isSameNode 检查两个节点是否是同一个节点 实际可以在 JS 中用===去判断
- cloneNode 复制一个节点 如果参数为 true 会连同子元素做深拷贝