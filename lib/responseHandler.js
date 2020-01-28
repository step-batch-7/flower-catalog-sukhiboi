const { readFileSync, existsSync, writeFileSync, statSync } = require('fs');
const { Response } = require('./response');
const { Request } = require('./request');
const { Comment } = require('./comment');
const mimeTypes = require('./mimeTypes');
const dataStorePath = './DATASTORE.json';

const getContentType = function(filename) {
  const urlParts = filename.split('.');
  const type = urlParts[urlParts.length - 1];
  return type;
};

const fileExists = function(filename) {
  const stat = existsSync(filename) && statSync(filename);
  return stat && stat.isFile();
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
  const { name, content } = query;
  if (!name && !content) return;
  const comment = new Comment(name, content);
  const commentData = readFileSync(dataStorePath, 'utf8');
  const comments = JSON.parse(commentData);
  comments.unshift(comment);
  writeFileSync(dataStorePath, JSON.stringify(comments));
};

const formatCommentsToHTML = function(comments) {
  const html = comments.reduce((html, comment) => {
    html += Comment.convertToHTML(comment);
    return html;
  }, '');
  return html;
};

const addCommentsToHTML = function(html, comments) {
  return html
    .toString()
    .replace('__COMMENTS__', formatCommentsToHTML(JSON.parse(comments)));
};

const guestBookHandler = function(query) {
  const filename = `./templates/guest-book.html`;
  saveComment(query);
  let html = readFileSync(filename);
  const comments = readFileSync(dataStorePath);
  html = addCommentsToHTML(html, comments);
  const type = getContentType(filename);
  return generateResponse(html, type, []);
};

const serveIndexPage = function() {
  const html = readFileSync('./public/index.html');
  return generateResponse(html, 'html', []);
};

const serveStaticPage = function(filename) {
  if (!fileExists(filename)) return generateDefaultResponse();
  const html = readFileSync(filename);
  const type = getContentType(filename);
  return generateResponse(html, type, []);
};

const processRequest = function(requestText) {
  const request = Request.parse(requestText);
  const { path, method, query } = request.details;
  const filename = `./public${path}`;

  if (path == '/guest-book.html') return guestBookHandler(query);
  if (method == 'GET' && path === '/') return serveIndexPage();
  if (method == 'GET') return serveStaticPage(filename);
  return generateDefaultResponse();
};

module.exports = {
  processRequest,
  dataStorePath
};
