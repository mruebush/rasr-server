var request = require('supertest');

var app = require('../../server/main/app.js');

describe('GET /api/doesthiswork', function() {
  it('responds with 404', function(done) {
    request(app)
      .get('/api/doesthiswork')
      .expect(404)
      .end(function(err, res) {
        if (err) throw err;
      })
  })
})