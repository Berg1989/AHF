const assert = require('chai').assert;
const loginController = require('../controllers/loginController');
const userController = require('../controllers/userController');

//TC_1
describe('reset password test', function () {
    it('resetPassword() test', async function () {
        const data = {email: "fs@test.dk", password: "kode", firstname: "Lars", lastname: "Larsen", usertype: "5cd04ba11c9d4400009071cd"};
        const user = await userController.createUser(data.email, data.password, data.lastname, data.firstname, data.usertype);
        await loginController.resetPassword(user.id);
        assert.notEqual(data.password, user.password, 'Success, new password created');
        //clean up
        await userController.deleteUser(user._id);
    });
});

//TC_2
describe('delete user test', function () {
    it('deleteUser() test', async function () {
        const data = {email: "deleteUser@test.dk", password: "delete", firstname: "Delete", lastname: "User", usertype: "5cd04ba11c9d4400009071cd"};
        const user = await userController.createUser(data.email, data.password, data.lastname, data.firstname, data.usertype);
        const result = await userController.deleteUser(user._id);
        assert.exists(result, 'Exists');
    })
});