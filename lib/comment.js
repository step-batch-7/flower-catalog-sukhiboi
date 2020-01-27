const formatTime = function(time) {
  return time.toString().padStart(2, '0');
};

const generateDate = function() {
  const date = new Date();
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
    this.date = generateDate();
  }

  static convertToHTML(comment) {
    const html = `<div class='comment'>
        <span> Commented by <span class="name">${comment.name}</span> on <span class="time">${comment.date}</span></span>
        <p>${comment.content}</p>
    </div>`;
    return html;
  }
}

module.exports = {
  Comment
};
