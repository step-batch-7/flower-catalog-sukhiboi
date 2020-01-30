const { readFileSync, writeFileSync, existsSync, statSync } = require('fs');

const fileExists = function(filename) {
  const stat = existsSync(filename) && statSync(filename);
  return stat && stat.isFile();
};

const loadContent = function(filename) {
  return readFileSync(filename);
};

const saveContent = function(filename, content) {
  writeFileSync(filename, content);
};

module.exports = {
  fileExists,
  loadContent,
  saveContent
};
