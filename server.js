const { Server } = require('net');
const { processRequest, dataStorePath } = require('./lib/responseHandler');
const { writeFileSync } = require('fs');

const server = new Server();
const PORT = 8000;

server.listen(process.argv[2] || PORT);

server.on('listening', () => {
  writeFileSync(dataStorePath, '[]');
  const { address, family, port } = server.address();
  console.log(`\nListening on port ${address}:${port} with ${family}\n`);
});

server.on('connection', socket => {
  socket.setEncoding('utf8');
  socket.on('data', data => {
    const response = processRequest(data);
    response.send(socket);
    socket.end();
  });
});
