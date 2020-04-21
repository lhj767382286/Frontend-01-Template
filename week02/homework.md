## 1. 写一个正则表达式匹配所有 Number 直接量

### 1.1 分析

Number 类型直接量可以分为以下 5 类：

* 普通十进制整数、小数
* 十进制指数形式
* 二进制数
* 八进制数
* 十六进制数

#### 1.1.1 普通十进制整数或小数

```javascript
127
127.5				
.0
0.

/^\.\d+|(0|[1-9]\d*)\.?\d*$/g
```



#### 1.1.2 十进制指数形式

```javascript
1e3 
1.2E3
.2E3

/^(\.\d+|(0|[1-9]\d*)\.?\d*)([eE][-\+]?d+)$/g
```





```javascript

// 2. 指数形式 (Exponentiation) 
1e3 1E3

// 3. 二进制数 (Binary numbers)
0b111

// 4. 八进制数 (Octal numbers)
0o10

// 5. 十六进制数 (Hexadecimal numbers)
0xFF
```







- 写一个 UTF-8 Encoding 的函数
- 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

![image-20200418213039148](https://tva1.sinaimg.cn/large/007S8ZIlgy1gdy8suonbrj31fa0m8117.jpg)





https://tool.oschina.net/uploads/apidocs/jquery/regexp.html