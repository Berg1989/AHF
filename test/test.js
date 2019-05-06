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
<<<<<<< HEAD
        await controller.deleteUser(user._id);
=======
        controller.deleteUser(member._id);
>>>>>>> 2ee879095eb9b517322aee126d772fb9f96045ab
    });
    it('findUser() test', async function () {
        this.timeout(3000);
        const member = await controller.createUser("bergtest10@gmail.com", "123ab", "Danieltest", "Bergtest");
        const findMember = await controller.findUser(member._id);
        assert.exists(findMember);
        assert.equal(findMember.email, "bergtest10@gmail.com");
        assert.equal(findMember.info.firstname, "Danieltest")
<<<<<<< HEAD
        await controller.deleteUser(member._id);
    });
});

=======
        controller.deleteUser(member._id);
    });
});


// Opretter et member, k¯rer findMemberById pÂ dette members id, og sammenligner derefter emails fra disse.
describe('Controller test', function () {
    it('findMemberById() test', async function () {
        this.timeout(3000);
        const member = await controller.createMember("bergtest10@gmail.com", "123ab", "Danieltest", "Bergtest");
        const findMember = await controller.findMemberById(member.id);
        assert.equal(findMember.email, member.email);
        controller.deleteUser(member._id);
    });
});

// Login med gyldig brugerinformation - IKKE KORREKT
describe('POST /login', function () {
    it("logs user in and redirects to '/profile/id='", function (done) {
        request(app)
            .post('/login')
            //.send({email: 'admin@mail.dk', password: '12345'})
            //.expect('Content-Type', "text/plain; charset=utf-8")
            .expect(302)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            })
    });
});

//login med ugyldig brugerinformation - IKKE KORREKT
>>>>>>> 2ee879095eb9b517322aee126d772fb9f96045ab
describe('POST /login', function () {
    it("Post valid login", function (done) {
        request(app)
        .post('/login')
        .send({ loginEmail: 'admin@mail.dk', LoginPassword: '123456'})
        .expect(302, done);
    });
});

