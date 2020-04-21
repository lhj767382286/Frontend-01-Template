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
  * 为每种语言中的每个字符甚至 `emoji`设定了统一并且唯一的二进制编码
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

#### 1.4.1 Unicode 与 UTF-8

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

#### 1.4.2 中文变量名

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
| `<USP>`    | 其它任何Unicode"空白分隔符" | 其它分类“[Zs](https://www.fileformat.info/info/unicode/category/Zs/list.htm)” |                                                            |



##### 2.1.1.1 NBSP

> NO-BREAK SPACE：非断空格

* 空格字符，用途是禁止自动换行
* HTML 页面显示时会自动合并多个连续的空白字符（whitespace character），但该字符是禁止合并的，因此该字符也称作“硬空格”（hard space、fixed space）

* 普通空格：除了本身空格作用外，实际上也起到了分词效果
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

| 正式名称 | 名称     | 字符编码值 | 其他                                             |
| -------- | -------- | ---------- | ------------------------------------------------ |
| <LF>     | 进行符   | \u000A     | LINE FEED: `\n`。**一般推荐统一使用这个**        |
| <CR>     | 回车符   | \u000D     | CARRIAGE RETURE：`\r`。                          |
| <LS>     | 行分隔符 | \u2028     | LINE SEPARATOR：超出ASCII。最佳实践一般不用      |
| <PS>     | 段分隔符 | \u2029     | PARAGRAPH SEPARATOR：超出ASCII。最佳实践一般不用 |

一般写代码，最好字符限制在 ASCII 内，其次是 BMP。



#### 2.1.3 Comment

```javascript
// '*'.codePointAt(0).toString(16); // 2a

/\u002a 1111*/ // 注释失败
```



#### 2.1.4 Token

> 记号、标记。JS 里有效的输入元素都可以叫 Token。

##### 2.1.4.1 旧的分类

* 主要由下面 4  类组成，构成了整个代码的主体部分：
  * Punctuator  - 符号
    * 示例：`=, (), <, <=`
    * 不包含 `/, }`
  * Keywords - 关键字
    * 示例：`for, while`
  * Identfiter - 变量名
    * 示例：`let a = 123 中的 a`
    * 细分：
      * 变量名部分
        * 如下面中的 `document` 和 `a`
        * 不能与关键字重合
      * 属性部分
        * 如下面中的 `write`
        * 可以与关键字重合
  * Literal - 直接量
    * 示例：`true, false, 1, null`

```javascript
// 一、分类：
1. 帮助程序形成结构用的：Punctuator、Keywords
2. 我们实际代码中包含的有效信息：Indentifier、Literal

// 二、示例：
for(let i = 0 ; i < 128; i++) {
	document.write(i);
}
let a = 1;

// 三、javascript 的特殊：
// 1. get 明明不在关键字中，却起到了关键字的作用。但其实 get 可以当作变量名使用
{
	get a() {}
}
let get = 1;

// 2. className 问题。因为 v3 中不支持变量名与关键字重合
document.body.setAttribute('class', 'a');
document.body.className // a, 实际属性是叫 class
document.body.class	// v3 中报错
document.body.class = 'b' // 现在版本
```



##### 2.1.4.2 新的分类

主要由下面 3 类组成，构成了整个代码的主体部分：

* Punctuator
* **IdentfiterName**
  * Keywords
  * Identifier
  * Future Reserved Words - 未来保留字
* Literal

```
Identifier ::
	IdentifierName but not ReservedWord

IdentifierName :: IdentifierStart
	IdentifierName IdentifierPart

IdentifierStart ::
	UnicodeIDStart
	$
	_
	\ UnicodeEscapeSequence

IdentifierPart ::
	UnicodeIDContinue
	$
	\ UnicodeEscapeSequence
	<ZWNJ>  // 可做代码混淆
	<ZWJ>		// 可做代码混淆

UnicodeIDStart ::
	any Unicode code point with the Unicode property “ID_Start”

UnicodeIDContinue ::
	any Unicode code point with the Unicode property “ID_Continue”
```



> Literal，请参考下面关于类型的内容

## 3. 类型

* Runtime
  * Types
    * Number
    * String
    * Boolean
    * Object
    * Null
    * Undefined
    * Symbol
  * Execution Context



### 3.1 Number

#### 3.1.1 [IEEE 754 Double Float](https://github.com/camsong/blog/issues/9)

* Sign(1)
* Exponent (11)
* Fraction (52)



```javascript
// 模拟 float 在内存中的存储
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



#### 3.1.2 Grammer

> 分为整数型及小数型语法。其中整数型又支持 2、8、10、16 进制的写法。其中 10 进制又支持小数写法。

* DecimalLiteral - 10 进制
  * `0`
  * `0.`
  * `.0`
  * `1e3`

* BinaryIntegerLiteral
  * `ob111`
* OctalIntegerLiteral
  * `0o10`
* HexintegerLiteral
  * `0xFF`



```javascript
00010 // 8 => 不推荐
0o10 // 8 => 推荐

12.5e5 // 1250000

.0 // 0
0. // 0

0.toString(); // Invalid or unexpected token
0 .toString(); // "0"
97.toString(2); // Invalid or unexpected token
97 .toString(2); // "1100001"
// 分析 - 词法问题：
// 1."97."、"0." 是合法的数，所以在词法分析阶段，优选把会 "." 当作跟 "97" 粘在一起的东西。
// 2. 点前面加空格，"97 ." 避免被当成与数字相关的小数点
// 3. 因此那些不被真正识别的字符，如空格，起到调整词法结构和让文本美观的作用
```



> 注意：关于 10 进制，建议直接写字面量，避免使用 `parseInt`，如果确实需要使用，需要切确传第二个参数。



#### 3.1.3 Practice

* Safe Integer
  * 安全的整数范围：`Number.MAX_SAFE_INTEGER.toString(16); // "1fffffffffffff`
* Float Compare
  * 正确写法：`Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON`



### 3.2 String

* Character
* Code Point
* Encoding
* Grammer



#### 3.2.1 Encoding

> 字符集

* ASCII
* Unicode
* UCS
* GB
  * GB2312
  * GBK(GB13000)
  * GB18030
* ISO-8859
* BIG5 - 台湾、繁体中文



##### 3.2.1.1 [UCS](https://blog.csdn.net/hong10086/article/details/80654380)

* Unicode 的 BMP 范围
* 码点范围：`u+0000-U+FFFF`

##### 3.2.1.2 GB

* 国标
* 中文字符范围跟 Unicode 完全不一样
* 也会兼容 ASCII

##### 3.2.1.3 ISO-8859 系列

* 与 GB 类似

* 一堆欧洲国家各种自己的标准



##### 3.2.1.4 UTF

> 每种字符集对应着多种编码方式，即码点定了，但是这个码点如何储存？

* Unicode 的编码
* 用不同的编码形式储存不同的字符，好坏不一定
  * 以 ASCII 为主，用 UTF-8
  * 以中文为主，用 UTF-16
* UTF-32 由于太耗内存空间，因此可以认为是理论上的

![image-20200421001836671](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0ow9ft4qj31ui0lydnx.jpg)



```
如，"ab" 两个字符：

1. 使用 UTF-8 存，占了 2 个字节
2. 使用 UTF-16 存，占了 4 个字节

但是 UTF-8 也可以表示超出 ASCII 的字符（把字节里的比特位做成控制位），如： 中文“壹”在 UTF-16 中无损，在 UTF-8 中占 3 个字节：
```



![image-20200421002149566](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge0ozkn417j31pc0i4tff.jpg)



> 注意：在 JavaScript 中，基本可以认为字符是以 UTF-16 在内存中存储，所以不承认 BMP 外的字符是一个字符。那么 `String.charCodeAt` 和 `String.fromCharCode` 性能应该是好于 `String.codePointAt`，如果字符串非常大， `codePointAt`并不是一个好的选择。



#### 3.2.2 Grammer

* "abc" - 双引号语法
* 'abc' - 单引号语法
* \`abc\` - 模板语法



```
StringLiteral ::
	" DoubleStringCharacters "
	' SingleStringCharacters '

DoubleStringCharacters ::
	DoubleStringCharacter
	DoubleStringCharacters

DoubleStringCharacter  ::
	// 任意但不包括双引号、反斜杠、换行符、的 unicode 码点字符
	SourceCharacter but not one of " or \ or LineTerminator 
	<LS>
	<PS>
	
	// 反斜杠 + 转义序列(\u 转义 + \x 转义)。如："\x10" 和 "\u000A"
	// 除此之外还支持一些特殊的字符：' " \ b f n r t v。如 "\\"、"\b"、"\""、"\'"
	// 具体详见： ECMA-262 P172 Table 34 
	\ EscapeSequence	
	
	LineContinuation // 反斜杠 + 换行

SingleStringCharacters ::
	SingleStringCharacter
	SingleStringCharacters

SingleStringCharacter ::
	SourceCharacter but not one of ' or \ or LineTerminator 
	<LS>
	<PS>
	\ EscapeSequence
	LineContinuation
	
	
// javascript 词法中其实有 4 份顶级输入元素，只要是为了处理模板字符及正则表达式。关于 TemplateTail ，当左大括号消耗完时，右大括号会被当成 TemplateTail 分析。 具体可看 P174

Template :: 
	NoSubstitutionTemplate
	TemplateHead
	
NoSubstitutionTemplate ::
	` TemplateCharacters `
	
TemplateHead ::
	` TemplateCharactersopt ${
	
TemplateSubstitutionTail :: 
	TemplateMiddle
	TemplateTail

TemplateMiddle ::
	} TemplateCharacters ${
	
TemplateTail ::
	} TemplateCharacters `
```





### 3.3 Boolean

* true
* false



### 3.4 Null 和 Undefined

> 建议看极客时间重学前端的这部分内容

* null
* undefined
* void 0



```javascript
function f() {
	var undefined = 1;
	console.log(undefined); // 1
}

function f() {
	var null = 0;
  console.log(null); // Unexpected token 'null'
}
```



## 4. 总结

![词法与类型](https://tva1.sinaimg.cn/large/007S8ZIlgy1ge1f100qrmj30u01m77wh.jpg)

## 5. 参考

* [Ecma 标准 - 5.1 中文版本](https://www.w3cschool.cn/wsqzg/wsqzg-qdgl25mj.html)


