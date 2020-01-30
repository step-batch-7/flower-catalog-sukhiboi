const bodyParser = function(req, res, next) {
  let content = '';
  req.on('data', data => {
    content += data;
  });
  req.on('end', () => {
    req.body = content;
    next();
  });
};

module.exports = {
  bodyParser
};
