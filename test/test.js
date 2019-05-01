const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');

describe('Controller test', function() {
    it('findMembers() test', async function () {
        //const data = { email: 'testmail123', pw: '123', fn: 'Egon', ln: 'Olsen', level: 3 };
        this.timeout(3000);
        const members = await controller.findMembers();
        assert.lengthOf(members, 6, 'Lenght is 7');
    });
});