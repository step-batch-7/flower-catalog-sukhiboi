const { Comment } = require('./comment');

class Comments {
  constructor() {
    this.comments = [];
  }
  addComment(comment) {
    this.comments.unshift(comment);
  }
  toHTML() {
    return this.comments.map(comment => comment.toHTML()).join('\n');
  }
  toJSON() {
    const commenstAsJSON = this.comments.map(comment =>
      JSON.stringify(comment)
    );
    return `[${commenstAsJSON}]`;
  }
  static load(commentList) {
    const comments = new Comments();
    commentList.forEach(rawComment => {
      const { name, content, date } = rawComment;
      const comment = new Comment(name, content, date);
      comments.addComment(comment);
    });
    return comments;
  }
}

module.exports = {
  Comments
};
