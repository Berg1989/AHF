const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');


router

    .get('/', async (request, response) => {
        const user = request.session.user;
        response.render('public/events', {
            user: user,
            errors: request.session.errors,
            success: request.session.success,
            events: await controller.findEvents(user),
        });
        request.session.success = null;
        request.session.errors = null;
    })

    .post('/:id/signup', async (request, response) => {
        const user = request.session.user;
        try {
            if (await controller.eventSignUp(request.params.id, user._id)) {
                request.session.success = { msg: 'Tilmelding oprettet' };
                response.redirect('back');
            }
        } catch (err) {
            request.session.errors = { msg: 'Der skete en fejl!' };
            response.redirect('back');
        }
    })


module.exports = router;