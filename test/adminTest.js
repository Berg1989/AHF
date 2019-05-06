const app = require('../app.js');
const assert = require('chai').assert;
const controller = require('../controllers/controller');
const request = require('supertest');

//TC_1
describe('reset password test', function () {
    it('resetPassword() test', async function () {
        const data = {email: "fs@test.dk", password: "kode", firstname: "Lars", lastname: "Larsen", title: "Hej", level: 3, func: "Test"};
        const user = await controller.createUser(data.email, data.password, data.firstname, data.lastname, data.title, data.level, data.func);
        await controller.resetPassword(user.id);
        assert.notEqual(data.password, user.password, 'Success, new password created');
        //clean up
        await controller.deleteUser(user._id);
    });
});

//TC_2
describe('delete user test', function () {
    it('deleteUser() test', async function () {
        const user = await controller.createUser("borge@gmail.com", "12345", "Børge", "Jensen", "member", 3, "testcase");
        const result = await controller.deleteUser(user._id);
        assert.exists(result, 'Exists');
    })
});
