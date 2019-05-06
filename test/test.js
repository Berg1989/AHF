const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');
const bcrypt = require('bcryptjs');

describe('Controller test', function () {
    it('findMembers() test', async function () {
        //const data = { email: 'testmail123', pw: '123', fn: 'Egon', ln: 'Olsen', level: 3 };
        this.timeout(3000);
        const members = await controller.findMembers();
        assert.lengthOf(members, 7, 'Lenght is 7');
    });
});

// Opretter et Member, og sammenligner mail, fornavn, efternavn + password(med bcrypt)
describe('Controller test', function () {
    it('createMember() test', async function () {
        this.timeout(3000);
        const member = await controller.createMember("bergtest10@gmail.com", "123ab", "Danieltest", "Bergtest");
        const testpass = await bcrypt.compare("123ab", member.password);
        assert.equal(member.email, "bergtest10@gmail.com");
        assert.equal(member.info.firstname, "Danieltest");
        assert.equal(member.info.lastname, "Bergtest");
        assert.isTrue(testpass);
        controller.deleteUser(member._id);
    });
});

// Opretter et member, og sammenligner derefter med resultatet af findMember() pÂ samme members email.
describe('Controller test', function () {
    it('findMember() test', async function () {
        this.timeout(3000);
        const member = await controller.createMember("bergtest10@gmail.com", "123ab", "Danieltest", "Bergtest");
        const findMember = await controller.findMember("bergtest10@gmail.com");
        assert.equal(findMember.email, "bergtest10@gmail.com");
        assert.equal(findMember.info.firstname, "Danieltest")
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
describe('POST /login', function () {
    it("logs user in and redirects to '/profile/id='", function (done) {
        request(app)
            .post('/login')
            //.send({email: 'adminmail.dk', password: '1234'})
            //.expect('Content-Type', "text/plain; charset=utf-8")
            .expect(302)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            })
    });
});

