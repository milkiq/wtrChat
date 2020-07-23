const rf = require('fs');
const net = require('net');
const readline = require('readline');

let data = rf.readFileSync('./config.json', 'utf-8');

try {
  data = JSON.parse(data);
} catch (error) {
  process.exit(0);
}

const { name, HOST, PORT } = data;

const rl = readline.createInterface(process.stdin, process.stdout);

const client = new net.Socket();
client.setEncoding('utf8');
client.connect(PORT, HOST, function () {
  console.log('连接至: ' + HOST + ':' + PORT);
  client.write(`${name} 进入聊天室`);
});

client.on('data', function (data) {
  readline.clearLine(process.stdout, 0);
  console.log(data);
});

client.on('close', function () {
  console.log('连接关闭');
});

rl.setPrompt('');
rl.prompt();

rl.on('line', function (line) {
  readline.moveCursor(process.stdout, 0, -1);
  readline.clearLine(process.stdout, 0);
  switch (line.trim()) {
    case 'exit':
      rl.close();
      break;
    default:
      client.write(`${name}: ${line.trim()}`);
      break;
  }
  rl.prompt();
});

rl.on('close', function () {
  if (client) {
    client.write(`${name} 退出聊天室`);
    client.destroy();
  }
  console.log('bye.');
  process.exit(0);
});

process.on('SIGINT', function () {
  rl.close();
});
