const { readFileSync, existsSync, writeFileSync } = require('fs');
const { Response } = require('./response');
const { Request } = require('./request');
const mimeTypes = require('./mimeTypes');

const dataStorePath = './DATASTORE.json';

(function() {
  if (!existsSync(dataStorePath)) {
    writeFileSync(dataStorePath, '[]');
  }
  const content = readFileSync(dataStorePath);
  if (content == '') {
    writeFileSync(dataStorePath, '[]');
  }
})();

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

const formatCommentsToHTML = function(comments) {
  const htmlComments = comments.reduce((htmlComments, comment) => {
    htmlComments += `<div class='comment'>
    <span> Commented by <span class="name">${comment.name}</span> on <span class="time">${comment.date}</span></span>
      <p>${comment.content}</p>
  </div>`;
    return htmlComments;
  }, '');
  return htmlComments;
};

const guestBookHandler = function(request) {
  const filename = `./templates${request.details.path}`;
  saveComment(request.details.query);
  let html = getContent(filename);
  const comments = readFileSync(dataStorePath);
  html = html.replace(
    '__COMMENTS__',
    formatCommentsToHTML(JSON.parse(comments))
  );
  const type = getContentType(filename);
  return generateResponse(html, type, []);
};

const serveIndexPage = function() {
  const html = getContent('./public/index.html');
  return generateResponse(html, 'html', []);
};

const serveStaticPage = function(filename) {
  const html = getContent(filename);
  const type = getContentType(filename);
  return generateResponse(html, type, []);
};

const processRequest = function(requestText) {
  const request = Request.parse(requestText);
  const path = request.details.path;
  const filename = `./public${path}`;

  if (path == '/guest-book.html') return guestBookHandler(request);
  if (path === '/') return serveIndexPage;
  if (existsSync(filename)) return serveStaticPage();

  return generateDefaultResponse();
};

module.exports = {
  processRequest
};
