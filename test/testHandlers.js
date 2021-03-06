const { writeFile } = require('fs');
const request = require('supertest');
const { dataStorePath } = require('./../config');
const { app } = require('./../lib/app');

afterEach(done => {
  writeFile(dataStorePath, '[]', done);
});

describe('GET /', () => {
  it('should response back with index page', done => {
    request(app)
      .get('/')
      .set('Accept', 'text/html, text/css, application/script')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1221')
      .expect(/hideWaterPot/, done);
  });
});

describe('GET /abeliophyllum', () => {
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

describe('GET /ageratum', () => {
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

describe('GET /guest-book', () => {
  it('should response back with guest-book page', done => {
    request(app)
      .get('/guest-book.html')
      .set('Accept', 'text/html, text/css')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '769')
      .expect(/<title>Guest Book<\/title>/, done);
  });
});

describe('GET /bad', () => {
  it('should response back with file not found page', done => {
    request(app)
      .get('/bad')
      .expect(404, done);
  });
});

describe('GET /styles/styles.css', () => {
  it('should response back with styles.css', done => {
    request(app)
      .get('/styles/styles.css')
      .set('Accept', 'text/css')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-Length', '1162')
      .expect(/e-overflow/, done);
  });
});

describe('GET /js/index.css', () => {
  it('should response back with styles.css', done => {
    request(app)
      .get('/js/index.js')
      .set('Accept', 'application/script')
      .expect(200)
      .expect('Content-Type', 'application/script')
      .expect('Content-Length', '208')
      .expect(/Pot.classList.ad/, done);
  });
});

describe('POST /guest-book when there are no previous comments', () => {
  before(done => {
    writeFile(dataStorePath, '[]', done);
  });
  it('should response back with updated commentList', done => {
    request(app)
      .post('/guest-book.html')
      .send(`name=sukhiboi&content=I+am+awesome`)
      .set('Accept', 'text/html, text/css, application/script')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '984')
      .expect(/<title>Guest Book<\/title>/, done);
  });
});

describe('POST /guest-book when there are previous comments', () => {
  before(done => {
    const comment = {
      name: 'sukhiboi',
      content: 'I am always awesome',
      date: new Date()
    };
    writeFile(dataStorePath, `[${JSON.stringify(comment)}]`, done);
  });
  it('should response back with updated commentList', done => {
    request(app)
      .post('/guest-book.html')
      .send(`name=shankar&content=I+am+awesome`)
      .set('Accept', 'text/html, text/css, application/script')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1206')
      .expect(/I am always awesome/, done);
  });
});
