const { Comment } = require('./comment');

class CommentList {
  constructor() {
    this.commentList = [];
  }
  addComment(comment) {
    this.commentList.unshift(comment);
  }
  toHTML() {
    return this.commentList.map(comment => comment.toHTML()).join('\n');
  }
  toJSON() {
    const commenstAsJSON = this.commentList.map(comment =>
      JSON.stringify(comment)
    );
    return `[${commenstAsJSON}]`;
  }
  static load(commentAsJson) {
    const comments = JSON.parse(commentAsJson);
    const commentList = new CommentList();
    comments.forEach(rawComment => {
      const { name, content, date } = rawComment;
      const comment = new Comment(name, content, date);
      commentList.addComment(comment);
    });
    return commentList;
  }
}

module.exports = {
  CommentList
};
