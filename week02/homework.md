# 作业

[TOC]

## 1. 写一个正则表达式匹配所有 Number 直接量

### 1.1 分析

从 ECMA 262 标准里的词法定义，可以看出 Number 类型直接量可以分为以下 5 类：

* 普通十进制整数、小数
* 十进制指数形式
* 二进制数
* 八进制数
* 十六进制数

#### 1.1.1 普通十进制整数或小数

```javascript
// /\.\d+/
.0

// /(0|[1-9]\d*)\.?\d*/
127
127.5
0
0.	

/\.\d+|(0|[1-9]\d*)\.?\d*/g
```



#### 1.1.2 十进制指数形式

```javascript
1e3 
1.2E3
.2E3
.2E-3

// 实际上 E 前面部分就是 “普通的十进制整数或小数”
/(\.\d+|(0|[1-9]\d*)\.?\d*)([eE][-\+]?\d+)+/g

// 所以需要匹配 "普通十进制整数或小数" + "十进制指数形式"
/(\.\d+|(0|[1-9]\d*)\.?\d*)([eE][-\+]?\d+)?/g
```



#### 1.1.3 二进制数

```javascript
0b111
0B0001

/0[bB][01]+/g
```

#### 1.1.4 八进制数

```javascript
0o10
0O71

/0[oO][0-7]+/g
```



#### 1.1.5 十六进制数

```javascript
0xFF
0XABF9

/0[xX][0-9a-fA-F]+/g
```

### 1.2 解答

```javascript
// 这里将 10 进制的匹配优先级降低，是为了在避免匹配如 "dds00xaaFF" 这种字符串时，会优先匹配出 "00"，而不是我们想要的 16 进制
const reg = /0[xX][0-9a-fA-F]+|0[oO][0-7]+|0[bB][01]+|[-\+]?(\.\d+|(0|[1-9]\d*)\.?\d*)([eE][-\+]?\d+)?/g;

const str = "-0.22222&7dasdads.3e-1d2e3sda|dsd-.0dsda-0.as0b111dsd0b11002377aasd0B11002323kkkk0oO00o112374dsad0o123dddddos0xAdGGG0xAb12";

str.match(reg);
// ["-0.22222", "7", ".3e-1", "2e3", "-.0", "-0.", "0b111", "0b1100", "2377", "0B1100", "2323", "0", "00", "112374", "0o123", "0xAd", "0xAb12"]
```



## 2. 写一个 UTF-8 Encoding 的函数

### 2.1 分析

#### 2.1.1 基础知识

* [UTF-8](https://zh.wikipedia.org/wiki/UTF-8)（**8-bit Unicode Transformation Format**）
  * 是一种针对 [Unicode](https://zh.wikipedia.org/wiki/Unicode) 的可变长度[字符编码](https://zh.wikipedia.org/wiki/字元編碼)
  * 可以用一至四个字节对 Unicode 字符集中的所有有效编码点进行编码，属于 [Unicode](https://zh.wikipedia.org/wiki/Unicode) 标准的一部分
* 结构：
  * UTF-8 使用一至六个[字节](https://zh.wikipedia.org/wiki/位元组)为每个字符编码
  * 2003年11月，UTF-8 被 RFC 3629重新规范，只能使用原来 Unicode 定义的区域，`U+0000` 到 `U+10FFFF`
  * **Unicode 和 UTF-8 之间的转换关系表** 如下：
    * ASCII码的范围，用一个字节表示
    * 超出ASCII码的范围就用字节表示
    * 大于ASCII码的，就会由上面的第一字节的前几位表示该 unicode 字符的长度: `110xxxxx`表示这是个2BYTE 的 Unicode 字符

| 码点位数 | 码点值区间         | 字节序列 | Byte1       | Byte2       | Byte3       | Byte4       | 说明                                                       |
| -------- | ------------------ | -------- | ----------- | ----------- | ----------- | ----------- | ---------------------------------------------------------- |
| 7        | U+0000 - U+007F    | 1        | `0xxx xxxx` |             |             |             | ASCII 范围                                                 |
| 11       | U+0080 - U+07FF    | 2        | `110x xxxx` | `10yy yyyy` |             |             | 带附加符号的拉丁文...                                      |
| 16       | U+0800 - U+FFFF    | 3        | `1110 xxxx` | `10yy yyyy` | `10zz zzzz` |             | 其他 BMP，常用的[汉字](https://zh.wikipedia.org/wiki/漢字) |
| 21       | U+10000 - U+1FFFFF | 4        | `1111 0xxx` | `10yy yyyy` | `10zz zzzz` | `10xx xxxx` | 极少用到的 Unicode 辅助平面                                |



**对于 UTF-8 编码中的任意字节 B 的控制位** 的含义如下：

* 如果 B 是 `0xxx xxxx`，表示则B独立的表示一个字符 (ASCII码)；
* 如果 B 是 `10xx xxxx`，则 B 为一个多字节字符中的一个字节 (非ASCII字符)；
* 如果 B 是 `110x xxxx`，则 B 为两个字节表示的字符中的第一个字节；
* 如果 B 是 `1110 xxxx`，则 B 为三个字节表示的字符中的第一个字节；
* 如果 B 是 `1111 0xxx`，则 B 为四个字节表示的字符中的第一个字节；



**除控制位外其他位的储存规则**：参照示例



#### 2.1.2 示例分析

> [参考网站](https://mothereff.in/utf-8)

**示例 1：**

```javascript
// 示例：irving
// 分析：都是字母，且都在 unicode 的 ASCII 范围内，每个字母用一个字节存

"irving".codePointAt(0).toString(16); // 69
"irving".codePointAt(1).toString(16); // 72
"irving".codePointAt(2).toString(16); // 76
"irving".codePointAt(3).toString(16); // 69
"irving".codePointAt(4).toString(16); // 6e
"irving".codePointAt(5).toString(16); // 67

// UTF-8-encoded: \x69\x72\x76\x69\x6E\x67
```



**示例 2:**

```javascript
// 示例：א
// 分析：希伯来语字母 aleph，在 ASCII 范围外，但在 U+0080 - U+07FF 之间。用两个字节存，分别为：
// 110x-xxxx 10yy-yyyy

"א".codePointAt(0).toString(2); // 101 1101-0000

// 将 “א” 的 11 位二进制数按顺序放入 "x" 和 "y" 部分 （这里不用补是因为： count(x) + count(y) === 11）
1101-0111 1001-0000

//转换成 16 进制如下：
// UTF-8-encoded: \xD7\x90
```



**示例 3：**

```javascript
// 示例：壹
// 分析：中文字符，按照 utf-8 规则，使用 3 个字节去存，且分别为:
// 1110-xxxx 10yy-yyyy 10zz-zzzz 

"壹".codePointAt(0).toString(2); // 0101-1000 1111-1001

// 将 "壹" 的 16 位二进制数按顺序放入 "x" 和 "y" 部分：（这里需要补 0 再顺序放入是因为：count(x) + count(y) + count(z) === 15 + 1）
1110-0101 1010-0011 1011-1001

//转换成 16 进制如下：
// UTF-8-encoded: \xE5\xA3\xB9
```



### 2.2 解答

> 这里也可以借助 encodeURIComponent 去实现，这里主要是为了现 utf-8 对字符的编码规则及字符二进制储存，就不使用 encodeURIComponent 了。

```javascript
/**
 * 将字符串进行 utf-8 编码
 * @param {string} str 需要编码的字符串 
 * @returns {string} 经过 utf-8 编码的 16 进制字符串 
 */
const encodeUTF8 = (str) => {
  return Array.prototype.map.call(str, (v) => {
    // 获取当前字符码点
    let codePoint = v.codePointAt(0);
    if (codePoint <= 127) {
      // 1. ASCII 范围 - 直接返回 16 进制
      return '\\x' + codePoint.toString(16).toUpperCase();

    } else if (codePoint <= 2047) {
      // 2. 拉丁文等
      // 获取当前字符码点的 11 位二进制数
      let codePonit2Binary = codePoint.toString(2).padStart(11, '0');
      let firstByte = '\\x' + parseInt(`110${codePonit2Binary.slice(0, 5)}`, 2).toString(16).toUpperCase();
      let secondByte = '\\x' + parseInt(`10${codePonit2Binary.slice(5)}`, 2).toString(16).toUpperCase();
      return firstByte + secondByte;

    } else if (codePoint <= 65535) {
      // 3. 除1，2外的 BMP
      // 获取当前字符码点的 16 位二进制数
      let codePonit2Binary = codePoint.toString(2).padStart(16, '0');
      let firstByte = '\\x' + parseInt(`1110${codePonit2Binary.slice(0, 4)}`, 2).toString(16).toUpperCase();
      let secondByte = '\\x' + parseInt(`10${codePonit2Binary.slice(4, 10)}`, 2).toString(16).toUpperCase();
      let thirdByte = '\\x' + parseInt(`10${codePonit2Binary.slice(10)}`, 2).toString(16).toUpperCase();
      return firstByte + secondByte + thirdByte;

    } else {
      throw new Error(`未支持字符：${v}`);
    }
  }).join('');
}

encodeUTF8('irving壹א'); // \x69\x72\x76\x69\x6E\x67\xE5\xA3\xB9\xD7\x90
```



## 3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

### 3.1 分析

从 ECMA 262 标准里的词法定义，可以看出 String 类型直接量可以分为以下几类：

* 单引号字符串
  * Unicode 字符（除了 `" \ \n \r`）
  * `<LS>` : `\u2028`
  * `<PS>`:  `\u2029`
  * 转义：
    * 单字符转义序列：`\' \" \\ \b \f \n \r \t \v `、
    * `\0`、（Unicode 值 0000）
    * 16 进制转义序列：`\xFFFF` (`/[0-9a-fA-F]+/`)
    * Unicode 转义序列：
      * `\u{codePoint}`: codePoint (<= 10FFFF)
      * `\uFFFF`

* 双引号字符串
  * Unicode 字符（除了 `" \ \n \r`）
  * `<LS>` : `\u2028`
  * `<PS>`:  `\u2029`
  * 转义：
    * 单字符转义序列：`\' \" \\ \b \f \n \r \t \v `、
    * `\0`、（Unicode 值 0000）
    * 16 进制转义序列：`\x HexDigit HexDigit `
    * Unicode 转义序列：
      * `\u{ codePoint }`: codePoint (<= 10FFFF)
      * `\u Hex4Digits`
    * 换行符转义：`\\\n \\\r \\u2028 \\u2029`

可以看出单双引号字符串的字面量其实类似，具体如下：

```javascript
// <LS> / <PS>
/\\u2028|\\u2029/g

// unicode 字符
/\\u[0-9a-fA-F]{4}/g

// 转义- 16 进制：\x HexDigit HexDigit
/\\x[0-9a-fA-F]{2}/g

// 转义 - unicode：\u HexDigit HexDigit HexDigit HexDigit
/\\u[0-9a-fA-F]{4}/g

// 转义 - 单字符及换行符：
/\\['"\\bfnrtv\n\r\u\u2028\u2029]/g
    
// 转义 - \u0000
/\\0/g
```



### 3.2 解答

```javascript
// 单引号
/(?:[^'\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*/g

// 双引号
/(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*/g
```



## 4. 工具

* [Regular expressions](https://regex101.com/r/1paXsy/1)
* [正则符号](https://tool.oschina.net/uploads/apidocs/jquery/regexp.html)



![image-20200418213039148](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdy8suonbrj31fa0m8117.jpg)


