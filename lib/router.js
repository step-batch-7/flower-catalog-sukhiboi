const getMatchingRoutes = function(req, routes) {
  const matchingRoutes = routes.filter(route => {
    if (route.type == 'middleware') return true;
    const pathEquality = req.url == route.path || req.url.match(route.path);
    const methodEquality = req.method === route.method;
    return methodEquality && pathEquality;
  });
  return matchingRoutes;
};

class Router {
  constructor() {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }
  use(middleware) {
    this.routes.push({ handler: middleware, type: 'middleware' });
  }
  serve(req, res) {
    const matchingRoutes = getMatchingRoutes(req, this.routes);
    const next = function() {
      const route = matchingRoutes.shift();
      route.handler(req, res, next);
    };
    next();
  }
}

module.exports = {
  Router
};
