const { readFileSync, existsSync, writeFileSync } = require('fs');
const { Response } = require('./response');
const { Request } = require('./request');
const mimeTypes = require('./mimeTypes');

const dataStorePath = './DATASTORE.json';

const setUpDataStore = function() {
  if (!existsSync(dataStorePath)) {
    writeFileSync(dataStorePath, '[]');
  }
  const content = readFileSync(dataStorePath);
  if (content == '') {
    writeFileSync(dataStorePath, '[]');
  }
};

setUpDataStore();

const getContentType = function(filename) {
  const urlParts = filename.split('.');
  const type = urlParts[urlParts.length - 1];
  return type;
};

const getContent = function(filename) {
  const type = getContentType(filename);
  const execptionType = ['png', 'jpg', 'jpeg', 'gif', 'pdf'].includes(type);
  if (execptionType) {
    return readFileSync(filename);
  }
  return readFileSync(filename, 'utf8');
};

const generateDefaultResponse = () => {
  const response = new Response(404);
  return response;
};

const generateResponse = (content, type, cookies) => {
  const response = new Response(200, content);
  cookies.forEach(cookie => response.addCookie(cookie));
  response.addHeader('Content-Type', mimeTypes[type]);
  return response;
};

const saveComment = function(query) {
  const name = query.name;
  const comment = query.comment;
  if (name == undefined || comment == undefined) return;
  const date = new Date();
  const commentObj = {
    date: date.toString(),
    name: query.name,
    content: query.comment
  };
  const commentData = readFileSync(dataStorePath, 'utf8');
  const comments = JSON.parse(commentData);
  comments.unshift(commentObj);
  writeFileSync(dataStorePath, JSON.stringify(comments));
};

const processRequest = function(requestText) {
  const request = Request.parse(requestText);
  const filename = `./public${request.details.path}`;
  if (request.details.path === '/') {
    const html = getContent('./public/index.html');
    return generateResponse(html, 'html', []);
  }
  if (existsSync(filename)) {
    const html = getContent(filename);
    const type = getContentType(filename);
    saveComment(request.details.query);
    return generateResponse(html, type, []);
  }
  return generateDefaultResponse();
};

module.exports = {
  processRequest
};
