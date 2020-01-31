const { dataStorePath } = require('./../config.js');
const { loadContent, saveContent } = require('./fileOperations');

const formatTime = function(time) {
  return time.toString().padStart(2, '0');
};

const formatDate = function(commentDate) {
  const date = new Date(commentDate);
  const todaysDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  const currentTime = `${formatTime(date.getHours())}:${formatTime(
    date.getMinutes()
  )}`;
  return `${currentTime} ${todaysDate}`;
};

const saveComment = function(commentObj) {
  const { name, content } = commentObj;
  if (!name && !content) return;
  const comment = new Comment(name, content);
  const rawComments = loadContent(dataStorePath, 'utf8');
  const comments = JSON.parse(rawComments);
  comments.unshift(comment);
  saveContent(dataStorePath, JSON.stringify(comments));
};

const addCommentsToTemplate = function(html) {
  const rawComments = loadContent(dataStorePath);
  const comments = JSON.parse(rawComments);
  const commentsAsHTML = comments
    .map(comment => Comment.convertToHTML(comment))
    .join('\n');
  return html.toString().replace('__COMMENTS__', commentsAsHTML);
};

class Comment {
  constructor(name, content) {
    this.name = name;
    this.content = content;
    this.date = new Date();
  }

  static convertToHTML(comment) {
    const html = `<div class='comment'>
        <span> Commented by <span class="name">${
          comment.name
        }</span> on <span class="time">${formatDate(comment.date)}</span></span>
        <p>${comment.content}</p>
    </div>`;
    return html;
  }
}

module.exports = {
  Comment,
  saveComment,
  addCommentsToTemplate
};
