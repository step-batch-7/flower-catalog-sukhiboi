const request = require('supertest');
const { app } = require('./../lib/app');

describe('#GET /()', () => {
  it('should response back with index page', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'text/html, text/css, application/js')
      .expect(200, done)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1221')
      .expect(/hideWaterPot/);
  });
});
