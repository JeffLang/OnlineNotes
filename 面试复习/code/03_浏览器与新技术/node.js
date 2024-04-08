const http = require('http')

// 创建服务器
const server = http.createServer((req, res) => {
  if (req.url.includes('/test')) {
    // 设置响应头
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' })

    // 判断服务
    // 发送响应内容
    setTimeout(() => {
      res.end(req.url + ': Hello, World!\n')
    }, 1000)
  }

  // SSE
  // 设置响应头
  if (req.url.includes('/sse')) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream', // 设置响应类型为 text/event-stream
      'Cache-Control': 'no-cache', // 禁用缓存
      Connection: 'keep-alive', // 保持连接
      'Access-Control-Allow-Origin': '*', // 跨域
    })

    // 向客户端发送数据
    const interval = setInterval(() => {
      const data = new Date().toLocaleString()
      res.write(`data: ${data}\n\n`) // 每次发送的数据都以 "data: " 开头，最后以两个换行符结束
    }, 1000) // 每秒钟发送一次数据
    req.addListener(
      'close',
      function () {
        console.log('服务器收到关闭请求')
        clearInterval(interval)
      },
      false,
    )
  }
})

// 监听端口
const host = '127.0.0.1'
const port = 3000
server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`)
})
