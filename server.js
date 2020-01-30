const http = require('http');
const { writeFileSync, existsSync } = require('fs');
const {
  err404,
  serveTemplate,
  guestBookHandler,
  serveStaticPage,
  dataStorePath
} = require('./lib/responseHandler');
const { Router } = require('./lib/router');

const dataStoreExists = existsSync(dataStorePath);
if (!dataStoreExists) writeFileSync(dataStorePath, '[]');

const router = new Router();

router.get('', serveStaticPage);
router.get('/', serveStaticPage);
router.get('/guest-book.html', serveTemplate);
router.post('/guest-book.html', guestBookHandler);

router.get('', err404);
router.post('', err404);

const ROUTER = router.serve.bind(router);

const server = http.Server(ROUTER);
server.listen(process.argv[2] || 8000);
