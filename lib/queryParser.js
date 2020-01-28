const parseQueryValue = function(value) {
  return value.split('+').join(' ');
};

const parseQuery = function(queryText) {
  if (queryText === '') return {};
  const info = queryText.split('?');
  const pairs = info[0].split('&');

  const query = pairs.reduce((query, pair) => {
    const [key, value] = pair.split('=');
    query[key] = parseQueryValue(value);
    return query;
  }, {});

  return query;
};

module.exports = {
  parseQuery
};
