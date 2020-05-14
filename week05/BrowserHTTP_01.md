# 浏览器工作原理



[TOC]



## 总论

### 浏览器

![image-20200511231602994](https://tva1.sinaimg.cn/large/007S8ZIlgy1geox3lony2j31z80gu41t.jpg)



### ISO-OSI 七层网络模型

![image-20200511231644208](https://tva1.sinaimg.cn/large/007S8ZIlgy1geox4bg9tfj31r20u0wiy.jpg)

### TCP 与 IP 的一些基础知识

#### TCP

* 流
  * 流式传输，存在[粘包](https://www.zhihu.com/question/20210025)问题
* 端口 
  * 标识应用
* `require('net')`

#### IP

* 包
* IP 地址
* `libnet/libpcap`
  * NODE 中访问不到，只能通过 C++ 访问
  * [libnet](https://baike.baidu.com/item/libnet/1589792?fr=aladdin) - 构造 IP 包库
  * [Libpcap](https://baike.baidu.com/item/libpcap) - 抓包

## [HTTP 协议](https://tools.ietf.org/html/rfc2616)

> 在 TCP 的基础上规定了一个 Request、Response 模型，一定是一问一答，而且是先问后答。而 TCP 则是全双工通道（服务端、客户端都可主动发消息，只保证消息的顺序及消息的触达情况，没法规定对消息必须有应答行为）。对于 HTTP，服务端无法主动发 Response，只有收到 Request，才能 Response。这个模式很好的满足了大部分应用的需要。

* Request
* Response

![image-20200511232119530](https://tva1.sinaimg.cn/large/007S8ZIlgy1geox933fspj31140bymyc.jpg)

![image-20200511232137781](https://tva1.sinaimg.cn/large/007S8ZIlgy1geox9efa39j30xk0jm40m.jpg)

chunk，单独一行表示后面有多少个字符

