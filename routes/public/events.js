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
                response.redirect('/events');
            }
        } catch (err) {
            request.session.errors = { msg: 'Der skete en fejl!' };
            response.redirect('back');
        }
    })

.get('/:id', async function (request, response) {
        const event = await controller.findEvent(request.params.id); 
        const maxparticipants = event.maxparticipants;
        const participantsLength = maxparticipants - event.participants.length;
        
    response.locals.metaTags = {
        title: 'Login',
        description: 'Here goes the description',
        keywords: 'Here goes keywords'
    };
    response.render('public/eventView', {
        action: '/eventView',
        events: event,
        success: request.session.success,
        errors: request.session.errors,
        inputs: request.session.inputs,
        ticket: participantsLength,
        user: request.session.user
        
    });
    request.session.errors = null;
    request.session.inputs = null;
    request.session.success = null;
})



module.exports = router;