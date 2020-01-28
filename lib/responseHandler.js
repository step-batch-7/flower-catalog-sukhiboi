const { readFileSync, writeFileSync, existsSync, statSync } = require('fs');
const { Comment } = require('./comment');
const { parseQuery } = require('./queryParser');
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

const err404 = (req, res) => {
  res.writeHead(404, 'Not Found');
  res.end();
};

const saveComment = function(commentData) {
  const { name, content } = parseQuery(commentData);
  if (!name && !content) return;
  const comment = new Comment(name, content);
  const rawComments = readFileSync(dataStorePath, 'utf8');
  const comments = JSON.parse(rawComments);
  comments.unshift(comment);
  writeFileSync(dataStorePath, JSON.stringify(comments));
};

const addCommentsToTemplate = function(html) {
  const rawComments = readFileSync(dataStorePath);
  const comments = JSON.parse(rawComments);
  const commentsAsHTML = comments.reduce((html, comment) => {
    html += Comment.convertToHTML(comment);
    return html;
  }, '');
  return html.toString().replace('__COMMENTS__', commentsAsHTML);
};

const serveTemplate = function(req, res) {
  const filename = `./templates${req.url}`;
  if (!fileExists(filename)) return err404(null, res);
  const rawTemplate = readFileSync(`./templates/guest-book.html`);
  const content = addCommentsToTemplate(rawTemplate);
  res.setHeader('Content-Type', mimeTypes['html']);
  res.end(content);
};

const guestBookHandler = function(req, res) {
  req.setEncoding('utf8');
  req.on('data', commentData => {
    saveComment(commentData);
    serveTemplate(req, res);
  });
};

const serveStaticPage = function(req, res) {
  let url = req.url;
  if (url === '/') url = '/index.html';
  const filename = `./public${url}`;
  if (!fileExists(filename)) return err404(null, res);
  const content = readFileSync(filename);
  const type = getContentType(filename);
  res.setHeader('Content-Type', mimeTypes[type]);
  res.end(content);
};

const handleRequest = function(req, res) {
  const { url, method } = req;
  let handler = err404;

  if (method == 'GET') handler = serveStaticPage;
  if (method == 'GET' && url == '/guest-book.html') handler = serveTemplate;
  if (method == 'POST' && url == '/guest-book.html') handler = guestBookHandler;

  return handler(req, res);
};

module.exports = {
  handleRequest,
  dataStorePath
};
