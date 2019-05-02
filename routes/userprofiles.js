const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router

    .get('/', async function (request, response) {
        const user = request.session.user;
        /* if (user && user.type.level == 1) { */
        response.render('admin/userprofiles', {
            success: request.session.success,
            errors: request.session.errors,
            user: request.session.user });
        request.session.errors = null;
        /* } else {
            response.redirect('/');
        } */
        const result = await controller.resetPassword("entestmail@ff.dd");
    })

    .get('/:searchid', async (request, response) => {
        /* const user = request.session.user;
        if (user && user.type.level == 1) { */
        response.json(await controller.findMembersByText(request.params.searchid));
        /* } else {
            response.redirect('/');
        } */
    })

    .put('/', async function (request, response) {
        let password = await controller.resetPassword(request.body._id);
        response.send(password);
        // nedenstående er fjernet da jeg vil gå hen til label fremfor alert
        // request.session.resetPasswordErr = [{ message: password }]
        response.redirect('/admin/userprofiles');
    })



module.exports = router;