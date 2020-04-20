# JavaScript 词法与类型

## [词法](https://zh.wikipedia.org/wiki/%E8%AF%8D%E6%B3%95%E5%88%86%E6%9E%90)

> **词法分析**（英语：**lexical analysis**）是[计算机科学](https://zh.wikipedia.org/wiki/计算机科学)中将字符序列转换为**标记**（token）序列的过程。进行词法分析的程序或者函数叫作**词法分析器**（lexical analyzer，简称lexer），也叫**扫描器**（scanner）。词法分析器一般以函数的形式存在，供[语法分析器](https://zh.wikipedia.org/wiki/语法分析器)调用。





### unicode

* https://www.fileformat.info/info/unicode/
* https://home.unicode.org
* 

### Atom

* Grammer
  * Literal
  * Variable
  * Keywords
  * Whitespace
  * Line Terminator



## 类型

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



###  WhiteSpace

| 正式名称 | 名称                        | 字符编码值   | 其他                                                       |
| -------- | --------------------------- | ------------ | ---------------------------------------------------------- |
| <TAB>    | 制表符                      | \u0009       | '\t'.codePointAt(0)                                        |
| <VT>     | 纵向制表符                  | \u000B       | '\v'.codePointAt(0)                                        |
| <FF>     | 进纸符                      | \u000C       |                                                            |
| <SP>     | 空格                        | \u0020       |                                                            |
| <NBSP>   | 非断空格                    | \u00A0       | No-Break Space                                             |
| <ZWNBSP> | 位序掩码，别名              | \uFEFF       | ZWNBSP：Zero width no break space<br />BOM：Bit order mask |
| <USP>    | 其它任何Unicode"空白分隔符" | 其它分类“Zs” |                                                            |

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

