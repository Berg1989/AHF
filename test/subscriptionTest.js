const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');

describe('Create Sub test', function() {
    it('createSubType() test', async function () {
        const data = { name: '3mdr', duration: '5', mdrPrice: '100'  };
        this.timeout(3000);
        const subType = await controller.createSubType(data.name, data.duration, data.mdrPrice); 
        const fromdb = await controller.findSubType(data.name);
        assert.equal(subType.name, data.name);
        assert.equal(subType.duration, data.duration);
        assert.equal(subType.mdrPrice, data.mdrPrice);
    });
});

//Test metode for delete subscription
describe('Delete sub test', function() {
    it('deleteSubType() test', async function() {
        const data = { name: '3mdr', duration: '5', mdrPrice: '100'  };
        const subType = await controller.createSubType(data.name, data.duration, data.mdrPrice);
        const created = await controller.findSubType(data.name);
        //assert.exists(created, 'Findes den i db?');
        //const result = await controller.deleteSubType(subType._id);
        //assert.exists(result, 'Exists');
        assert.notExists(await controller.findSubType(data.name), 'Not exists');
    });
})