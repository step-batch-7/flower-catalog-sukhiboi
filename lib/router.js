const matchRoute = function(req, route) {
  if (route.type == 'middleware') return true;
  const pathEquality = req.url == route.path || req.url.match(route.path);
  const methodEquality = req.method === route.method;
  return methodEquality && pathEquality;
};

const looger = function(req) {
  console.log(`${req.method}  ${req.url}`);
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
    looger(req);
    const matchingRoutes = this.routes.filter(route => matchRoute(req, route));
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
