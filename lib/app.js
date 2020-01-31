const {
  err404,
  serveTemplate,
  guestBookHandler,
  serveStaticPage
} = require('./handlers');
const { bodyParser } = require('./middlewares');
const { Router } = require('./router');

const router = new Router();

router.use(bodyParser);

router.get('', serveStaticPage);
router.get('/', serveStaticPage);
router.get('/guest-book.html', serveTemplate);
router.post('/guest-book.html', guestBookHandler);

router.get('', err404);
router.post('', err404);

const app = router.serve.bind(router);

module.exports = {
  app
};
