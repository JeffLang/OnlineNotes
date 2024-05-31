## 01、实现懒加载

懒加载，顾名思义，在当前网页，滑动页面能看到图片的时候再加载图片

故问题拆分成两个：

1. 如何判断图片出现在了当前视口（即如何判断我们能够看到图片）
2. 如何控制图片的加载

### 方案一：位置计算+滚动事件+DataSet API

#### 如何判断图片出现在了当前视口

`clientTop`，`offsetTop`，`clientHeight` 以及 `scrollTop` 各种关于图片的高度作比对

这些高度都代表了什么意思？

这我以前有可能是知道的，那时候我比较单纯，喜欢死磕。我现在想通了，背不过的东西就不要背了

**所以它有一个问题：复杂琐碎不好理解！**

仅仅知道它静态的高度还不够，我们还需要知道动态的

**如何动态？监听 `window.scroll` 事件**

#### 如何控制图片的加载

```
<img data-src="shanyue.jpg" />
```

首先设置一个临时 Data 属性 `data-src`，控制加载时使用 `src` 代替 `data-src`，可利用 DataSet API 实现

```
img.src = img.datset.src
```

### 方案二: getBoundingClientRect API + Scroll with Throttle + DataSet API

#### 如何判断图片出现在了当前视口

![img](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect/element-box-diagram.png)

那如何判断图片出现在了当前视口呢，根据示例图示意，代码如下，这个就比较好理解了，就可以很容易地背会(就可以愉快地去面试了)。

```
// clientHeight 代表当前视口的高度
img.getBoundingClientRect().top < document.documentElement.clientHeight;
```

**监听 `window.scroll` 事件也优化一下**

加个节流器，提高性能。工作中一般使用 `lodash.throttle` 就可以了，万能的 `lodash` 啊！

```
_.throttle(func, [(wait = 0)], [(options = {})]);
```

参考 [什么是防抖和节流，他们的应用场景有哪些(opens in a new tab)](https://github.com/shfshanyue/Daily-Question/issues/3)，或者[前端面试题](https://q.shanyue.tech/fe/js/3.html)

### 方案三: IntersectionObserver API + DataSet API

#### 如何判断图片出现在了当前视口

**方案二使用的方法是: `window.scroll` 监听 `Element.getBoundingClientRect()` 并使用 `_.throttle` 节流**

**一系列组合动作太复杂了，于是浏览器出了一个三合一事件: `IntersectionObserver` API，一个能够监听元素是否到了当前视口的事件，一步到位！**

事件回调的参数是 [IntersectionObserverEntry(opens in a new tab)](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 的集合，代表关于是否在可见视口的一系列值

其中，`entry.isIntersecting` 代表目标元素可见

```javascript
const observer = new IntersectionObserver((changes) => {
  // changes: 目标元素集合
  changes.forEach((change) => {
    // intersectionRatio
    if (change.isIntersecting) {
      const img = change.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});
// 监听，如果是list,则遍历后再监听
observer.observe(img);
```

**当然，`IntersectionObserver` 除了给图片做懒加载外，还可以对单页应用资源做预加载。**

如在 `next.js v9` 中，会对视口内的资源做预加载，可以参考 [next 9 production optimizations(opens in a new tab)](https://nextjs.org/blog/next-9#production-optimizations)

```
<Link href="/about">  <a>关于山月</a></Link>
```

### 方案四: LazyLoading属性

浏览器觉得懒加载这事可以交给自己做，你们开发者加个属性就好了。实在是...！

```
<img src="shanyue.jpg" loading="lazy" />
```

不过目前浏览器兼容性不太好，关于 `loading` 属性的文章也可以查看 [Native image lazy-loading for the web!](https://addyosmani.com/blog/lazy-loading/)

## 02、如何设置一个cookie

HTTP Cookie（也叫Web Cookie或浏览器Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。Cookie使基于无状态的HTTP协议记录稳定的状态信息成为了可能。

服务端是通过setCookie的响应头来设置cookie的，要设置多个cookie时，得多写几个setCookie。服务器如果希望在浏览器保存 Cookie，就要在 HTTP 回应的头信息里面，放置一个Set-Cookie字段。

前端使用document.cookie属性来读写当前网页的 Cookie。写入的时候，Cookie 的值必须写成key=value的形式。

Cookie曾一度用于客户端数据的存储，因当时并没有其它合适的存储办法而作为唯一的存储手段，但现在随着现代浏览器开始支持各种各样的存储方式，Cookie渐渐被淘汰。由于服务器指定Cookie后，浏览器的每次请求都会携带Cookie数据，会带来额外的性能开销（尤其是在移动环境下）。新的浏览器API已经允许开发者直接将数据存储到本地，如使用 Web storage API （本地存储和会话存储）或 IndexedDB 。 参考资料： [MDN(opens in a new tab)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies) [把cookie聊清楚(opens in a new tab)](https://juejin.im/post/59d1f59bf265da06700b0934) [阮一峰JavaScript教程(opens in a new tab)](https://javascript.ruanyifeng.com/bom/cookie.html)

> Author 回答者: [shfshanyue(opens in a new tab)](https://github.com/shfshanyue)

```javascript
// 旧方式
document.cookie = "a=3"; 
// 也可以使用新的 API
cookieStore.set("a", 3);
```

## 03、如何删除一个 cookie

通过把该 `cookie` 的过期时间改为过去时即可删除成功，具体操作的话可以通过操作两个字段来完成

1. `max-age`: 将要过期的最大秒数，设置为 `-1` 即可删除
2. `expires`: 将要过期的绝对时间，存储到 `cookies` 中需要通过 `date.toUTCString()` 处理，设置为过期时间即可删除

很明显，`max-age` 更为简单，以下代码可在命令行控制台中进行测试

```javascript
// max-age 设置为 -1 即可成功
document.cookie = "a=3; max-age=-1";
```

```javascript
> document.cookie
< ""
 
> document.cookie = 'a=3'
< "a=3"
 
> document.cookie
< "a=3"
 
// 把该字段的 max-age 设置为 -1
> document.cookie = 'a=3; max-age=-1'
< "a=3; max-age=-1"
 
// 删除成功
> document.cookie
< ""
```

同时，也可以使用最新关于 cookie 操作的 API: [CookieStore API(opens in a new tab)](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore) 其中的 `cookieStore.delete(name)` 删除某个 `cookie`

## 04、如何判断当前环境是移动端还是PC端

判断 `navigator.userAgent`，对于 Android/iPhone 可以匹配以下正则

```javascript
const appleIphone = /iPhone/i;
const appleIpod = /iPod/i;
const appleTablet = /iPad/i;
const androidPhone = /\bAndroid(?:.+)Mobile\b/i; // Match 'Android' AND 'Mobile'
const androidTablet = /Android/i;
```

当然，不要重复造轮子，推荐一个库: [https://github.com/kaimallea/isMobile(opens in a new tab)](https://github.com/kaimallea/isMobile)

```javascript
import isMobile from "ismobilejs";

const mobile = isMobile();
```

## 05、input 中监听值的变化是在监听什么事件

可以**实时**监听值的变化的事件有以下几种

- keypress
- keydown
- keyup
- input

注: `onChange` 无法做到实时监听，因为 onChange 需要失去焦点才能触发

## 06、什么是跨域，如何解决跨域问题

### 跨域

**协议**，**域名**，**端口**，三者有一不一样，就是跨域

案例一：`www.baidu.com` 与 `zhidao.baidu.com` 是跨域

### 如何解决跨域

目前有两种最常见的解决方案：

1. CORS，在服务器端设置几个响应头，如 `Access-Control-Allow-Origin: *`
2. Reverse Proxy，在 nginx/traefik/haproxy 等反向代理服务器中设置为同一域名
3. JSONP，详解见 [JSONP 的原理是什么，如何实现(opens in a new tab)](https://github.com/shfshanyue/Daily-Question/issues/447)

附代码: nginx 关于跨域的配置

```javascript
server {
  listen 80;
  server_name shanyue.tech;
  location / {
    # 避免非root路径404
    try_files $uri $uri/ /index.html;
  }
  # 解决跨域
  location /api {
    # 或者是 http://localhost:8080
    proxy_pass http://api.shanyue.tech;
  }
}
```

## 07、CSP 是干什么用的了

`CSP` **只允许加载指定的脚本样式及媒体**，**最大限度地防止 `XSS` 攻击**，是解决 XSS 的最优解。CSP 的设置根据加载页面时 http 的响应头 `Content Security Policy` 在服务器端控制。

1. 外部脚本可以通过指定域名来限制：**`Content-Security-Policy: script-src 'self'`**，`self` 代表只加载当前域名
2. 如果网站必须加载内联脚本 (inline script) ，则可以提供一个 `nonce` 才能执行脚本，攻击者则无法注入脚本进行攻击。**`Content-Security-Policy: script-src 'nonce-xxxxxxxxxxxxxxxxxx'`**

### Content Security Policy (CSP)

**介绍：**

1. 解决 `XSS` 最优办法
2. 可以设置信任域名才可以访问 `script` / `audio` / `video` / `image` ...

**防止 XSS 例子：** 攻击者通过 恶意脚本(假设有执行外部脚本) 注入到系统内，显示给访问用户，以此来获取用户信息 我们可以通过 `CSP` 来设置信任域名才可以执行 `.js` 脚本。

**如何设置：**

1. `HTTP` 请求头
2. `Meta` 标签

MDN：[https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP(opens in a new tab)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)

兼容性：IE >= 10

## 08、prefetch 与 preload 的区别是什么

```html
<link rel="prefetch" href="style.css" as="style" />
<link rel="preload" href="main.js" as="script" />
```

1. `preload` 加载当前路由必需资源，优先级高。一般对于 Bundle Spliting 资源与 Code Spliting 资源做 preload
2. `prefetch` 优先级低，在浏览器 idle 状态时加载资源。一般用以加载其它路由资源，如当页面出现 Link，可 prefetch 当前 Link 的路由资源。（next.js 默认会对 link 做懒加载+prefetch，即当某条 Link 出现页面中，即自动 prefetch 该 Link 指向的路由资源

> prefetch - Prefetch the page in the background. Defaults to true. Any that is in the viewport (initially or through scroll) will be preloaded.

更多信息可参考以下链接：

- [用 preload 预加载页面资源(opens in a new tab)](https://juejin.im/post/5a7fb09bf265da4e8e785c38)
- [Using Preload and Prefetch in Your HTML to Load Assets(opens in a new tab)](https://alligator.io/html/preload-prefetch/)

## 09、fetch 中 credentials 指什么意思，可以取什么值

```
credentials` 指在使用 `fetch` 发送请求时是否应当发送 `cookie
```

- `omit`: 从不发送 `cookie`.
- `same-origin`: 同源时发送 `cookie` (浏览器默认值)
- `include`: 同源与跨域时都发送 `cookie`

> Author 回答者: [shen076(opens in a new tab)](https://github.com/shen076)

标题单词拼错了

## 10、当 cookie 没有设置 maxage 时，cookie 会存在多久

不设置max-age和expires，此cookie就是会话级别的，浏览器关闭就没了

## 11、在浏览器中如何获取剪切板中内容

### 一、navigator.clipboard 对象

#### 1. `navigator.clipboard` 方法汇总

| 方法                  | 用途                              |
| --------------------- | --------------------------------- |
| Clipboard.readText()  | 复制剪贴板里的文本数据            |
| Clipboard.read()      | 复制剪贴板里的文本数据/二进制数据 |
| Clipboard.writeText() | 将文本内容写入剪贴板              |
| Clipboard.write()     | 将文本数据/二进制数据写入剪贴板   |

#### 2. 代码示例

##### 方法 1: `Clipboard.writeText()`, 用于将文本内容写入剪贴板；

```js
document.body.addEventListener("click", async (e) => {
  await navigator.clipboard.writeText("Yo");
});
```

##### 方法 2: `Clipboard.write()`, 用于将文本数据/二进制数据写入剪贴板

`Clipboard.write()`不仅在剪贴板可写入普通text，还可以写入图片数据（Chrome浏览器仅支持png格式）。

```js
async function copy() {
  const image = await fetch("kitten.png");
  const text = new Blob(["Cute sleeping kitten"], { type: "text/plain" });
  const item = new ClipboardItem({
    "text/plain": text,
    "image/png": image,
  });
  await navigator.clipboard.write([item]);
}
```

此方法只支持png格式的图片

```javascript
// 获取图片元素或者图片的 URL
var imageUrl = 'https://example.com/image.jpg';

// 创建一个新的 img 元素
var img = new Image();
img.src = imageUrl;

img.crossorigin = 'anonymous'

// 等待图片加载完成
img.onload = function() {
  // 创建一个新的 canvas 元素
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  // 设置 canvas 大小和图片大小一致
  canvas.width = img.width;
  canvas.height = img.height;

  // 在 canvas 上绘制图片
  context.drawImage(img, 0, 0);

  // 将图片转换为 Blob 对象，格式为 image/png
  canvas.toBlob(function(blob) {
    // 将图片复制到剪贴板
    var item = new ClipboardItem({ 'image/png': blob });
    navigator.clipboard.write([item]).then(function() {
      console.log('图片已复制到剪贴板');
    }, function(err) {
      console.error('复制图片失败:', err);
    });
  }, 'image/png');
};

```

#### 3. 优缺点

##### ① 优点

> - 所有操作都是异步的，返回 `Promise` 对象，不会造成页面卡顿;
> - 无需提前选中内容，可以将任意内容（比如图片）放入剪贴板；

##### ② 缺点: 允许脚本任意读取会产生安全风险，安全限制较多。

> - Chrome 浏览器规定，只有 `HTTPS` 协议的页面才能使用这个 API;
> - 调用时需要明确获得用户的许可。

### 二、document.execCommand() 方法

#### 1. `document.execCommand()` 方法汇总

| 方法                          | 用途 |
| ----------------------------- | ---- |
| document.execCommand('copy')  | 复制 |
| document.execCommand('cut')   | 剪切 |
| document.execCommand('paste') | 粘贴 |

#### 2. 代码示例

##### `document.execCommand('copy')`，用于将已选中的文本内容写入剪贴板。

结合 `window.getSelection()`方法实现一键复制功能：

```js
const TestCopyBox = () => {
  const onClick = async () => {
    const divElement = document.getElementById("select-div");

    if (!divElement || !window.getSelection) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    range.selectNodeContents(divElement);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");

    // 取消选中区域
    selection.empty();
  };
  return <div>
    <button onClick={onClick}>copy</button>
  <div id="select-div"> <input /> <span>test2: 3</span><span>test3: 94</span></div>
  </div>
};
```

#### 3.selection

```javascript
const selection = window.getSelection();
const range = document.createRange();
range.selectNodeContents(divElement);
selection.removeAllRanges();
selection.addRange(range);
```

```javascript
document.getSelection().selectAllChildren(document.getElementById('box'))
```

#### 4. 优缺点

##### ①  优点

> - 使用方便;
> - 各种浏览器都支持；

##### ② 缺点

> - 只能将选中的内容复制到剪贴板;
> - 同步操作，如果复制/粘贴大量数据，页面会出现卡顿。

## 12、简单介绍 requestIdleCallback 及使用场景

`requestIdleCallback` 维护一个队列，将在浏览器空闲时间内执行。它属于 [Background Tasks API(opens in a new tab)](https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API)，你可以使用 `setTimeout` 来模拟实现

```javascript
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (handler) {
  let startTime = Date.now();

  return setTimeout(function () {
    handler({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50.0 - (Date.now() - startTime));
      },
    });
  }, 1);
};
```

以上实现过于复杂以及细节化，也可以像 [swr(opens in a new tab)](https://github.com/vercel/swr) 一样做一个简单的模拟实现，以下代码见 [https://github.com/vercel/swr/blob/8670be8072b0c223bc1c040deccd2e69e8978aad/src/use-swr.ts#L33(opens in a new tab)](https://github.com/vercel/swr/blob/8670be8072b0c223bc1c040deccd2e69e8978aad/src/use-swr.ts#L33)

```javascript
const rIC = window["requestIdleCallback"] || ((f) => setTimeout(f, 1));
```

在 `rIC` 中执行任务时需要注意以下几点：

1. 执行重计算而非紧急任务
2. 空闲回调执行时间应该小于 50ms，最好更少
3. 空闲回调中不要操作 DOM，因为它本来就是利用的重排重绘后的间隙空闲时间，重新操作 DOM 又会造成重排重绘

React 的时间分片便是基于类似 `rIC` 而实现，然而因为 `rIC` 的兼容性及 50ms 流畅问题，React 自制了一个实现: [scheduler(opens in a new tab)](https://github.com/facebook/react/tree/master/packages/scheduler)

[use-swr(opens in a new tab)](https://github.com/vercel/swr) 中进行资源的 `revalidate` 时，也是通过 `rIC` 来提高性能

### 参考

**强烈推荐 MDN 与 w3c 上的两篇介绍**

- [Background Tasks API - MDN(opens in a new tab)](https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API)
- [requestIdleCallback - W3C](https://w3c.github.io/requestidlecallback/#idle-periods)

## 13、如何找到当前页面出现次数最多的HTML标签

这是一道前端基础与编程功底具备的面试题：

- 如果你前端基础强会了解 `document.querySelectorAll(*)` 能够列出页面内所有标签
- 如果你编程能力强能够用**递归**/**正则**快速实现同等的效果

有三种 API 可以列出页面所有标签：

1. `document.querySelectorAll('*')`，标准规范实现
2. `$$('*')`，devtools 实现
3. `document.all`，非标准规范实现

使用 `document.querySelectorAll` 实现如下

```javascript
function getMostTag() {
  // 获取全部的标签
  // 将出现的tag的次数做成键值对的形式key为标签名称,value为出现的次数
  const tags = [...document.querySelectorAll('*')]
  .map(x => x.tagName)
  .reduce((prev, now) => {
    prev[now] = prev[now] ? prev[now] + 1 : 1
    return prev
  }, {})
  // 然后遍历所有的标签,找出最大的数量
  return Object.entries(tags).reduce((prev, now) => {
    return now[1] > prev[1] ? now : prev
  })
}
```

使用 `element.children` 递归迭代如下 (最终结果多一个 document)

```javascript
function getAllTags(el = document) {
  const children = Array.from(el.children).reduce(
    (x, y) => [...x, y.tagName, ...getAllTags(y)],
    [],
  );
  return children;
}

// 或者通过 flatMap 实现
function getAllTags(el = document) {
  const children = Array.prototype.flatMap.call(el.children, (x) =>
                                                getAllTags(x),
                                               );
  return [el, ...children];
}
```

使用 `document.querySelectorAll`实现如下（包括可能次数一样多的标签）

```javascript
function getMostFrequentTag() {
  const counter = {};

  document.querySelectorAll("*").forEach((element) => {
    counter[element.tagName] = counter[element.tagName]
      ? counter[element.tagName] + 1
    : 1;
  });

  const orderedTags = Object.entries(counter).sort((tag1, tag2) => {
    if (tag1[1] < tag2[1]) {
      return 1;
    }
    if (tag1[1] > tag2[1]) {
      return -1;
    }
    return 0;
  });

  const result = [];
  for (const tag of orderedTags) {
    if (tag[1] < orderedTags[0][1]) {
      break;
    }
    result.push(tag[0]);
  }
  return result;
}
```

## 14、什么是层叠上下文 (stacking context)

> 我们假定用户正面向（浏览器）视窗或网页，而 HTML 元素沿着其相对于用户的一条虚构的 z 轴排开，层叠上下文就是对这些 HTML 元素的一个三维构想。众 HTML 元素基于其元素属性按照优先级顺序占据这个空间。

其中，`z-index` 会影响这个层级的优先性

## 15、如何把 DOM 转化为图片

1. [html2canvas(opens in a new tab)](https://html2canvas.hertzen.com/): Screenshots with JavaScript
2. [dom-to-image(opens in a new tab)](https://github.com/tsayen/dom-to-image): Generates an image from a DOM node using HTML5 canvas

## 16、浏览器的剪切板中如何监听复制事件

在HTML元素上

```html
<input oncopy="cb" />
```

在JS中获取具体元素

```javascript
document.querySelector("p").oncopy = cb;document.oncopy = cb;
```

或者

```javascript
document.querySelector("p").addEventListener("copy", cb);
document.addEventListener("copy", cb);
```

## 17、JSONP 的原理是什么，如何实现

利用script标签不受同源策略影响

## 18、如何实现页面文本不可复制

有 CSS 和 JS 两种方法，以下任选其一或结合使用

使用 CSS 如下：

```css
user-select: none;
```

或使用 JS 如下，监听 `selectstart` 事件，禁止选中。

当用户选中一片区域时，将触发 `selectstart` 事件，Selection API 将会选中一片区域。禁止选中区域即可实现页面文本不可复制。

```javascript
document.body.onselectstart = (e) => {
  e.preventDefault();
};
 
document.body.oncopy = (e) => {
  e.preventDefault();
};
```

## 19、异步加载 JS 脚本时，async 与 defer 有何区别

> 以下图片取自 whatwg 的规范，可以说是最权威的图文解释了，详细参考[原文(opens in a new tab)](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element)

![async 与 defer 区别](https://html.spec.whatwg.org/images/asyncdefer.svg)

在*正常情况下*，即 `<script>` 没有任何额外属性标记的情况下，有几点共识

1. JS 的脚本分为**加载、解析、执行**几个步骤，简单对应到图中就是 `fetch` (加载) 和 `execution` (解析并执行)
2. **JS 的脚本加载(fetch)且执行(execution)会阻塞 DOM 的渲染**，因此 JS 一般放到最后头

而 `defer` 与 `async` 的区别如下:

- 相同点: **异步加载 (fetch)**
- 不同点:
  - async 加载(fetch)完成后立即执行 (execution)，因此可能会阻塞 DOM 解析；
  - defer 加载(fetch)完成后延迟到 DOM 解析完成后才会执行(execution)**，但会在事件 `DomContentLoaded` 之前

### 拓展

当以下 `index.js` 加载时，属性是 `async` 与 `defer` 时，输出有何不同？

**index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title></title>
  </head>
  <body>
    <script src="./defer.js" defer></script>
    <script src="./async.js" async></script>
    <script>
      console.log("Start");
      document.addEventListener("DOMContentLoaded", () => {
        console.log("DCL");
      });
    </script>
  </body>
</html>
```

**derfer.js**

```javascript
console.log("Defer Script");
```

**async.js**

```javascript
console.log("Async Script");
```

答：defer 总是在 DCL 之前输出，但是 async 有可能之前也有可能之后

## 20、load 事件与 DomContentLoaded 事件的先后顺序

当初始的 `HTML` 文档被完全加载和解析完成之后，`DOMContentLoaded` 事件被触发，而无需等待样式表、图像和子框架的完全加载.

当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发 `load`事件

## 21、React/Vue 中的 router 实现原理如何

前端路由实现的本质是**监听url变化**，实现方式有两种：Hash模式和History模式，无需刷新页面就能重新加载相应的页面。 Hash url的格式为 `www.a.com/#/`，当#后的哈希值发生变化时，通过hashchange事件监听，然后页面跳转。 History url通过 `history.pushState`和 `history.replaceState`改变url。 两种模式的区别：

- hash只能改变#后的值，而history模式可以随意设置同源url；
- hash只能添加字符串类的数据，而history可以通过API添加多种类型的数据；
- hash的历史记录只显示之前的 `www.a.com`而不会显示hash值，而history的每条记录都会进入到历史记录；
- hash无需后端配置且兼容性好，而history需要配置 `index.html`用于匹配不到资源的情况。

## 22、什么是 HTML 的实体编码 (HTML Entity Encode)

HTML 实体是一段以连字号（&）开头、以分号（;）结尾的字符串。用以显示不可见字符及保留字符 (如 HTML 标签)

在前端，一般为了避免 XSS 攻击，会将 `<>` 编码为 `<` 与 `>`，这些就是 HTML 实体编码

## 23、如何取消请求的发送

### 001 XHR 使用 `xhr.abort()`

```
const xhr = new XMLHttpRequest(),  method = "GET",  url = "https://developer.mozilla.org/";xhr.open(method, url, true); xhr.send(); // 取消发送请求xhr.abort();
```

### 002 fetch 使用 `AbortController`

> `AbortController` 文档见 [AbortSignal - MDN(opens in a new tab)](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)，它不仅可以取消 Fetch 请求发送，同样也可以取消事件的监听(通过 `addEventListener` 的第三个参数 `signal` 控制)

1. 发送请求时使用一个 `signal` 选项控制 fetch 请求
2. `control.abort()` 用以取消请求发送
3. 取消请求发送之后会得到异常 `AbortError`

```
const controller = new AbortController()const signal = controller.signal const downloadBtn = document.querySelector('.download');const abortBtn = document.querySelector('.abort'); downloadBtn.addEventListener('click', fetchVideo); // 点击取消按钮时，取消请求的发送abortBtn.addEventListener('click', function() {  controller.abort();  console.log('Download aborted');}); function fetchVideo() {  ...  fetch(url, {signal}).then(function(response) {    ...  }).catch(function(e) {   // 请求被取消之后将会得到一个 AbortError    reports.textContent = 'Download error: ' + e.message;  })}
```

#### 003 Axios: `xhr` 与 `http/https`

`Axios` 中通过 `cancelToken` 取消请求发送

```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source(); 
axios.get("/user/12345", {    cancelToken: source.token,  }).catch(function (thrown) {    if (axios.isCancel(thrown)) {      console.log("Request canceled", thrown.message);
                                                                                                                      } else {      // handle error    }  }); 
                                                                                                                        axios.post(  "/user/12345",  {    name: "new name",  },  {    cancelToken: source.token,  },); // cancel the request (the message parameter is optional)
                                                                                                                        source.cancel("Operation canceled by the user.");
```

而其中的原理可分为两部分

- 浏览器端: 基于 XHR，`xhr.abort()`，见源码[axios/lib/adapters/xhr.js(opens in a new tab)](https://github.com/axios/axios/blob/v0.21.1/lib/adapters/xhr.js#L165)
- Node端: 基于 http/https/follow-redirects，使用 `request.abort()`，见源码[axios/lib/adapters/http.js(opens in a new tab)](https://github.com/axios/axios/blob/v0.21.1/lib/adapters/http.js#L289)

> Author 回答者: [shfshanyue(opens in a new tab)](https://github.com/shfshanyue)

@evle 可以使用 js 代码高亮一下，其实 CancelToken 的底部原理是基于 xhr 的

## 24、DOM 中如何阻止事件默认行为，如何判断事件否可阻止？

- `e.preventDefault()`: 取消事件
- `e.cancelable`: 事件是否可取消

如果 `addEventListener` 第三个参数 `{ passive: true}`，`preventDefault` 将会会无效

[补充] 如果passive设置为true 那其实preventDefault 就会无效 因为 passive 为true 会导致初始化的时候cancelable为false

event.preventDefault 不能取消的没有固定哪一个类 主要是在规范中有没有定义Default Action 还有即使是定义了Default Action 那在实际中可能也会在不同的触发时间存在或不存在默认行为 所以可以依赖event.cancelable 来处理Default Action

如果只是简单列举下 具体可以去 [https://w3c.github.io/uievents/#events-wheelevents(opens in a new tab)](https://w3c.github.io/uievents/#events-wheelevents) 自己看看 当然不是全部event这里都有我就不都粘这里了

UI Event

```
loadunloadaborterrorselect
```

Focus Event

```
blurfocusfocusinfocusout
```

Mouse Event

```
dbclickmousedown   部分情况mouseentermoouseleavemoousemovemouseoutmouseleavemouseup     鼠标左右
```

Input Event

```
input
```

Keyboard

```
keydown 部分情况keyup
```

Composition Event

```
compositionupdatecompositionend
```

Touch Event

```
touchstarttouchend    部分情况touchmovetouchcancel
```

scroll 规范中没有定义他的Event归属 其实算是wheel的后续操作

检查能不能取消默认事件可以使用 cancelable

是否被取消了默认事件defaultPrevented

取消默认 preventDefault 或者 e.returnValue = false

正常一个event是带有7个tag

stop propagation flag => stopPropagation | cancelBubble | stopImmediatePropagation

stop immediate propagation flag => stopImmediatePropagation

canceled flag => returnValue设置false 会导致这里是false | preventDefault

in passive listener flag => passive是在addEventListener的第三个config里面可以设置

composed flag => 用来指示该事件是否可以从 Shadow DOM 传递到一般的 DOM

initialized flag 没有理解

dispatch flag

## 25、什么是事件冒泡和事件捕获

## 26、什么是事件委托，e.currentTarget 与 e.target 有何区别

![img](https://static.shanyue.tech/images/23-02-11/clipboard-0095.c66057.webp)

事件委托指当有大量子元素触发事件时，将事件监听器绑定在父元素进行监听，此时数百个事件监听器变为了一个监听器，提升了网页性能。

另外，React 把所有事件委托在 Root Element，用以提升性能。

*Event 接口的只读属性 currentTarget 表示的，标识是当事件沿着 DOM 触发时事件的当前目标。它总是指向事件绑定的元素，而 Event.target 则是事件触发的元素。*

## 27、关于事件捕获和冒泡，以下代码输出多少

```html
<div class="container" id="container">
  <div class="item" id="item">
    <div class="btn" id="btn">Click me</div>
  </div>
</div>
```

```javascript
document.addEventListener(
  "click",
  (e) => {
    console.log("Document click");
  },
  {
    capture: true,
  },
);

container.addEventListener(
  "click",
  (e) => {
    console.log("Container click");
    // e.stopPropagation()
  },
  {
    capture: true,
  },
);

item.addEventListener("click", () => {
  console.log("Item click");
});

btn.addEventListener("click", () => {
  console.log("Btn click");
});

btn.addEventListener(
  "click",
  () => {
    console.log("Btn click When Capture");
  },
  {
    capture: true,
  },
);
```

执行顺序：`Document click`=>`Container click`=>`Btn click When Capture`=>`Btn click`=>`Item click`=>

## 28、浏览器中 cookie 有哪些字段

- Domain
- Path
- Expire/MaxAge
- HttpOnly
- Secure
- SameSite

## 29、DOM 中 Element 与 Node 有何区别

Element 继承于 Node，具有Node的方法，同时又拓展了很多自己的特有方法

## 30、SameSite Cookie 有哪些值，是如何预防 CSRF 攻击的

- `None`: 任何情况下都会向第三方网站请求发送 `Cookie`
- `Lax`: 只有导航到第三方网站的 `Get` 链接会发送 `Cookie`，跨域的图片、`iframe`、`form`表单都不会发送 `Cookie`
- `Strict`: 任何情况下都不会向第三方网站请求发送 `Cookie`

目前，主流浏览器 `Same-Site` 的默认值为 `Lax`，而在以前是 `None`，将会预防大部分 `CSRF` 攻击，如果需要手动指定 `Same-Site` 为 `None`，需要指定 `Cookie` 属性 `Secure`，即在 `https` 下发送

## 31、sessionStorage与localStorage有何区别

`localStorage`生命周期是永久除非自主清除 `sessionStorage`生命周期为当前窗口或标签页，关闭窗口或标签页则会清除数据

他们均只能存储字符串类型的对象

不同浏览器无法共享 `localStorage`或 `sessionStorage`中的信息。相同浏览器的不同页面间可以共享相同的 `localStorage`（页面属于相同域名和端口），但是不同页面或标签页间无法共享 `sessionStorage`的信息。这里需要注意的是，页面及标 签页仅指顶级窗口，如果一个标签页包含多个 `iframe`标签且他们属于同源页面，那么他们之间是可以共享 `sessionStorage`的。 [https://www.php.cn/faq/463215.html(opens in a new tab)](https://www.php.cn/faq/463215.html)

## 32、如何封装一个支持过期时间的 localStorage

```javascript
function initLocalStorage() {
  localStorage.setItem = function (key, value, time = 1000) {
    const expiresTime = Date.now() + time * 1000;
    const payload = {
      __data: value,
      __expiresTime: expiresTime,
    };
    Storage.prototype.setItem.call(localStorage, key, JSON.stringify(payload));
  };
  localStorage.getItem = function (key) {
    const value = Storage.prototype.getItem.call(localStorage, key);
    if (typeof value === "string") {
      const jsonVal = JSON.parse(value);
      if (jsonVal.__expiresTime) {
        if (jsonVal.__expiresTime >= Date.now()) {
          return JSON.stringify(jsonVal.__data);
        } else {
          return null;
        }
      }
    }
    return value;
  };
}
initLocalStorage();
```

想了下 只能去改api 去封装一层 不过存在一个问题就是别人在使用的时候 也需要遵循这个规则 没想到别的办法

## 32、如何统计当前页面出现的所有标签

- `document.querySelectorAll('*')`
- `document.getElementsByTagName('*')`
- `$$('*')`，可在浏览器控制台使用
- `document.all`，已废弃，不建议使用

## 33、如何监听 localStorage 的变动

`window.onstorage`

## 34、Data URL 的应用场景及如何生成

Data URLs 由四个部分组成：

1. 前缀(data:)
2. 指示数据类型的MIME类型
3. 如果二进制数据则为可选的base64标记，比如图片
4. 数据

```javascript
data:[<mediatype>][;base64],<data>
```

## 35、浏览器中如何读取二进制信息

[二进制数据，文件](https://zh.javascript.info/binary)

## 36、React 中监听 input 的 onChange 事件的原生事件是什么

[React 中 onChange 的原生事件是什么？](https://codesandbox.io/s/input-onchange-1ybhw?file=/src/App.js)

```javascript
import "./styles.css";

export default function App() {
  return (
    <div className="App">
    <input
    onChange={(e) => {
    console.log("Event: ", e);
    console.log("NativeEvent: ", e.nativeEvent);
    console.log("CurrentTarget: ", e.nativeEvent.currentTarget);
    console.log("NativeEvent Type: ", e.nativeEvent.type);
  }}
/>
  </div>
);
}
```

## 37、在浏览器中点击 a 标签保存为文件如何做

有两种方式:

1. `a.download` 当指定 a 标签的 `download` 属性时，点击该链接会直接保存为文件，文件名为 `download` 属性
2. 通过对 a 标签指定的 URL 在服务器设置响应头 `Content-Disposition: attachment; filename="filename.jpg"` 可直接下载

## 38、如何禁止打开浏览器控制台

https://github.com/AEPKILL/devtools-detector

## 39、简述下 WebWorker，它如何进行通信

js多线程通信，只能访问navigator、setTimeout等有限的api

通过onmessage和postmessage通信，全局对象是self

**主线程代码（main.js）：**

```javascript
javascriptCopy code// 创建一个 Worker
const worker = new Worker('worker.js');

// 向 Worker 发送消息
worker.postMessage('Hello from main thread!');

// 监听来自 Worker 的消息
worker.onmessage = function(event) {
  console.log('Received message from worker:', event.data);
};

// 监听 Worker 报错
worker.onerror = function(error) {
  console.error('Worker error:', error);
};
```

**Worker 代码（worker.js）：**

```javascript
javascriptCopy code// 监听来自主线程的消息
self.onmessage = function(event) {
console.log('Received message from main thread:', event.data);

// 向主线程发送消息
self.postMessage('Hello from worker!');
};
```

在这个例子中，主线程首先创建了一个 Worker，并通过 `postMessage()` 方法向 Worker 发送了一条消息。然后，主线程通过监听 Worker 的 `onmessage` 事件来接收来自 Worker 的回复消息。

Worker 接收到主线程发送的消息后，通过监听 `onmessage` 事件来接收消息，并通过 `postMessage()` 方法向主线程发送了一条回复消息。

这样，主线程和 Worker 之间就成功地进行了通信。

## 40、浏览器中监听事件函数 addEventListener 第三个参数有那些值

- capture。监听器会在时间捕获阶段传播到event.target时触发。
- passive。监听器不会调用preventDefault()。
- once。监听器只会执行一次，执行后移除。
- singal。调用abort()移除监听器。

## 41、浏览器中 Frame 与 Event Loop 的关系是什么

### Native Import: Import from URL

通过 `script[type=module]`，可直接在浏览器中使用原生 `ESM`。这也使得前端不打包 (`Bundless`) 成为可能。

```html
<script type="module">
  import lodash from 'https://cdn.skypack.dev/lodash'
</script>
```

由于前端跑在浏览器中，**因此它也只能从 URL 中引入 `Package`**

1. 绝对路径: `https://cdn.sykpack.dev/lodash`
2. 相对路径: `./lib.js`

现在打开浏览器控制台，把以下代码粘贴在控制台中。由于 `http import` 的引入，你发现你调试 `lodash` 此列工具库更加方便了。

```js
> lodash = await import('https://cdn.skypack.dev/lodash')

> lodash.get({ a: 3 }, 'a')
```

![img](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-22/clipboard-2865.638ba7.webp)

### [#](https://shanyue.tech/frontend-engineering/esm.html#importmap)ImportMap

但 `Http Import` 每次都需要输入完全的 URL，相对以前的裸导入 (`bare import specifiers`)，很不太方便，如下例:

```js
import lodash from 'lodash'
```

它不同于 `Node.JS` 可以依赖系统文件系统，层层寻找 `node_modules`

```bash
/home/app/packages/project-a/node_modules/lodash/index.js
/home/app/packages/node_modules/lodash/index.js
/home/app/node_modules/lodash/index.js
/home/node_modules/lodash/index.js
```

在 ESM 中，可通过 `importmap` 使得裸导入可正常工作:

```html
<script type="importmap">
{
  "imports": {
    "lodash": "https://cdn.skypack.dev/lodash",
    "ms": "https://cdn.skypack.dev/ms"
  }
}
</script>
```

此时可与以前同样的方式进行模块导入

```js
import lodash from 'lodash'

import("lodash").then(_ => ...)
```

那么通过裸导入如何导入子路径呢？

```html
<script type="importmap">
{
  "imports": {
    "lodash": "https://cdn.skypack.dev/lodash",
    "lodash/": "https://cdn.skypack.dev/lodash/"
  }
}
</script>
<script type="module">
import get from 'lodash/get.js'
</script>
```

### [#](https://shanyue.tech/frontend-engineering/esm.html#import-assertion)Import Assertion

通过 `script[type=module]`，不仅可引入 Javascript 资源，甚至可以引入 JSON/CSS，示例如下

```html
<script type="module">
import data from './data.json' assert { type: 'json' }

console.log(data)
</script>
```

[扩展](https://shanyue.tech/frontend-engineering/esm.html)
