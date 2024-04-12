## 01、http常见的状态码有哪些

- 1xx 表示消息
- 2xx 表示成功
- 3xx 表示重定向
- 4xx 表示客户端错误
- 5xx 表示服务器错误

### 常见的状态码

- 101

  > 升级协议，如从http升级到ws，此时需要反向代理支持
  >
- 200

  > 最喜欢见到的状态码，表示请求成功
  >
- 301

  > 永久重定向：搜索引擎在抓取新的内容的是同也会将旧的网址替换为重定向之后的网址
  >
- 302

  > 临时重定向：搜索引擎会抓取新的内容而保留旧的地址，因为服务器返回302，所以搜索引擎认为新的地址是暂时的
  >
- 303

  > 与302一样，只是它希望使用GET方法重定向到新的URL上
  >
- 304

  > 发送附带条件的请求时，条件不满足时返回，与重定向无关。例如：浏览器缓存中，服务器资源未改变，可直接使用客户端未过期的资源
  >
- 400

> 错误的请求：一般指的是 `4xx`其他状态码没有更合适的情况下使用，毕竟客户端出错类型很多，无法准确把情况都定义好

- 401

  > 未被授权，需要身份验证，例如 `token`信息等
  >
- 403

  > 请求被拒绝
  >
- 404

  > 资源缺失，接口不存在，或请求的文件不存在等等
  >
- 500

  > 服务器未知错误
  >
- 502

  > 网关错误
  >
- 503

  > 服务器暂时无法使用
  >
- 肯定会遇到：101/200/301/302/304/400/401/403/404/500/502

### 101 Switch Protocol

升级协议，如从 http 到 ws，此时需要反向代理支持，如 Nginx，在 Nginx 配置 websockt 如下:

```
location / {  proxy_http_version 1.1;  proxy_set_header Upgrade $http_upgrade;  proxy_set_header Connection  $connection_upgrade;}
```

示例:

![101](https://shanyue.tech/assets/img/101.071b734b.png)

### 200 Ok

表示资源请求成功，也是最常见到的状态码

示例:

```
$ curl https://shanyue.tech --headHTTP/2 200
```

### 201 Created

资源创建成功，多用于 POST 请求

### 204 No Content

响应不会返回 Body，一般由以下两种情况

1. 与 Options/Delete 请求搭配
2. 打点类

示例一: 掘金为 Options 请求的状态码设置为 204

![掘金为 Options 请求的状态码设置为 204](https://shanyue.tech/assets/img/204.5355a3b7.png)

示例二: 知乎为 Delete 请求的状态码设置为 204，以下请求为取消关注

![掘金为 Delete 请求的状态码设置为 204](https://shanyue.tech/assets/img/204-del.ee530dd7.png)

示例三: 当你在知乎看段子时，不妨打开控制台，会发现一个是 204 的状态码

```
curl 'https://www.zhihu.com/sc-profiler' \  -H 'content-type: application/json' \  --data-binary '[["i","production.heifetz.main.desktop.v1.Collector.screen.1536_960.count",1,1]]' \  --compressed -vvv< HTTP/2 204< server: CLOUD ELB 1.0.0< date: Thu, 22 Oct 2020 07:46:30 GMT< content-type: text/html< vary: Accept-Encoding< x-backend-response: 0.002< cache-control: no-cache, no-store, must-revalidate, private, max-age=0
```

### 206 Partial Content

当请求多媒体数据数据较大时，会进行分片传输。当你在B站观看视频，打开开发者工具，会发现许多 206 状态码以及响应头 Content-Range

示例:

![B站上的视频资源请求状态码为206](https://shanyue.tech/assets/img/206.94474e79.png)

### 301 Moved Permanently

永久重定向。http 转向 https时，有时会使用 301，如 B 站。

```
$ curl www.bilibili.com -vvv< HTTP/1.1 301 Moved Permanently< Server: Tengine< Date: Thu, 22 Oct 2020 08:04:59 GMT< Content-Type: text/html< Content-Length: 239< Connection: keep-alive< Location: https://www.bilibili.com/
```

### 302 Found

暂时重定向。http 转向 https时，有时也会使用 302，如知乎

```
$ curl www.zhihu.com -vvv< HTTP/1.1 302 Found< Location: https://www.zhihu.com/< Content-Length: 0< X-NWS-LOG-UUID: 16068764905156850032< Connection: keep-alive< Server: Lego Server< Date: Thu, 22 Oct 2020 08:20:29 GMT< X-Cache-Lookup: Return Directly
```

### 304 Not Modified

资源已被缓存，与之相关的响应头部有：

- `ETag`
- `last-modified`/`if-modified-since`

一般用作 `index.html` 等不带 hash 的资源，由于示例太多，这里就不举例了

### 307 Temporary Redirect

暂时重定向。也可作为 http 到 https 的重定向。还有一种用途用作 HSTS，当谷歌浏览器发现某 http 资源已被加入到 HSTS 列表，浏览器内部会通过 307 作重定向

示例:

![山月个人博客网站的 HSTS](https://shanyue.tech/assets/img/307-shanyue.5f2e9bb3.png)

![Stackoverflow 中的307](https://shanyue.tech/assets/img/307-stack.914347b0.png)

> [http 状态码中 301，302和307有什么区别(opens in a new tab)](https://github.com/shfshanyue/Daily-Question/issues/37)

- 301，Moved Permanently。永久重定向，该操作比较危险，需要谨慎操作：如果设置了301，但是一段时间后又想取消，但是浏览器中已经有了缓存，还是会重定向。
- 302，Found。临时重定向，但是会在重定向的时候改变 method: 把 POST 改成 GET，于是有了 307
- 307，Temporary Redirect。临时重定向，在重定向时不会改变 method

### 400 Bad Request

对于服务器无法理解的参数，将会使用 400 作为返回码

示例一: 当 Content-Type: JSON 时，服务器解析 JSON 却失败

```
HTTP/1.1 400 Bad RequestContent-Length: 35{"message":"Problems parsing JSON"}
```

### 401 Unauthorized

当没有权限的用户请求需要带有权限的资源时，会返回 401，此时携带正确的权限凭证再试一次可以解决问题

有时认证失败也会返回 401

示例一: 知乎登录时密码不正确

![知乎登录失败时](https://shanyue.tech/assets/img/401.bd2d099f.png)

示例二: Github中错误的凭证信息请求带权限资源

```
$ curl -i https://api.github.com -u foo:bar> HTTP/1.1 401 Unauthorized> {>   "message": "Bad credentials",>   "documentation_url": "https://developer.github.com/v3"> }
```

### 403 Forbidden

我就是不想让你访问，不管你的权限凭证是否正确！

> In summary, a 401 Unauthorized response should be used for missing or bad authentication, and a 403 Forbidden response should be used afterwards, when the user is authenticated but isn’t authorized to perform the requested operation on the given resource.

- [403与401状态码有什么区别(opens in a new tab)](https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses)

### 404 Not Found

未找到资源

### 405 Method Not Allowed

我需要 POST 这条资源，你去 GET 个锤子

### 413 Payload Too Large

不要给我扔这么大的 Body，我处理不过来

### 418 I'm A Teapot

我是一个茶壶

我要抛咖啡，你却扔给我一个茶壶？

也可以用来处理不合法的参数校验，我想要个字符串，你给了我一个整数？

### 422 Unprocessable Entity

常用来处理不合法的参数校验。

Github 上给某个项目点赞时，故意设置一个不正确的参数命名，会返回状态码 422

![422](https://shanyue.tech/assets/img/422.c4c88739.png)

### 429 Too Many Request

请求过多被限流。

超过某一个 API 的 Rate Limit 规则，会被限流，返回 429 状态码

示例: 在 Sentry 中异常上报过于频繁被限流

### 500 Internal Server Error

服务器内部错误，很有可能是应用层未捕获错误而导致整个服务挂掉

### 502 Bad Gateway

Nginx 上常见，从上游应用层未返回响应，上游应用层挂了

### 503 Service Unavailable

由于大量流量造成服务忙，稍等一下说不定就能用了

### 504 Gateway Timeout

网关超时，上游应用层迟迟未响应

## 2、http状态码中301，302和307有什么区别

- 301，永久重定向，该操作比较危险，需要谨慎操作：如果设置了301，但是一段时间后又想取消，但是浏览器中已经有了缓存，还是会重定向。
- 302，临时重定向，但是会在重定向的时候改变method：把POST改为GET，于是有了307
- 307，临时重定向，在重定向时不会改变method

## 03、http状态码502和504有什么区别

这两种异常状态都与网关Getway有关，首先明确两个概念

- Proxy（Getaway），反向代理层或者网关层，在公司级应用中一般使用Nginx扮演这个角色
- Application（upstream server）应用层服务，作为Proxy层的上游服务，在公司中一般为各种语言编写的服务应用，如Go/Java/Python/PHP/Node等

此时关于502与504的区别就很显而易见了

- `502 Bad Getaway`。一般表现为你自己写的应用层服务挂了，网关无法接收到相应
- `504 Bad Getaway`。一般表现为网关层服务（upstream）超时，如查库操作耗时十分钟，超过了Nginx配置的超时时间

## 04、简介http的缓存机制

http缓存分为以下两种，两者都是http响应头控制缓存

第一次请求：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/6/16a8bbc2df77f4f6~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=411&h=369&s=26885&e=png&a=1&b=eeeded) 第二次请求相同网页：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/6/16a8bbaefa56810f~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=554&h=528&s=103197&e=png&a=1&b=c8cfe3)

1. 强制缓存

   ##### 强缓存：浏览器不会像服务器发送任何请求，直接从本地缓存中读取文件并返回Status Code: 200 OK

   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/6/16a8bc0c7e54f6ec~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=317&h=112&s=9790&e=png&b=fbfbfb)

   ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/6/16a8bdbc4b9c8720~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp#?w=280&h=96&s=7498&e=png&b=fdfdfd)

   > 200 form memory cache : 不访问服务器，一般已经加载过该资源且缓存在了内存当中，直接从内存中读取缓存。浏览器关闭后，数据将不存在（资源被释放掉了），再次打开相同的页面时，不会出现from memory cache。

   > 200 from disk cache： 不访问服务器，已经在之前的某个时间加载过该资源，直接从硬盘中读取缓存，关闭浏览器后，数据依然存在，此资源不会随着该页面的关闭而释放掉下次打开仍然会是from disk cache。

   > 优先访问memory cache,其次是disk cache，最后是请求网络资源

   与之相关的response header有两个

   - `Expires`

     如果过期时间在当前时间之后，则直接都本地缓存

     这个头部也是丧心病狂：使用绝对时间，且有固定的格式 [https://tools.ietf.org/html/rfc822#section-5.1(opens in a new tab)](https://tools.ietf.org/html/rfc822#section-5.1)

     ```
     Expires: Mon, 25 Oct 2021 20:11:12 GMT
     ```

   - `Cache-Control`，具有强大的缓存控制能力，`Cache-Control`会覆盖掉`Expires`

     常用的有以下两个

     - `no-cache`，每次请求需要校验服务器资源的新鲜度（协商缓存）
     - `no-store`，不适用任何缓存，每次都直接读取最新。
     - `max-age=31536000`，浏览器在一年内都不需要向服务器请求资源（在失效时间之前都执行强制缓存）

2. 协商缓存

   Last-Modifed/If-Modified-Since和Etag/If-None-Match是分别成对出现的，呈一一对应关系

   **Etag/If-None-Match：**

   Etag：

   > Etag舒服http1.1属性，它由服务器生成返回给前端，用来帮助服务器控制web端的缓存验证。Apach中，Etag的值，默认是对文件的索引节（INode），大小（Size）和最后修改时间（MTime）进行Hash后得到的。

   If-None-Match：

   > 当资源过期时（Express过期/浏览器判断Cache-Control标识的max-age过期），浏览器发现响应头中带有，则再次请求服务器是请求头带上If-Node-Match（值是Etag）。服务器收到请求进行对比时，决定返回200或304

   **Last-Modified/If-Modified-Since**

   Last-Modified：

   > 服务器向浏览器发送最后的修改时间

   If-Modified-Since

   > 当资源过期时（Express过期/浏览器判断Cache-Control标识的max-age过期），浏览器发现响应头中带有Last-Modified，则再次请求时，请求头将带上If-Modified-Since（值是上一次响应头中），如果最后修改时间比If-Modified-Since大，说明资源被修改过，返回新的资源，HTTP200，否则304走缓存

   > Last-Modifed/If-Modified-Since的时间精度是秒，而Etag可以更精确。
   >
   > Etag优先级是高于Last-Modifed的，所以服务器会优先验证Etag
   >
   > Last-Modifed/If-Modified-Since是http1.0的头字段

## 05、http proxy的原理是什么

HTTP代理服务器会自动提取请求数据包的HTTP Request数据，并且把HTTP Response的数据转发给发送请求的客户端；HTTP代理服务器使用的端口通常是8080，如下图所示：

![img](https://lilywei739.github.io/img/20170125/20170125-1.jpg)

- 对于Web客户端来说，代理扮演的服务器角色，接收请求（Request），返回响应（Response）。
- 对于Web服务器来说，代理扮演的客户端角色，发送请求（Request），返回响应（Response）。

HTTP代理步骤

- 用户向代理发起TCP连接：
- 代理接收用户的连接，双方建立连接；
- 用户向代理发送HTTP请求，请求内容和没有HTTP代理的内容完全相同；
- 代理解析HTTP请求；
- 代理向服务器发起TCP连接；
- 服务器接收代理的连接；
- 代理向服务器发送HTTP请求（这个HTTP请求是基于用户的HTTP请求，可能会有修改）
- 服务器发送响应给代理；
- 代理相应给客户端  

HTTP代理功能上名称的区别：

- 全匿名代理，不改变客户端的request fields（请求信息），使服务器端看来就像有个真正的客户浏览器在访问。客户端的真实IP是隐藏起来的。
- 普通匿名代理，能隐藏客户端的真实IP，但会更改客户端的request fields（请求信息），服务器端有可能会被认为使用了代理。
- 透明代理（简单代理），改变客户端的request fields（请求信息），并会传送真实IP地址。

不同HTTP代理的区别：

- 全匿名代理，不改变客户端的request fields（请求信息），使服务器端看来就像有个真正的客户浏览器在访问。客户端的真实IP是隐藏起来的。
- 普通匿名代理，能隐藏客户端的真实IP，但会更改客户端的request fields（请求信息），服务器端有可能会被认为使用了代理。
- 透明代理（简单代理），改变客户端的request fields（请求信息），并会传送真实IP地址。

HTTPS代理

HTTPS代理有多种做法，通常使用`CONNECT method`，通过proxy建立一条隧道(隧道代理)，这样，`proxy无法解密数据`；此外，还有一种类似于中间人攻击的代理手法。

## 06、HTTP/2带来的加载优化

### 结论：

- 从HTTP/1.0到HTTP/2，都是利用TCP作为底层协议进行通信的。
- HTTP/1.1，引进了长连接(keep-alive)，减少了建立和关闭连接的消耗和延迟。
- HTTP/2，引入了多路复用：连接共享，提高了连接的利用率，降低延迟。

### http的基本优化：

影响一个http请求的主要因素有两个带宽和延迟

**带宽：**如果说我们还停留在拨号上网的阶段，带宽可能会成为一个比较严重影响请求的问题，但是现在网络基础建设已经使得带宽得到极大的提升，我们不再会担心由带宽而影响网速，那么就只剩下延迟了

- **浏览器阻塞（HOL blocking）**：浏览器会因为一些原因阻塞请求。浏览器对于同一个域名，同时只能有 4 ~6个连接（这个根据浏览器内核不同可能会有所差异），超过浏览器最大连接数限制，后续请求就会被阻塞
- **DNS 查询（DNS Lookup）**：浏览器需要知道目标服务器的 IP 才能建立连接。将域名解析为 IP 的这个系统就是 DNS。这个通常可以利用DNS缓存结果来达到减少这个时间的目的
- **建立连接（Initial connection）**：HTTP 是基于 TCP 协议的，浏览器最快也要在第三次握手时才能捎带 HTTP 请求报文，达到真正的建立连接，但是这些连接无法复用会导致每次请求都经历三次握手和慢启动。三次握手在高延迟的场景下影响较明显，慢启动则对文件类大请求影响较大

### HTTP1.0和HTTP1.1的一些区别

- **相应状态码：**HTTP/1.1 中新加入了大量的状态码

- **缓存处理：**在http1.0主要使用If-Modified-Since，Expires来做缓存判断标准，HTTP1.1则引入了更多的缓存控制策略例如：Etag，If-None-Match等更多可供选择的缓存头来控制缓存
- **连接方式**：HTTP1.0默认是用短链接，HTTP 1.1支持长连接（PersistentConnection）和请求的流水线（Pipelining）在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟，在HTTP1.1中默认开启Connection： keep-alive，一定程度上弥补了HTTP1.0每次请求都要创建连接的缺点
- **带宽优化及网络连接的使用:**HTTP1.0中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能，HTTP1.1则在请求头引入了**range头域**，它允许只请求资源的**某个部分**，即返回码是**206（Partial Content）**，这样就方便了开发者自由的选择以便于充分利用带宽和连接
- **Host头处理**，在HTTP1.0中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会报告一个错误（400 Bad Request）

### HTTP2.0和HTTP1.X相比的新特性

- **新的二进制格式（Binary Format）**,HTTP1.x的解析是基本文本。基于文本协议的格式解析存在天然缺陷，文本的表现形式有多样性，要做到健壮性考虑的场景必然很多，二进制则不同，只认0和1的组合。基于这种考虑HTTP2.0的协议解析决定采用二进制格式，实现方便且健壮。
- **多路复用（MultiPlexing）**，即连接共享，即每一个request都是是用作连接共享机制的。一个request对应一个id，这样一个连接上可以有多个request，每个连接的request可以随机的混杂在一起，接收方可以根据request的 id将request再归属到各自不同的服务端请求里面。
- **header压缩**，如上文中所言，对前面提到过HTTP1.x的header带有大量信息，而且每次都要重复发送，HTTP2.0使用encoder来减少需要传输的header大小，通讯双方各自cache一份header fields表，既避免了重复header的传输，又减小了需要传输的大小。
- **服务端推送（server push）**，同SPDY一样，HTTP2.0也具有server push功能。

### HTTP2.0的多路复用

多路复用代替原来的序列和阻塞机制，所有就是请求的都是通过一个 TCP 连接并发完成。同时也很好的解决了浏览器限制同一个域名下的请求数量的问题。

在 HTTP/2 中，有了二进制分帧之后，HTTP/2 不再依赖 TCP 链接去实现多流并行了，在 HTTP/2 中：

- **同域名下所有通信都在单个连接上完成，同个域名只需要占用一个 TCP 连接，使用一个连接并行发送多个请求和响应**。
- **单个连接可以承载任意数量的双向数据流，单个连接上可以并行交错的请求和响应，之间互不干扰**。
- **数据流以消息的形式发送，而消息又由一个或多个帧组成，多个帧之间可以乱序发送，因为根据帧首部的流标识可以重新组装。每个请求都可以带一个 31bit 的优先值，0 表示最高优先级， 数值越大优先级越低**。

#### 帧（frame）和流（stream）

------

在 HTTP/2 中，有两个非常重要的概念：帧（frame）和流（stream）。

#### 帧（frame）

HTTP/2 中**数据传输的最小单位**，因此帧不仅要细分表达 HTTP/1.x 中的各个部份，也优化了 HTTP/1.x 表达得不好的地方，同时还增加了 HTTP/1.x 表达不了的方式。 每一帧都包含几个字段，有**length、type、flags、stream identifier、frame playload**等，其中type 代表帧的类型，在 HTTP/2 的标准中定义了 10 种不同的类型，包括上面所说的 HEADERS frame 和 DATA frame。此外还有： `PRIORITY`（设置流的优先级） `RST_STREAM`（终止流） `SETTINGS`（设置此连接的参数） `PUSH_PROMISE`（服务器推送） `PING`（测量 RTT） `GOAWAY`（终止连接） `WINDOW_UPDATE`（流量控制） `CONTINUATION`（继续传输头部数据）

在 HTTP 2.0 中，它把数据报的两大部分分成了 header frame 和 data frame。也就是头部帧和数据体帧。

#### 流（stream）

流： 存在于连接中的一个虚拟通道。流可以承载双向消息，每个流都有一个唯一的整数 ID。 HTTP/2 长连接中的数据包是不按请求-响应顺序发送的，一个完整的请求或响应(称一个数据流 stream，每个数据流都有一个独一无二的编号)可能会分成非连续多次发送。它具有如下几个特点：

- **双向性：同一个流内，可同时发送和接受数据**。
- **有序性：流中被传输的数据就是二进制帧 。帧在流上的被发送与被接收都是按照顺序进行的**。
- **并行性：流中的 二进制帧 都是被并行传输的，无需按顺序等待**。
- **流的创建：流可以被客户端或服务器单方面建立, 使用或共享**。
- **流的关闭：流也可以被任意一方关闭**。
- **HEADERS 帧在 DATA 帧前面**。
- **流的 ID 都是奇数，说明是由客户端发起的，这是标准规定的，那么服务端发起的就是偶数了**。

#### 发展历程

------

从 Http/0.9 到 Http/2 要发送多个请求，从**多个 Tcp 连接=>keep-alive=>管道化=>多路复用**不断的减少多次创建 Tcp 等等带来的性能损耗。

#### 多个 Tcp 连接

在最早的时候没有`keep-alive`只能创建多个`Tcp`连接来做多次请求。多次 http 请求效果如下图所示：



![http2.0](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/5/16cff87b23f02791~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)



一次请求完成就会关闭本次的 Tcp 连接，下个请求又要从新建立 Tcp 连接传输完成数据再关闭，造成很大的性能损耗。

#### Keep-Alive

`Keep-Alive`解决的核心问题是： 一定时间内，同一域名多次请求数据，只建立一次 HTTP 请求，其他请求可复用每一次建立的连接通道，以达到提高请求效率的问题。这里面所说的一定时间是**可以配置**的，不管你用的是`Apache`还是`nginx`。 以往，浏览器判断响应数据是否接收完毕，是看连接是否关闭。在使用持久连接后，就不能这样了，这就要求服务器对持久连接的响应头部一定要返回`content-length`标识`body的`长度，供浏览器判断界限。有时，`content-length`的方法并不是太准确，也可以使用 `Transfer-Encoding: chunked` 头部发送一串一串的数据，最后由长度为 0 的`chunked`标识结束。 多次 http 请求效果如下图所示：



![http2.0](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/5/16cff86d8df7b4d8~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)



上图：设置 Connection:Keep-Alive，保持连接在一段时间内不断开。

`Keep-Alive`还是存在如下问题：

- 串行的文件传输。
- 同域并行请求限制带来的阻塞（6~8）个

#### 管线化

HTTP 管线化可以克服同域并行请求限制带来的阻塞，它是建立在**持久连接**之上，是把所有请求一并发给服务器，但是服务器需要按照**顺序一个一个响应**，而不是等到一个响应回来才能发下一个请求，这样就节省了很多请求到服务器的时间。不过，HTTP 管线化**仍旧**有阻塞的问题，若上一响应迟迟不回，**后面的响应**都会被阻塞到。



![http2.0](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/5/16cff88261c5b7b3~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)



上图：HTTPpipelining：建立多个连接

#### 多路复用

多路复用代替原来的序列和阻塞机制。所有就是请求的都是通过一个 TCP 连接并发完成。因为在多路复用之前所有的传输是基于基础文本的，在多路复用中是基于二进制数据帧的传输、消息、流，所以可以做到乱序的传输。多路复用对同一域名下所有请求都是基于流，所以不存在同域并行的阻塞。多次请求如下图：



![http2.0](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/5/16cff873bf2ec175~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)



上图：多路复用

#### 总结

**在 HTTP/2 中，有两个非常重要的概念，分别是帧（frame）和流（stream）**。

**帧代表着最小的数据单位，每个帧会标识出该帧属于哪个流，流也就是多个帧组成的数据流**。

**HTTP2 采用二进制数据帧传输，取代了 HTTP1.x 的文本格式，二进制格式解析更高效**。

多路复用代替了 HTTP1.x 的**序列和阻塞机制**，所有的相同域名请求都通过**同一个 TCP 连接并发**完成。**同一 Tcp 中可以发送多个请求，对端可以通过帧中的标识知道属于哪个请求。通过这个技术，可以避免 HTTP 旧版本中的队头阻塞问题，极大的提高传输性能**。

#### 参考

> [多路复用](https://link.juejin.cn/?target=https%3A%2F%2Fwww.kancloud.cn%2Fdigest%2Fweb-performance-http2%2F74825)

> [一文读懂 HTTP/2 及 HTTP/3 特性](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000018401534)

> [一文读懂 HTTP/2 特性](https://link.juejin.cn/?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F26559480)

> [浅析 HTTP/2 的多路复用](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000011172823)

## 07、http 1.1 中的 keep-alive 有什么作用

在 `http 1.1` 中，在响应头中设置 `keep-alive` 可以在一个 TCP 连接上发送多个 http 请求

1. 避免了重开 TCP 连接的开销
2. 避免了刷新时重新建立 SSL 连接的开销
3. 避免了QPS过大时，服务器的连接数过大

在服务器端使用响应头开启 `keep-alive`

```
Connection: Keep-AliveKeep-Alive: timeout=5, max=1000
```

## 08、什么是队首阻塞，如何解决，原理如何

队首阻塞包含http应用层协议上的队首阻塞和tcp传输层的队首阻塞

1. http应用层协议上的队首阻塞: 以http1.1为例，一个tcp连接一次只能处理一个请求，如果接受端处理慢的话，后面的请求就得排队，这是导致队首阻塞的根本原因 虽然http1.1提出了管线技术，支持同时发起多个请求出去，但是又限制了接收端返回必须得按照顺序，所以这项技术也未能解决队首阻塞。

http2.0 提出了 frame 和 stream的概念， 把请求数据分成了不同的二进制frame，有strameid标识，包装进不同的stream通过同一个tcp管道进行并发的多路复用传输， 接收端根据streamid来进行组装，解决了队首阻塞的问题。

但是依然没有解决tcp传输层的队首阻塞，如果过程中一个包丢了，需要重传，就需要后面的包等待了

### 09、简述你们前端项目中资源的缓存配置策略

1. html设置协商缓存
2. 静态资源 hash + 强缓存

## 10、no-cache 与 no-store 的区别是什么

no-cache 可以在本地缓存，可以在代理服务器缓存，但是这个缓存要服务器验证才可以使用 no-store 是禁用缓冲，本地和代理服务器都不缓冲，每次都从服务器获取

> Author 回答者: [shfshanyue(opens in a new tab)](https://github.com/shfshanyue)

`no-cache` 和 `no-store` 用作控制缓存，被服务器通过响应头 `Cache-Control` 传递给客户端

### `no-store`

**永远都不要在客户端存储资源**，每次永远都要从原始服务器获取资源

### `no-cache`

可以在客户端存储资源，但每次都**必须去服务器做新鲜度校验**，来决定从服务器获取最新资源 (200) 还是从客户端读取缓存 (304)，即所谓的协商缓存

> [当服务器资源返回 304 时与那些 HTTP 响应头有关(opens in a new tab)](https://github.com/shfshanyue/Daily-Question/issues/441)

一般情况下对于 `index.html` 或者现代构建环境下不加 hash 的静态资源都需要设置 `Cache-Control: no-cache`，用来强制每次在服务器端的新鲜度校验。

相当于以下响应头

```
Cache-Control: max-age=0, must-revalidate
```

## 11、什么是 Basic Auth 和 Digest Auth

### Basic Auth

使用Base64编码的用户名和密码，将其放置在HTTP请求头中进行身份验证

### Digest Auth

使用摘要（Digest）算法，将密码使用算法加密后放在HTTP请求头中进行身份验证；

比较流行的还是Token-based Auth。 Token-based Auth：使用令牌（Token），客户端在登录成功后获取令牌，之后的请求中将令牌包含在请求头中进行身份验证。

## 12、gzip的原理是什么，如何配置

一句话：`gzip` 的核心是 `Deflate`，而它使用了 `LZ77` 算法与 `Huffman` 编码来压缩文件，重复度越高的文件可压缩的空间就越大。

因此 `gzip` 用于 HTTP 文件传输中，比如 JS、CSS 等，**但一般不会压缩图片**。在 HTTP Response 报文中，用 `Content-Encoding` 指明使用 gzip 压缩，而以下响应头在大部分生产环境的响应报文中都可以看到！比如你现在立刻马上可以打开[我的网站(opens in a new tab)](https://q.shanyue.tech/)或者[百度(opens in a new tab)](https://www.baidu.com/)试一试。

```
# Request HeaderAccept-Encoding: gzip, deflate, br # Reponse HeaderContent-Encoding: gzip
```

`gzip` 一般在反向代理那一层，如 `nginx` 进行处理，直接使用 C 语言编写，具有更好的性能。

在 `nginx` 开启 `gzip`: 配置可参考 [gzip module(opens in a new tab)](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)

```
gzip on;
```

### LZ77

### Huffman

### 相关阅读

- [gzip原理与实现](https://blog.csdn.net/imquestion/article/details/16439)

## 13、可以对图片开启 gzip 压缩吗，为什么

不需要开启，如果开启的话，有可能使图片变的更大。如果你注意一些网站的 img 资源时，就会发现他们都没有开启 `gzip`

## 14、http 的请求报文与响应报文的格式是什么
