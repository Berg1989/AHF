const assert = require('chai').assert;
const controller = require('../controllers/controller');

describe('Controller test', function() {
    it('createMember() test', async function (done) {
        //const data = { email: 'testmail123', pw: '123', fn: 'Egon', ln: 'Olsen', level: 3 };
        this.timeout(5000);
        setTimeout(done, 5000);
        const members = await controller.findMember('traeholt@live.dk');
        assert.lengthOf(members, 5, 'Lenght is 5');
    });
});