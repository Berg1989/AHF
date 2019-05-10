const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router



.get('/id=:id', async function (request, response) {
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