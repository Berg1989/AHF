const app = require('../app.js');
const assert = require('chai').assert;
const request = require('supertest');
const controller = require('../controllers/controller');

describe('POST /login', function () {
    it("logs user in and redirects to '/profile/id='", function (done) {
        request(app)
            .post('/login')
            .send({ email: 'admin@mail.dk', password: '12345' })
            .expect(302)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            })
    });
});