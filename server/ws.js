
// 引入 WebSocket 客户端库
const WebSocket = require('ws');

// WebSocket 服务器地址
const wsServer = 'ws://43.132.234.89:3528'; // 根据实际情况修改服务器地址和端口

// 创建 WebSocket 实例
const ws = new WebSocket(wsServer);

// 连接成功时的回调
ws.on('open', function open() {
    console.log('Connected to WebSocket server');

    // 发送消息到服务器
    ws.send('Hello, WebSocket server!');
});

// 接收服务器发送的消息
ws.on('message', function incoming(data) {
    console.log('Received message from server: %s', data);
});

// 连接关闭时的回调
ws.on('close', function close() {
    console.log('Disconnected from WebSocket server');
});