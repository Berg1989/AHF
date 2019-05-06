const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');
const bcrypt = require('bcryptjs');

describe('Controller test', function () {
    it('createUser() test', async function () {
        this.timeout(3000);
        const user = await controller.createUser("bergtest10@gmail.com", "123ab", "Danieltest", "Bergtest");
        const testpass = await bcrypt.compare("123ab", user.password);
        assert.equal(user.email, "bergtest10@gmail.com");
        assert.equal(user.info.firstname, "Danieltest");
        assert.equal(user.info.lastname, "Bergtest");
        assert.exists(await controller.findUser(user._id));
        assert.isTrue(testpass);
        await controller.deleteUser(user._id);
    });
    it('findUser() test', async function () {
        this.timeout(3000);
        const member = await controller.createUser("bergtest10@gmail.com", "123ab", "Danieltest", "Bergtest");
        const findMember = await controller.findUser(member._id);
        assert.exists(findMember);
        assert.equal(findMember.email, "bergtest10@gmail.com");
        assert.equal(findMember.info.firstname, "Danieltest")
        await controller.deleteUser(member._id);
    });
});

describe('POST /login', function () {
    it("Post valid login", function (done) {
        request(app)
        .post('/login')
        .send({ loginEmail: 'admin@mail.dk', LoginPassword: '123456'})
        .expect(302, done);
    });
});

