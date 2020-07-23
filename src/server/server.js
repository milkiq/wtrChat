const net = require('net');
const port = 8080;

let client = {};

let server = net.createServer();

server.on('connection', socket => {
  server.maxConnections = 10;
  socket.setEncoding('utf8');

  // 缓存用户
  let key = socket.remoteAddress + socket.remotePort;
  client[key] = socket;

  socket.on('data', data => {
    console.log(data);

    Object.keys(client).forEach(user => {
      client[user].write(data);
    });
  });

  // 客户端主动关闭后在服务器客户端存储中清除客户端，并销毁对应的 socket
  socket.on('end', () => {
    socket.destroy();
    delete client[key];
  });
});

// 监听端口号
server.listen(port, () => {
  console.log(`server start ${port}`);
});
