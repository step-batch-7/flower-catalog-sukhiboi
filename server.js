const http = require('http');
const { handleRequest, dataStorePath } = require('./lib/responseHandler');
const { writeFileSync, existsSync } = require('fs');

const server = http.Server(handleRequest);
server.listen(process.argv[2] || 8000);

const dataStoreExists = existsSync(dataStorePath);
if (!dataStoreExists) writeFileSync(dataStorePath, '[]');
