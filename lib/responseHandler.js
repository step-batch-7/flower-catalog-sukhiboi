const { readFileSync, existsSync } = require('fs');
const { Response } = require('./response');
const { Request } = require('./request');
const mimeTypes = require('./mimeTypes');

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
    return generateResponse(html, type, []);
  }
  return generateDefaultResponse();
};

module.exports = {
  processRequest
};
