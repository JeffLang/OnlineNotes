## 01、localhost:3000 与 localhost:5000 的 cookie 信息是否共享

`Set-Cookie: id=a3fWa; Expires=Thu, 21 Oct 2021 07:28:00 GMT; Secure; HttpOnly` 补充一点,不同协议http和https，也可以共享 但是带有Secure属性的不能被http共享 带有HttpOnly属性的cookie无法被document.cookie访问

## 02、什么是 CSRF 攻击

跨站请求伪造（英语：Cross-site request forgery），也被称为 one-click attack 或者 session riding，通常缩写为 CSRF 或者 XSRF， 是一种挟制用户在当前已登录的Web应用程序上执行非本意的操作的攻击方法。跟跨网站脚本（XSS）相比，XSS 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

CSRF (Cross-site request forgery)，跨站请求伪造，又称为 `one-click attack`，顾名思义，通过恶意引导用户一次点击劫持 cookie 进行攻击。

1. 使用 JSON API。当进行 CSRF 攻击时，请求体通过 `<form>` 构建，请求头为 `application/www-form-urlencoded`。它难以发送 JSON 数据被服务器所理解。
2. CSRF Token。生成一个随机的 token，切勿放在 cookie 中，每次请求手动携带该 token 进行校验。
3. SameSite Cookie。设置为 Lax 或者 Strict，禁止发送第三方 Cookie。

## 03、在浏览器中如何获取剪切板中内容

通过 `Clipboard API` 可以获取剪切板中内容，但需要获取到 `clipboard-read` 的权限，以下是关于读取剪贴板内容的代码：

```javascript
// 是否能够有读取剪贴板的权限
// result.state == "granted" || result.state == "prompt"
const result = await navigator.permissions.query({ name: "clipboard-read" });
 
// 获取剪贴板内容
const text = await navigator.clipboard.readText();
```

> 注: 该方法在 `devtools` 中不生效

## 04、如何把 json 数据转化为 demo.json 并下载文件

json 视为字符串，可以利用 `DataURL` 进行下载

`Text -> DataURL`

除了使用 DataURL，还可以转化为 Object URL 进行下载

`Text -> Blob -> Object URL`

可以把以下代码直接粘贴到控制台下载文件

```javascript
function download(url, name) {
  // 创建一个a标签
  const a = document.createElement('a')
  // 给a标签设置download属性
  a.setAttribute('download', name)
  a.rel = 'noopener'
  a.href = url
  a.click()
}

// 定义一个json
const json = {
  a: 3,
  b: 4,
  c: 5,
}
const str = JSON.stringify(json, null, 2)

// 方法一
// const url = `data:,${str}`
// const url = `data:application/json,${str}` // 此种写法会造成没有缩进

// 方法二
const url = URL.createObjectURL(new Blob([str], { type: 'application/json' }))
console.log('url', url)
function handleDownload() {
  download(url, 'json.json')
}
```

## 05、简单介绍 requestIdleCallback 及使用场景

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

```
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

## 06、如何计算白屏时间和首屏时间

[参考资料](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceNavigationTiming)

```javascript
// 白屏时间
// 创建一个 PerformanceObserver 实例
const observer = new PerformanceObserver(list => {
  // 遍历 PerformanceEntry 对象列表
  list.getEntries().forEach(entry => {
    console.log('entry', entry)
  })
})
  
// 启动 PerformanceObserver，监听指定类型的事件
observer.observe({ entryTypes: ['resource', 'navigation'] })
```

## 07、什么是重排重绘，如何减少重拍重绘

排和重绘是关键渲染路径中的两步，可以参考另一个问题: [什么是关键渲染路径(opens in a new tab)](https://q.shanyue.tech/fe/前端工程化/391.html)

- 重排(Reflow)：元素的位置发生变动时发生重排，也叫回流。此时在关键渲染路径中的 Layout 阶段，计算每一个元素在设备视口内的确切位置和大小。当一个元素位置发生变化时，其父元素及其后边的元素位置都可能发生变化，代价极高![img](https://q.shanyue.tech/assets/layout.png)
- 重绘(Repaint): 元素的样式发生变动，但是位置没有改变。此时在关键渲染路径中的 Paint 阶段，将渲染树中的每个节点转换成屏幕上的实际像素，这一步通常称为绘制或栅格化![img](https://q.shanyue.tech/assets/paint.png)

另外，重排必定会造成重绘。以下是避免过多重拍重绘的方法

1. 使用 `DocumentFragment` 进行 DOM 操作，不过现在原生操作很少也基本上用不到
2. CSS 样式尽量批量修改
3. 避免使用 table 布局
4. 为元素提前设置好高宽，不因多次渲染改变位置

## 08、什么是 Data URL

Data URL是前缀为`data:`协议的URL； 它允许内容创建者向文档中嵌入小文件，比如图片等。 Data URL由四部分组成：

- 前缀`data:`
- 指示数据类型的MIME类型。例如`image/jpeg`表示JPEG图像文件；如果此部分被省略，则默认值为`text/plain;charset=US-SACII`
- 如果为非文本数据，则可选base64做标记
- 数据

```
data:[mediatype][;base64], data
```

## 09、textarea 如何禁止拉伸

使用 CSS 样式可以避免拉伸

```css
textarea {
  resize: none;
}
```

## 10、在 Canvas 中如何处理跨域的图片

`img.setAttribute("crossOrigin", "anonymous");`

## 11、什么是 URL 编码 (URL Encode)

encodeURI用来编码**URI**，其不会编码保留字符：;,/?:@&=+$

encodeURIComponent用来编码URI**参数**，除了字符：A-Z a-z 0-9 - _ . ! ~ * ' ( )，都将会转义