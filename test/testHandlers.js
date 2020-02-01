const request = require('supertest');
const { app } = require('./../lib/app');

describe('#GET /', () => {
  it('should response back with index page', done => {
    request(app)
      .get('/')
      .set('Accept', 'text/html, text/css, application/js')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1221')
      .expect(/hideWaterPot/, done);
  });
});

describe('#GET /abeliophyllum', () => {
  it('should response back with abeliophyllum page', done => {
    request(app)
      .get('/abeliophyllum.html')
      .set('Accept', 'text/html, text/css')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1795')
      .expect(/distichum/, done);
  });
});

describe('#GET /ageratum', () => {
  it('should response back with ageratum page', done => {
    request(app)
      .get('/ageratum.html')
      .set('Accept', 'text/html, text/css')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1574')
      .expect(/perennials/, done);
  });
});

describe('#GET /guest-book', () => {
  it('should response back with guest-book page', done => {
    request(app)
      .get('/guest-book.html')
      .set('Accept', 'text/html, text/css')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1602')
      .expect(/<title>Guest Book<\/title>/, done);
  });
});
