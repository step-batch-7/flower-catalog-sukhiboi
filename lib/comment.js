class Comment {
  constructor(name, content, date) {
    this.name = name;
    this.content = content;
    this.date = date;
  }

  toHTML() {
    const html = `
    <div class='comment'>
      <span>
       Commented by <span class="name">${this.name}</span>
       on
       <span class="time">${new Date(this.date).toLocaleString()}</span>
       </span>
      <p>${this.content}</p>
    </div>
    `;
    return html;
  }
}

module.exports = {
  Comment
};
