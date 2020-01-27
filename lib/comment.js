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
  Comment
};
