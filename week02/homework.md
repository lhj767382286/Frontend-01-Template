# 作业

## 1. 写一个正则表达式匹配所有 Number 直接量

### 1.1 分析

从 ECMA 262 标准里的词法定义，可以看出 Number 类型直接量可以分为以下 5 类：

* 普通十进制整数、小数
* 十进制指数形式
* 二进制数
* 八进制数
* 十六进制数

```
"0.22222&7dasdads.3e-1d2e3sda|dsd.0dsda0.asdsd0b110023770B11002323kkkk".match();
```



#### 1.1.1 普通十进制整数或小数

```javascript
127
127.5				
.0
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

### 1.2 答案

```javascript
/(\.\d+|(0|[1-9]\d*)\.?\d*)([eE][-\+]?\d+)?|0[bB][01]+/g
```



## 2. 写一个 UTF-8 Encoding 的函数



## 3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

![image-20200418213039148](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdy8suonbrj31fa0m8117.jpg)



https://github.com/chtTina/Frontend-01-Template/blob/master/week02/StringLiterals.md

https://github.com/GitLuoSiyu/Frontend-01-Template/tree/master/week02

https://tool.oschina.net/uploads/apidocs/jquery/regexp.html