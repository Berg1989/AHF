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
        res.render('public/puser', {
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
        const user = request.user;
        response.render('public/subscription', {
            metaTags: {
                title: 'AHF - Mit kontingent',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            subscriptionModels: await controller.findSubscriptionModels(),
            user: user
        });
    })

    //TODO: Change this method
    .post('/subscription', async (request, response) => {
        const user = request.session.user;
        if (user) {
            const model = await controller.findSubscriptionModel(request.body.subscriptionModel);
            const today = new Date();
            const start = new Date().toDateString();
            const end = new Date(today.setMonth(today.getMonth() + parseInt(model.duration))).toDateString();

            const newSub = await controller.createSubscription(user._id, start, end, true, model._id);
            const result = await controller.connectSubToUser(newSub._id, user._id);

            if (result) {
                request.flash('success', 'Success')
                response.redirect('/user');
            }
        }
    })

    .post('/unsubscribe', async (request, response) => {
        const user = request.user;
        if (user && user.subscription) {
            const result = await controller.unsubscribe(user.subscription);
            if (result) {
                request.flash('success', 'Success');
                response.redirect('/user');
            }
        }
    })

    .post('/email', validate.userChangeEmail, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('/user');
        } else {
            const { pw, newEmail } = request.body;
            const result = await controller.updateUserEmail(request.session.user._id, newEmail);
            if (result) {
                request.flash('success', 'Success');
                response.redirect('/user');
            }
        }
    })

    .post('/pw', validate.userChangePassword, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());            
            response.redirect('/user');
        } else {
            const { oldpw, newpw } = request.body;
            const result = await controller.updateUserPassword(request.session.user._id, newpw);
            if (result) {
                request.flash('success', 'Success');                
                response.redirect('/user');
            }
        }
    })

    .get('/events', auth.isLoggedIn, async (request, response) => {
        const user = request.user;
        response.render('public/personalEvents', {
            metaTags: {
                title: 'AHF - Mine events',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
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
