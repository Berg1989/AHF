const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');

describe('Create event test', function () {
    it('createEvent() test', async function () {
        const data = { headline: 'Dagens mand maraton', author: 'Ludvig', startdate: '2019-05-30', enddate: '2019-05-31', body: 'så er det tid igen venner', deadline: '2019-05-29', maxparticipants: '50', price: '120' };
        this.timeout(3000);
        const event = await controller.createEvent(data.headline, data.author, data.startdate, data.enddate, data.body, data.deadline, data.maxparticipants, data.price);
        assert.equal(event.headline, data.headline);
        assert.equal(event.author, data.author);
        assert.equal(event.startdate, data.startdate);
        assert.equal(event.enddate, data.enddate);
        assert.equal(event.body, data.body);
        assert.equal(event.deadline, data.deadline);
        assert.equal(event.maxparticipants, data.maxparticipants);
        assert.equal(event.price, data.price);
        //clean up
        controller.deleteEvent(event._id);
    });
});

describe('Create post test', function () {
    it('createPost() test', async function () {
        const data = { body: 'Pas på! Der er mudder på banen', headline: 'Advarsel', author: 'Alfred'};
        this.timeout(3000);
        const post = await controller.createPost(data.headline, data.body, data.author);
        assert.equal(post.headline, data.headline);
        assert.equal(post.body, data.body);
        assert.equal(post.author, data.author);
        //clean up
        controller.deletePost(post._id);
    });
});

describe('Delete event test', function () {
    it('deleteEvent() test', async function () {
        const event = await controller.createEvent('Prinsesse dansen', 'Ulrik', '2019-06-29', '2019-06-30', 'den årlige prinsesse dans skal nu igang igen', '2019-06-20', '1200', '3499');
        console.log(event._id);
        const result = await controller.deleteEvent(event._id);
        assert.exists(result, 'Exists');
    });
})

describe('Delete post test', function () {
    it('deletePost() test', async function () {
        const post = await controller.createPost('vi er løbet tør fot kugler', 'overskriften siger det hele', 'Bo');
        console.log(post._id);
        const result = await controller.deletePost(post._id);
        assert.exists(result, 'Exists');
    });
})