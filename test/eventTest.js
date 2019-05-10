const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');

describe('eventSignUp test', function () {
    it('eventSignUp() test', async function () {
        const data = { email: 'hej@gmail.com', password: '12345', firstname: 'Hans', lastname: 'Hansen'};
        const user = controller.createUser(data.email, data.password, data.firstname, data.lastname);
        
    })
})