# JavaScript 词法与类型

[TOC]

## 1.  Unicode

### 1.1 [Unicode](https://zh.wikipedia.org/zh-cn/unicode) 介绍

* [查询网站 - fileformat](https://www.fileformat.info/info/unicode/)
  * 三个视角：
    * [Block](https://www.fileformat.info/info/unicode/block/index.htm)
    * [Categories](https://www.fileformat.info/info/unicode/category/index.htm)
    * BMP
* 简单介绍：
  * 万国码、国际码、统一码、单一码
  * 为每种语言中的每个字符设定了统一并且唯一的二进制编码
  * 使得电脑可以用更为简单的方式来呈现和处理文字
* 其他：
  * 可用 `String.fromCharCode(num)` `'\t'.codePointAt()` 打印



### 1.2 Block

| Name                                                         | From   | To     | CodePoints    | 说明                                                         |
| ------------------------------------------------------------ | ------ | ------ | ------------- | ------------------------------------------------------------ |
| [Basic Latin](https://www.fileformat.info/info/unicode/block/basic_latin/list.htm) | U+0000 | U+007F | 0 - 128       | ACSII 字符集兼容部分，包含键盘能打出来的大部分内容。是最常用部分， 在 JS 最佳实践中，通常会要求限制在这个范围之内。 |
| [CJK Unified Ideographs](https://www.fileformat.info/info/unicode/block/cjk_unified_ideographs/list.htm) | U+4E00 | U+9FFF | 19968 - 40959 | [CJK](https://zh.wikipedia.org/wiki/CJK%E5%AD%97%E4%BD%93%E5%88%97%E8%A1%A8) 中日韩统一表意符号，两万多个。 |
| [BMP](https://zh.wikipedia.org/wiki/Unicode%E5%AD%97%E7%AC%A6%E5%B9%B3%E9%9D%A2%E6%98%A0%E5%B0%84#%E5%9F%BA%E6%9C%AC%E5%A4%9A%E6%96%87%E7%A8%AE%E5%B9%B3%E9%9D%A2) | U+0000 | U+FFFF | 0 - 65535     | 基本字符平面（第零平面），4 个 16 进制能表示的范围，在此范围内兼容性比较好。如 JavaScript 中 String 只能处理 BMP 中的字符，若超出 `10000` 的，需使用 `String.fromCharCode` 或 `String.fromCodePoint` 去处理。 |



#### 1.2.1 Basic Latin

```html
<script>
  	// 可以看到，字符并非所有都不可见。如：`BACKSPACE` 等显示不出来。
    for(let i = 0 ; i < 128; i++) {
        document.write(i + " <span style='background-color: lightgreen'>" + String.fromCharCode(i) + "</span></br>");
    }
</script>
```



需要记住的字符如下：

| Character                                                    | Description    | CodePoints | 说明 |
| ------------------------------------------------------------ | -------------- | ---------- | ---- |
| [U+000A](https://www.fileformat.info/info/unicode/char/000a/index.htm) | LINE FEED (LF) | 10         | 换行 |
| [U+0020](https://www.fileformat.info/info/unicode/char/0020/index.htm) | SPACE          | 32         | 空格 |



#### 1.2.2 [BMP](https://blog.csdn.net/hong10086/article/details/80654380)

* Unicode 的编码空间从 `U+0000` 到 `U+10FFFF`，共有 1,112,064 个码点可用来映射字符

* Unicode 的编码空间可以划分为17个平面（plane），每个平面包含 65,536 个码点
* 17个平面的码位可表示为从 `U+xx0000` 到 `U+xxFFFF`
* 其中 `xx` 表示从 `00` 到 `10`，共计17个平面
* 第一个平面称为 **基本多语言平面**（Basic Multilingual Plane, **BMP**），或称第零平面（Plane 0）



### 1.3 [Categories](https://www.fileformat.info/info/unicode/category/index.htm)

* Block 更多表示成块，与码点强相关

* 分类，如字母的大写小写

* 重点关注：[Separator, Space](https://www.fileformat.info/info/unicode/category/Zs/index.htm)



#### 1.3.1 [Separator, Space](https://www.fileformat.info/info/unicode/category/Zs/list.htm)

> 参考下面词法：所有的 Space 在 JavaScript 都是合法的

### 1.4 其他

* [UCS](https://blog.csdn.net/hong10086/article/details/80654380)



#### 1.3.1 Unicode 与 UTF-8

* **[字符集](https://zh.wikipedia.org/zh-cn/%E5%AD%97%E7%AC%A6%E7%BC%96%E7%A0%81)**：
  * **定义**：为每一个「字符」分配一个唯一的 ID（学名为码位 / 码点 / Code Point）
  * 常见字符集：Unicode、ASCII、GBK

* **编码规则/方式**：
  *  **定义**：将「码点」转换为字节序列的规则（编码/解码 可以理解为 加密/解密 的过程）
  *  常见编码规则：UTF-8、UTF-16、UTF-32

* [关系](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)：
  * 字符集规定了符号的二进制代码
  * 这个符号的二进制代码的存储方式则是由编码规则/方式实现
  * UTF-8、UTF-16 只是 Unicode 的实现方式之一
    * UTF-8 以字节为单位对 Unicode 进行编码
    * [UTF-16](https://baike.baidu.com/item/UTF-16) 以 16 位无符号整数为单位对 Unicode 进行编码

#### 1.3.2 中文变量名

```javascript
var 厉害 = 1;
console.log(厉害); // 1

'好的'.codePointAt(0).toString(16); // 597d
'好的'.codePointAt(1).toString(16); // 7684
var \u597d\u7684 = 2;
console.log(好的); // 2
```



## 2. [词法](https://zh.wikipedia.org/wiki/%E8%AF%8D%E6%B3%95%E5%88%86%E6%9E%90)

> **词法分析**（英语：**lexical analysis**）是[计算机科学](https://zh.wikipedia.org/wiki/计算机科学)中将字符序列转换为**标记**（token）序列的过程。进行词法分析的程序或者函数叫作**词法分析器**（lexical analyzer，简称lexer），也叫**扫描器**（scanner）。词法分析器一般以函数的形式存在，供[语法分析器](https://zh.wikipedia.org/wiki/语法分析器)调用。



### 2.1 输入

一般而言，词法分析阶段主要找下面 4 类东西：

* InputElement
  * WhiteSpace - 空白符
  * LineTerminator - 换行符
  * Comment - 注释
  * **Token**  - 一切有效的输入

```
// ECMA-262 P703

InputElementDiv ::
	WhiteSpace	// 空白符
	LineTerminator	// 换行符
	Comment	 // 注释
	CommonToken	 // 有效输入
	DivPunctuator	 // 除号 "/" "/="
	RightBracePunctuator	// 右大括号 "}"
```


#### 2.1.1 WhiteSpace

```
// ECMA-262 P160  6 种空白符

WhiteSpace ::
	<TAB>
	<VT>
	<FF>
	<SP>
	<NBSP>
	<ZWNBSP>
	<USP>
```

| 正式名称 | 名称                        | 字符编码值   | 说明                                                       |
| -------- | --------------------------- | ------------ | ---------------------------------------------------------- |
| `<TAB>`    | 制表符                      | [\u0009](https://www.fileformat.info/info/unicode/char/0009/index.htm) | `'\t'.codePointAt(0)`                                        |
| `<VT> `    | 纵向制表符                  | [\u000B](https://www.fileformat.info/info/unicode/char/000b/index.htm) | `'\v'.codePointAt(0)  `                                      |
| `<FF>`     | 进纸符/换页符                  | [\u000C](https://www.fileformat.info/info/unicode/char/000c/index.htm) | FORM FEED |
| `<SP>`     | 空格                        | [\u0020](https://www.fileformat.info/info/unicode/char/0020/index.htm) | `' '.codePointAt(0)` |
| `<NBSP>`   | 非断空格      | [\u00A0](https://www.fileformat.info/info/unicode/char/00a0/index.htm) | NO-BREAK SPACE                               |
| `<ZWNBSP>` / `<BOM>` | 位序掩码              | [\uFEFF](https://www.fileformat.info/info/unicode/char/feff/index.htm) | ZWNBSP：ZERO WIDTH NO-BREAK SPACE<br />BOM：BYTE ORDER MARK |
| `<USP>`    | 其它任何Unicode"空白分隔符" | 其它分类“Zs” |                                                            |



##### 2.1.1.1 NBSP

> NO-BREAK SPACE：非断空格

* 普通空格，除了本身空格作用外，实际上也起到了分词效果
  * 断行断在分词之间

```html
I love Java Script. I love Java Script. I love Java Script. I love Java Script.
```

![image-20200420210602563](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0jbumf1fj306y023weg.jpg)

若此时想让 `JavaScript` 断开成 `Java Script`，但不想词断开。可以通过 `nbsp` 去实现。

```
I love Java&nbsp;Script. I love Java&nbsp;Script. I love Java&nbsp;Script. I love Java&nbsp;Script.
```

![image-20200420210809028](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0je1pd78j306j02s0sn.jpg)

##### 2.1.1.2 ZWNBSP

> ZERO WIDTH NO-BREAK SPACE / [BYTE ORDER MARK](https://baike.baidu.com/item/BOM/2790364?fr=aladdin)：即字节顺序标记，它是插入到以UTF-8、UTF16或UTF-32编码Unicode文件开头的特殊标记，用来识别Unicode文件的编码类型。具体编码如下表：

| BOM         | Encoding               |
| ----------- | ---------------------- |
| EF BB BF    | UTF-8                  |
| FE FF       | UTF-16 (big-endian)    |
| FF FE       | UTF-16 (little-endian) |
| 00 00 FE FF | UTF-32 (big-endian)    |
| FF FE 00 00 | UTF-32 (little-endian) |

前端最佳实践：在所有 js 文件前加入空行，以防止 BOM 产生的问题。



#### 2.1.2 LineTerminator

```
// ECMA-262 P161

LineTerminator ::
	<LF>
	<CR>
	<LS>
	<PS>
```

| 正式名称 | 名称     | 字符编码值 | 其他                        |
| -------- | -------- | ---------- | --------------------------- |
| <LF>     | 进行符   | \u000A     | '\n'。一般使用这个          |
| <CR>     | 回车符   | \u000D     | '\r'。                      |
| <LS>     | 行分隔符 | \u2028     | 超出ASCII。最佳实践一般不用 |
| <PS>     | 段分隔符 | \u2029     | 超出ASCII。最佳实践一般不用 |

### 2.2 Atom

* Grammer
  * Literal
  * Variable
  * Keywords
  * Whitespace
  * Line Terminator



## 3. 类型

* Runtime
  * Types
  * Execution Context































http://www.fileformat.info/info/unicode/block/basic_latin/list.htm

http://www.fileformat.info/info/unicode/block/index.htm

https://www.w3cschool.cn/wsqzg/wsqzg-qdgl25mj.html

https://tool.oschina.net/uploads/apidocs/jquery/regexp.html

```
InputElementDiv
	WhiteSpace // 空白符
	LineTerminator // 换行符
	Comment // 注释
	Punctuator //
	Token
		//	帮助形成结构
		Punctuator	// 符号, "() = ;"
		Keywords	// 关键词 for

		// 实际我们输入有效信息
		Identfiter // 标识符。名字。变量名
			// 变量名部分 - 不可与关键词重合
			// 属性部分 - 可与关键字重合
		Literal // 直接量 true, false ...


```



### LineTerminator

| 正式名称 | 名称     | 字符编码值 | 其他                        |
| -------- | -------- | ---------- | --------------------------- |
| <LF>     | 进行符   | \u000A     | '\n'。一般使用这个          |
| <CR>     | 回车符   | \u000D     | '\r'。                      |
| <LS>     | 行分隔符 | \u2028     | 超出ASCII。最佳实践一般不用 |
| <PS>     | 段分隔符 | \u2029     | 超出ASCII。最佳实践一般不用 |

不要超出 ASCII。如果超出也不要超过 BMP。

Basic Multilingual Plane 就是BMP

关于“回车”（carriage return）和“换行”（line feed）这两个概念的来历和区别。
在计算机还没有出现之前，有一种叫做电传打字机（Teletype Model 33）的玩意，每秒钟可以打10个字符。但是它有一个问题，就是打完一行换行的时候，要用去0.2秒，正好可以打两个字符。要是在这0.2秒里面，又有新的字符传过来，那么这个字符将丢失。

于是，研制人员想了个办法解决这个问题，就是在每行后面加两个表示结束的字符。一个叫做“回车”，告诉打字机把打印头定位在左边界；另一个叫做“换行”，告诉打字机把纸向下移一行。

这就是“换行”和“回车”的来历，从它们的英语名字上也可以看出一二。

### Comment

### Token

```
	Token
		//	帮助形成结构
		Punctuator	// 符号, "() = ;"
		Keywords	// 关键词 for

		// 实际我们输入有效信息
		Identfiter // 标识符。名字。变量名
			// 变量名部分 - 不可与关键词重合
			// 属性部分 - 可与关键字重合
		Literal // 直接量 true, false ...


// 现在：
Token ::
  Punctuator
  IdentifierName
  	Keywords
  	Identfiter
  	Future reserverd Keywords: enum
	Literal
		Number
		String
		Boolean
		Object
		Null
		Undefined
		Symbol

```



#### Literal

Number

精度问题 IEEE753

```javascript
var a = 0.1;
var b = 0.2;

const memory = new Float64Array(1);
memory[0] = a;

const intarr = new Uint8Array(memory.buffer);

for (let i = 0; i < 8; i++) {
	let s = (intarr[i].toString(2));
  console.log(s.padStart(8, "0"));
}

// console.log(intarr);
```





作业 正则 - 匹配所有 js 的number 类型



![image-20200418210033212](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdy7xkxzfij31i00mqjt3.jpg)



```
97 .toString(2)
// 点前面加空格，"97." 避免被当成与数字相关的小数点
"97." 是合法的数
// 0110 0001

ASCII // 0 -128
UCS - // unicode 的 bmp 范围。不超过 ffff。 u+0000-U+FFFF
```

定义编码后，怎么存呢？

UTF-8

UTF-16

- Unicode 是「字符集」：为每一个「字符」分配一个唯一的 ID（学名为码位 / 码点 / Code Point）
- UTF-8 是「编码规则」：将「码位」转换为字节序列的规则（编码/解码 可以理解为 加密/解密 的过程）

https://www.zhihu.com/question/23374078





写一个 UTF8_Encoding 函数

![image-20200418213039148](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdy8suonbrj31fa0m8117.jpg)
