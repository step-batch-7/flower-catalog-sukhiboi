const http = require('http');
const { fileExists, saveContent } = require('./lib/fileOperations');
const {
  err404,
  serveTemplate,
  guestBookHandler,
  serveStaticPage
} = require('./lib/handlers');
const { bodyParser } = require('./lib/middlewares');
const { dataStorePath, PORT } = require('./config.js');
const { Router } = require('./lib/router');

const dataStoreExists = fileExists(dataStorePath);
if (!dataStoreExists) saveContent(dataStorePath, '[]');

const router = new Router();

router.use(bodyParser);

router.get('', serveStaticPage);
router.get('/', serveStaticPage);
router.get('/guest-book.html', serveTemplate);
router.post('/guest-book.html', guestBookHandler);

router.get('', err404);
router.post('', err404);

const ROUTER = router.serve.bind(router);

const server = http.Server(ROUTER);
server.listen(PORT);
