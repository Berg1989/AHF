const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router

    .get('/', function (request, response) {
        response.render('userprofiles', { success: request.session.success, errors: request.session.errors, user: request.session.user });
        request.session.errors = null;
    })

    .get('/:searchid', async (request, response) => {
        response.json(await controller.findMembersByText(request.params.searchid));
    })

    .put('/', async function (request, response) {
        let password = await controller.resetPassword(request.body.email);
        response.send(password);
        request.session.resetPasswordErr = [{ message: password }]
        response.redirect('/userprofiles');
    })



module.exports = router;