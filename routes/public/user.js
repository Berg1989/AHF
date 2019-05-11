const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const controller = require("../../controllers/controller");
const validate = require('../../middleware/validations');
const auth = require('../../middleware/authentications');


/*
User routes:
    /info
    /events
    /subscription
*/

router
    .get('/', auth.isLoggedIn, (request, response) => {
        const user = request.user;
        response.render('public/user', {
            metaTags: {
                title: 'AHF - ' + user.firstname,
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            user: request.user
        });
    })

    .get('/logout', function (req, res, next) {
        req.logout();
        res.redirect('/user/login');
    })

    .get('/info', auth.isLoggedIn, function (req, res, next) {
        const errors = req.flash('error');
        const success = req.flash('success');
        const user = req.user;
        res.render('public/user-info', {
            user: user,
            messages: { errors, success },
            metaTags: {
                title: 'AHF - ' + user.info.firstname,
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
        });
    })

    .post('/:id/info/', validate.userinfo, async (request, response, next) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('/user/info');
        } else {
            const { firstname, lastname, birth, phone, zipcode, street } = request.body;
            try {
                const result = await controller.updateUserInfo(request.params.id, firstname, lastname, birth, phone, zipcode, street, request.user.info.func);

                if (result) {
                    request.flash('success', 'Success');
                    response.redirect('/user/info');
                }
            } catch (err) {
                request.flash('error', 'UPS der skete en fejl');
                response.redirect('/user/info');
                console.log(err);
            }

        }
    })

    .get('/subscription', auth.isLoggedIn, async (request, response) => {
        const user = await controller.findUser(request.user._id);
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('public/user-subscription', {
            metaTags: {
                title: 'AHF - Mit kontingent',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            messages: { errors, success },
            subscriptionModels: await controller.findSubscriptionModels(),
            currentSub: await controller.findSubscription(user.subscription),
            user: user
        });
    })

    //TODO: Change this method
    .post('/:id/subscription', async (request, response) => {
        const user = await controller.findUser(request.params.id);
        if (user) {
            const model = await controller.findSubscriptionModel(request.body.modelId);
            const today = new Date();
            const start = today.toDateString();
            const end = new Date(today.setMonth(today.getMonth() + parseInt(model.duration))).toDateString();

            const newSub = await controller.createSubscription(model, start, end);
            const result = await controller.connectSubToUser(user._id, newSub._id);

            if (result && newSub) {
                request.flash('success', 'Success - Dit kontingent er aktiveret')
                response.redirect('/user/subscription');
            } else {
                request.flash('error', 'Ups der skete en fejl')
                response.redirect('/user/subscription');
            }
        } else {
            response.sendStatus(404);
        }
    })

    .post('/:id/update-subscription', async (request, response) => {
        const user = await controller.findUser(request.params.id);
        if (user) {
            const model = await controller.findSubscriptionModel(request.body.modelId);
            const today = new Date();
            const start = today.toDateString();
            const end = new Date(today.setMonth(today.getMonth() + parseInt(model.duration))).toDateString();

            const result = await controller.updateSubsciption(user.subscription, start, end, model._id);

            if (result) {
                request.flash('success', 'Success - Dit kontingent er aktiveret')
                response.redirect('/user/subscription');
            } else {
                request.flash('error', 'Ups der skete en fejl')
                response.redirect('/user/subscription');
            }
        } else {
            response.sendStatus(404);
        }
    })

    .post('/:id/change-email', validate.userChangeEmail, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('/user/info');
        } else {
            const email = request.body.newEmail;
            const result = await controller.updateUserEmail(request.params.id, email);
            if (result) {
                request.flash('success', 'Success - din email blev opdateret');
                response.redirect('/user/info');
            } else {
                request.flash('error', 'Ups der skete en fejl');
                response.redirect('/user/info');
            }
        }
    })

    .post('/:id/change-password', validate.userChangePassword, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('/user/info');
        } else {
            const password = request.body.newpw;
            const result = await controller.updateUserPassword(request.params.id, password);
            if (result) {
                request.flash('success', 'Success - dit password blev opdateret');
                response.redirect('/user/info');
            } else {
                request.flash('error', 'Ups der skete en fejl');
                response.redirect('/user/info');
            }
        }
    })

    .get('/events', auth.isLoggedIn, async (request, response) => {
        const user = request.user;
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('public/user-events', {
            metaTags: {
                title: 'AHF - Mine events',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            messages: { errors, success },
            events: await controller.findUserEvents(user._id),
            user: user
        });
    })

    .post('/events/eventid=:id/remove', async (request, response) => {
        const event = request.params.id;
        const user = request.user;
        try {
            if (await controller.eventSignOff(event, user._id)) {
                response.redirect('back');
            }
        } catch (err) {
            response.sendStatus(405);
        }
    });

module.exports = router;
