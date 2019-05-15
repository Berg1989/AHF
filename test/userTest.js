const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');

describe('User-Controller test', function () {
    it('createUser() test', async function () {
        this.timeout(3000);
        const user = await controller.createUser("bergtest10@gmail.com", "123ab", "Danieltest", "Bergtest", '5cd04bc81c9d4400009071ce', 'Medlem');
        
        assert.isTrue(await controller.checkPassword('123ab', user.password));
        assert.equal(user.email, "bergtest10@gmail.com");
        assert.equal(user.info.firstname, "Danieltest");
        assert.equal(user.info.lastname, "Bergtest");
        assert.isObject(await controller.findUser(user));

        assert.isObject(await controller.deleteUser(user));
    });
});

describe('POST /user/login', function () {
    it("No CSRF token", function (done) {
        request(app)
        .post('/user/login')
        .send({ email: 'admin@mail.dk', password: '12345'})
        .expect(403, done);
    });
});

