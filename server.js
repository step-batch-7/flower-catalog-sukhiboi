const http = require('http');
const { fileExists, saveContent } = require('./lib/fileOperations');
const { dataStorePath, PORT } = require('./config.js');
const { app } = require('./lib/app');

const dataStoreExists = fileExists(dataStorePath);
if (!dataStoreExists) saveContent(dataStorePath, '[]');

const server = http.Server(app);
server.listen(PORT);
