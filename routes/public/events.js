const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');


router

    .get('/', async (request, response) => {
        const user = request.user;
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('public/events', {
            user: user,
            events: await controller.findEvents(user),
            messages: { errors, success }
        });

    })

    .post('/:id/signUp', async (request, response) => {
        const user = request.user
        const event = await controller.findEvent(request.params.id);
        const maxparticipants = event.maxparticipants;
        const participantsLength = maxparticipants - event.participants.length;
        const exists = false;
        for (let i = 0; i < event.participants.length && !exists; i++) {
            if (event.participants[i] == user._id) {
                exists = true;
            }
        }
        if (exists) {
            
            request.flash('error', [{ msg:'Du er allerede tilmeldt denne begivenhed'}]);
            response.redirect('/user/events');
        } 
        else if(participantsLength == 0){
            request.flash('error', [{ msg:'Der er ikke flere pladser på denne begivenhed'}]);
            response.redirect('/user/events');
        }
        else {
            try {
                if (await controller.eventSignUp(request.params.id, user._id)) {
                    request.flash('success', 'Tilmelding gennemført');
                    response.redirect('/user/events');
                } else{
                    request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                    response.redirect('back');
                }
            } catch (err) {

            }
        }
    })

    .get('/:id', async function (request, response) {
        const event = await controller.findEvent(request.params.id);
        const maxparticipants = event.maxparticipants;
        const participantsLength = maxparticipants - event.participants.length;
        const errors = request.flash('error');
        const success = request.flash('success');

        response.locals.metaTags = {
            title: 'Login',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('public/eventView', {
            action: '/eventView',
            events: event,
            messages: { errors, success },
            inputs: request.session.inputs,
            ticket: participantsLength,
            user: request.user

        });
        request.session.inputs = null;
    })





module.exports = router;