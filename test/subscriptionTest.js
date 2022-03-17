const assert = require('chai').assert;
const subscriptionController = require('../controllers/subscriptionController');

describe('Create Sub test', function () {
    it('createSubType() test', async function () {
        const data = { name: '3mdr', duration: '3', price: '100'};
        this.timeout(3000);
        const subType = await subscriptionController.createSubscriptionModel(data.name, data.duration, data.price);
        assert.equal(subType.name, data.name);
        assert.equal(subType.duration, data.duration);
        assert.equal(subType.mdrPrice, data.mdrPrice);
        //clean up
        subscriptionController.deleteSubscriptionModel(subType._id);
    });
});

//Test metode for delete subscription
describe('Delete sub test', function () {
    it('deleteSubType() test', async function () {
        const subType = await subscriptionController.createSubscriptionModel("test2", 3, 100000, true);
        console.log(subType._id);
        const result = await subscriptionController.deleteSubscriptionModel(subType._id);
        assert.exists(result, 'Exists');
    });
})