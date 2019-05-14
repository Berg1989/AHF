const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');

describe('eventSignUp test', function () {
    it('eventSignUp() test', async function () {
        const userData = { email: 'bla@gmail.com', password: '12345', firstname: 'Hans', lastname: 'Hansen', usertype: '5cd04bc81c9d4400009071ce', func: 'bla' };
        const eventData = { headline: 'bla', author: 'Danmark', startdate: '2019-05-06', enddate: '2019-07-11', body: 'Hejsa', deadline: '2019-05-09', maxparticipants: 11, price: 1005 };

        const event = await controller.createEvent(eventData.headline, eventData.author, eventData.startdate, eventData.enddate, eventData.body, eventData.deadline, eventData.price)
        const user = await controller.createUser(userData.email, userData.password, userData.firstname, userData.lastname, userData.usertype, userData.func);

        const result = await controller.eventSignUp(event._id, user._id);

        assert.isObject(await controller.findUserInEvent(user._id, event._id));

        assert.isObject(await controller.deleteUser(user._id));
        assert.isObject(await controller.deleteEvent(event._id));

    })
})

describe('eventSignOff test', function () {
    it('eventSignOff() test', async function () {
        const userData = { email: 'bla@gmail.com', password: '12345', firstname: 'Hans', lastname: 'Hansen', usertype: '5cd04bc81c9d4400009071ce', func: 'bla' };
        const eventData = { headline: 'bla', author: 'Danmark', startdate: '2019-05-06', enddate: '2019-07-11', body: 'Hejsa', deadline: '2019-05-09', maxparticipants: 11, price: 1005 };

        const event = await controller.createEvent(eventData.headline, eventData.author, eventData.startdate, eventData.enddate, eventData.body, eventData.deadline, eventData.price)
        const user = await controller.createUser(userData.email, userData.password, userData.firstname, userData.lastname, userData.usertype, userData.func);
        
        assert.isObject(await controller.eventSignUp(event._id, user._id));
        assert.lengthOf(await controller.findUserEvents(user._id), 1);
        assert.isObject(await controller.eventSignOff(event._id, user._id));
        assert.lengthOf(await controller.findUserEvents(user._id), 0);

        assert.isObject(await controller.deleteUser(user._id));
        assert.isObject(await controller.deleteEvent(event._id));
    })
})