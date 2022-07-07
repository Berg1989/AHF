const assert = require('chai').assert;
const subscriptionModelController = require('../controllers/subscriptionModelController');

describe('Create Sub test', function () {
    it('createSubType() test', async () => {
        const data = { name: '3mdr', duration: '3', price: '100'};
        this.timeout(3000);
        const subType = await subscriptionModelController.createSubscriptionModel(data.name, data.duration, data.price);
        assert.equal(subType.name, data.name);
        assert.equal(subType.duration, data.duration);
        assert.equal(subType.mdrPrice, data.mdrPrice);
        //clean up
        subscriptionModelController.deleteSubscriptionModel(subType._id);
    });
});

//Test metode for delete subscription
describe('Delete sub test', () => {
    it('deleteSubType() test', async () => {
        const subType = await subscriptionModelController.createSubscriptionModel("test2", 3, 100000, true);
        console.log(subType._id);
        const result = await subscriptionModelController.deleteSubscriptionModel(subType._id);
        assert.exists(result, 'Exists');
    });
})