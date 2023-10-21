## 兼容性问题

### 1. ios绝对定位问题

​	描述： ios绝对定位会被父级元素覆盖，

​	解决：使用`transform`可以解决该问题

### 2.移动端history.replace

​	描述：移动端的history.relpace依然会向history列表中存入上一个url地址

​	解决：

### 3.页面关闭埋点问题

如何在页面卸载的时候向远端web服务器发送请求？

用户代理通常会忽略在 unload 事件处理器中产生的异步 XMLHttpRequest，如果你想在页面卸载、刷新或跳转前发送请求，这个请求绝大多数情况下会被浏览器 canceled 掉。但也会有几种方法可以把请求发送出去。

#### 方法1：使用XMLHttpRequest发送同步请求

```js
const syncRequest = (url, data = {}) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, false);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.send(JSON.stringify(data));
};
```

**问题：**

1. 同步的`XMLHttpRequest`迫使用户代理延迟卸载文档，并使得下一个导航出现的更晚。下一个页面对于这种较差的载入表现无能为力。
2. 问题一也仅是体验问题，还有一个更加严重的问题：“实际上，许多浏览器已完全弃用主线程上的同步XHR支持。”

#### 方法2：navigator.sendBeacon()

这是本文的主角。

**navigator.sendBeacon()**方法可用于通过[HTTP](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Glossary/HTTP)将少量数据异步传输到Web服务器。

使用**sendBeacon()** 方法会使用户代理在有机会时**异步**地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能。这就解决了提交分析数据时的所有的问题：数据可靠，传输异步并且不会影响下一页面的加载。此外，代码实际上还要比其他技术简单许多！

```text
const sendBeacon = (url, data = {}) => {
  const joinedQueue = navigator.sendBeacon(url, JSON.stringify(data));
  console.log('用户代理把数据加入传输队列' + (joinedQueue ? '成功' : '失败'));
}
```

sendBeacon()是以Http **POST**方法发送请求的。

sendBeacon()第二个参数可接受**ArrayBufferView**、**Blob**、**FormData**、**DOMString**类型的数据。

sendBeacon()会根据传入的数据自动设置请求头，数据类型和对应Content-Type如下：

- Formdata：multipart/form-data
- DOMString：text/plain

如果想传递json数据到后端，没法直接设置请求头的Content-Type，因此需要明确告诉后端开发人员你传递的是json格式的数据。

但是可以通过构建Blob对象间接达到设置Content-Type的效果。

```js
const sendBeacon= (url, data = {}) => {
  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json; charset=UTF-8',
  });
  return navigator.sendBeacon(url, blob);
};
```

通过Blob也可以发送其他MIME type的数据。

如果浏览器不支持sendBeacon()则回退到同步的XMLHttpRequest：

```js
function sendReport(url, data) {
  if (navigator.sendBeacon) {
    const joinedQueue = sendBeacon(url, data);
    if (!joinedQueue) {
      syncRequest(url, data);
    }
  } else {
    syncRequest(url, data);
  }
}
```

#### 结果

最终选择`navigator.sendBeacon()`，因为浏览器不支持`XMLHttpRequest`

### 4. 企业微信favicon更新失效问题

手动引入favicon，并且在link的href中动态添加query参数



