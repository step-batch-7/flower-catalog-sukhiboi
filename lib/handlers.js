const { readFileSync, writeFileSync, existsSync, statSync } = require('fs');
const mimeTypes = require('./mimeTypes');
const { Comments } = require('./commentList');
const { Comment } = require('./comment');
const { dataStorePath } = require('./../config.js');

const comments = Comments.load(require(dataStorePath));

const fileExists = function(filename) {
  const stat = existsSync(filename) && statSync(filename);
  return stat && stat.isFile();
};

const err404 = (req, res) => {
  res.writeHead(404, 'Not Found');
  res.end();
};

const serveTemplate = function(req, res, next) {
  const filename = `${__dirname}/../templates${req.url}`;
  if (!fileExists(filename)) {
    next();
    return;
  }
  const rawTemplate = readFileSync(`./templates/guest-book.html`);
  const content = rawTemplate
    .toString()
    .replace('__COMMENTS__', comments.toHTML());
  res.setHeader('Content-Type', mimeTypes['html']);
  res.end(content);
};

const guestBookHandler = function(req, res, next) {
  const rawComment = req.body;
  const comment = new Comment(rawComment.name, rawComment.content, new Date());
  comments.addComment(comment);
  writeFileSync(dataStorePath, comments.toJSON());
  serveTemplate(req, res, next);
};

const serveStaticPage = function(req, res, next) {
  let url = req.url;
  if (url === '/') url = '/index.html';
  const filename = `${__dirname}/../public${url}`;
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
  serveStaticPage
};
