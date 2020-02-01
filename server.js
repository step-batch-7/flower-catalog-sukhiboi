const http = require('http');
const { writeFileSync, existsSync } = require('fs');
const { dataStorePath, PORT } = require('./config.js');
const { app } = require('./lib/app');

const dataStoreExists = existsSync(dataStorePath);
if (!dataStoreExists) writeFileSync(dataStorePath, '[]');

const server = http.Server(app);
server.listen(PORT);
