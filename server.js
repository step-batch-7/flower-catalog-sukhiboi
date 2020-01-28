const http = require('http');
const { handleRequest, dataStorePath } = require('./lib/responseHandler');
const { writeFileSync, existsSync } = require('fs');

const server = http.Server(handleRequest);
const PORT = 8000;

server.listen(process.argv[2] || PORT);

const dataStoreExists = existsSync(dataStorePath);
if (!dataStoreExists) writeFileSync(dataStorePath, '[]');
