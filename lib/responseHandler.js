const { readFileSync, writeFileSync, existsSync, statSync } = require('fs');
const { Comment } = require('./comment');
const { parseQuery } = require('./queryParser');
const mimeTypes = require('./mimeTypes');
const dataStorePath = './DATASTORE.json';

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

const serveTemplate = function(req, res, next) {
  const filename = `./templates${req.url}`;
  if (!fileExists(filename)) {
    next();
    return;
  }
  const rawTemplate = readFileSync(`./templates/guest-book.html`);
  const content = addCommentsToTemplate(rawTemplate);
  res.setHeader('Content-Type', mimeTypes['html']);
  res.end(content);
};

const guestBookHandler = function(req, res, next) {
  req.setEncoding('utf8');
  req.on('data', commentData => {
    saveComment(commentData);
    serveTemplate(req, res);
  });
};

const serveStaticPage = function(req, res, next) {
  let url = req.url;
  if (url === '/') url = '/index.html';
  const filename = `./public${url}`;
  if (!fileExists(filename)) {
    next();
    return;
  }
  const content = readFileSync(filename);
  const type = filename.match(/.+\.(.*)/)[1];
  res.setHeader('Content-Type', mimeTypes[type]);
  res.end(content);
};

module.exports = {
  err404,
  serveTemplate,
  guestBookHandler,
  serveStaticPage,
  dataStorePath
};
