const assert = require('chai').assert;
const eventController = require('../controllers/eventController');
const userController = require('../controllers/userController');

describe('eventSignUp test', function () {
    it('eventSignUp() test', async function () {
        const userData = { email: 'bla@gmail.com', password: '12345', firstname: 'Hans', lastname: 'Hansen', usertype: '5cd04bc81c9d4400009071ce', func: 'bla' };
        const eventData = { headline: 'bla', author: 'Danmark', startdate: '2019-05-06', enddate: '2019-07-11', body: 'Hejsa', deadline: '2019-05-09', maxparticipants: 11, price: 1005 };

        const event = await eventController.createEvent(eventData.headline, eventData.author, eventData.startdate, eventData.enddate, eventData.body, eventData.deadline, eventData.price)
        const user = await userController.createUser(userData.email, userData.password, userData.firstname, userData.lastname, userData.usertype, userData.func);

        const result = await eventController.eventSignUp(event._id, user._id);

        assert.isObject(await eventController.findUserInEvent(user._id, event._id));

        assert.isObject(await userController.deleteUser(user._id));
        assert.isObject(await eventController.deleteEvent(event._id));

    })
})

describe('eventSignOff test', function () {
    it('eventSignOff() test', async function () {
        const userData = { email: 'bla@gmail.com', password: '12345', firstname: 'Hans', lastname: 'Hansen', usertype: '5cd04bc81c9d4400009071ce', func: 'bla' };
        const eventData = { headline: 'bla', author: 'Danmark', startdate: '2019-05-06', enddate: '2019-07-11', body: 'Hejsa', deadline: '2019-05-09', maxparticipants: 11, price: 1005 };

        const event = await eventController.createEvent(eventData.headline, eventData.author, eventData.startdate, eventData.enddate, eventData.body, eventData.deadline, eventData.price)
        const user = await userController.createUser(userData.email, userData.password, userData.firstname, userData.lastname, userData.usertype, userData.func);
        
        assert.isObject(await eventController.eventSignUp(event._id, user._id));
        assert.lengthOf(await eventController.findUserEvents(user._id), 1);
        assert.isObject(await eventController.eventSignOff(event._id, user._id));
        assert.lengthOf(await eventController.findUserEvents(user._id), 0);

        assert.isObject(await userController.deleteUser(user._id));
        assert.isObject(await eventController.deleteEvent(event._id));
    })
})