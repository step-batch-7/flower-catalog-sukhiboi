const formatCommentMessages = function() {
  const comments = document.querySelectorAll('.comment p');
  comments.forEach(comment => {
    comment.innerText = decodeURIComponent(comment.innerText);
  });
};
