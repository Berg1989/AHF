const eventController = require("../../controllers/eventController");
const express = require('express');
const router = express.Router();

router

    .get('/', async (request, response) => {
        const user = request.user;
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('public/events', {
            metaTags: {
                title: 'AHF - Begivenheder',
                description: 'User login page',
                keywords: 'Login and stuff'
            },
            user: user,
            events: await eventController.findEvents(user),
            messages: { errors, success }
        });

    })

    .post('/:id/signUp', async (request, response) => {
        const user = request.user
        const event = await eventController.findEvent(request.params.id);
        const maxparticipants = event.maxparticipants;
        const participantsLength = maxparticipants - event.participants.length;
        let exists = false;
        for (let i = 0; i < event.participants.length && !exists; i++) {
            if (JSON.stringify(event.participants[i]) === JSON.stringify(user._id)) {
                exists = true;
            }
        }
        if (exists) {

            request.flash('error', [{ msg: 'Du er allerede tilmeldt denne begivenhed' }]);
            response.redirect('/events');
        }
        else if (participantsLength == 0) {
            request.flash('error', [{ msg: 'Der er ikke flere pladser på denne begivenhed' }]);
            response.redirect('/events');
        }
        else {
            try {
                if (await eventController.eventSignUp(request.params.id, user._id)) {
                    request.flash('success', 'Tilmelding gennemført');
                    response.redirect('/user/events');
                } else {
                    request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                    response.redirect('back');
                }
            } catch (err) {

            }
        }
    })

    .get('/:id', async function (request, response) {
        const event = await eventController.findEvent(request.params.id);
        const maxparticipants = event.maxparticipants;
        const participantsLength = maxparticipants - event.participants.length;
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('public/eventView', {
            metaTags: {
                title: 'AHF - ' + event.headline,
                description: 'User login page',
                keywords: 'Login and stuff'
            },
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