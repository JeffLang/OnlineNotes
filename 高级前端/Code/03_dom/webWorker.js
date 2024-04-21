// 监听来自主线程的消息
self.onmessage = function (event) {
  console.log('Received message from main thread:', event.data)

  // 向主线程发送消息
  self.postMessage('Hello from worker!')
}
