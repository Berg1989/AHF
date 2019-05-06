const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');

describe('Create Sub test', function () {
    it('createSubType() test', async function () {
        const data = { name: '3mdr', duration: '3', price: '100', active: true };
        this.timeout(3000);
        const subType = await controller.createSubscriptionModel(data.name, data.duration, data.price, data.active);
        assert.equal(subType.name, data.name);
        assert.equal(subType.duration, data.duration);
        assert.equal(subType.mdrPrice, data.mdrPrice);
        assert.equal(subType.active, data.active);
    });
});

//Test metode for delete subscription
describe('Delete sub test', function () {
    it('deleteSubType() test', async function () {
        const subType = await controller.createSubscriptionModel("test2", 3, 100000, true);
        console.log(subType._id);
        const result = await controller.deleteSubscriptionModel(subType._id);
        assert.exists(result, 'Exists');
    });
})