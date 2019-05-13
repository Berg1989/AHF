const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');

describe('eventSignUp test', function () {
    it('eventSignUp() test', async function () {
        const userData = { email: 'hej@gmail.com', password: '12345', firstname: 'Hans', lastname: 'Hansen', usertype: '5cd04ba11c9d4400009071cd'};
        const eventData = { headline: 'DanskeJevle', author: 'Danmark', startdate: '2019-05-06', enddate: '2019-07-11', body: 'Hejsa' , deadline: '2019-05-09', maxparticipants: 11, price: 1005};
        
        const event = controller.createEvent(eventData.headline, eventData.author, eventData.startdate, eventData.enddate, eventData.body, eventData.deadline, eventData.price)
        const user = controller.createUser(userData.email, userData.password, userData.firstname, userData.lastname, userData.usertype);
        
        const result = await controller.eventSignUp(event.id, user.id);

        assert.include(event, user)

        await controller.deleteUser(user);
        await controller.deleteEvent(event);
    })
})