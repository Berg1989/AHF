const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator/check');
const userController = require('../../controllers/userController');
const eventController = require('../../controllers/eventController');
const subscriptionController = require('../../controllers/subscriptionController');
const validate = require('../../middleware/validations');
const auth = require('../../middleware/authentications');

router
    .get('/', auth.isLoggedIn, (request, response) => {
        response.render('public/user', {
            metaTags: {
                title: 'AHF - ' + request.user.info.firstname,
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            user: request.user
        });
    })

    .get('/logout', auth.isLoggedIn, function (req, res, next) {
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

    .post('/:id/info/', auth.isLoggedIn, validate.userinfo, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array());
            res.redirect('/user/info');
        } else {
            const { firstname, lastname } = req.body;
            try {
                const user = await userController.findUser(req.user);
                const result = await userController.updateUserInfo(req.params.id, firstname, lastname, user.info.comments, user.info.isLegalAge, user.info.func);

                if (result) {
                    req.flash('success', 'Success');
                    res.redirect('/user/info');
                }
            } catch (err) {
                req.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                res.redirect('/user/info');
            }

        }
    })

    .get('/subscription', auth.isLoggedIn, async (req, res) => {
        const user = await userController.findUser(req.user._id);
        const errors = req.flash('error');
        const success = req.flash('success');
        const userSub = await subscriptionController.findSubscription(user.subscription)
        res.render('public/user-subscription', {
            metaTags: {
                title: 'AHF - Mit kontingent',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            messages: { errors, success },
            subscriptionModels: await subscriptionController.findSubscriptionModels(),
            currentSub: userSub ? userSub : false,
            user: user
        });
    })

    .post('/:id/subscription', auth.isLoggedIn, async (req, res) => {
        const user = await userController.findUser(req.params.id);
        if (user) {
            const model = await subscriptionController.findSubscriptionModel(req.body.modelId);
            const newSub = await subscriptionController.createSubscription(user, model);
            const result = await userController.connectSubToUser(user._id, newSub._id);

            if (result && newSub) {
                req.flash('success', 'Success - Dit kontingent er aktiveret')
                res.redirect('/user/subscription');
            } else {
                req.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                res.redirect('/user/subscription');
            }
        } else {
            res.sendStatus(404);
        }
    })

    .post('/:id/change-email',auth.isLoggedIn, validate.userChangeEmail, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array());
            res.redirect('/user/info');
        } else {
            const email = req.body.newEmail;
            const result = await userController.updateUserEmail(req.params.id, email);
            if (result) {
                req.flash('success', 'Success - din email blev opdateret');
                res.redirect('/user/info');
            } else {
                req.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                res.redirect('/user/info');
            }
        }
    })

    .post('/:id/change-password', auth.isLoggedIn, validate.userChangePassword, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array());
            res.redirect('/user/info');
        } else {
            const password = req.body.newpw;
            const result = await userController.updateUserPassword(req.params.id, password);
            if (result) {
                req.flash('success', 'Success - dit password blev opdateret');
                res.redirect('/user/info');
            } else {
                req.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                res.redirect('/user/info');
            }
        }
    })

    .get('/events', auth.isLoggedIn, async (req, res) => {
        const user = req.user;
        const events = await eventController.findUserEvents(user);
        const errors = req.flash('error');
        const success = req.flash('success');
        res.render('public/user-events', {
            metaTags: {
                title: 'AHF - Mine events',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            messages: { errors, success },
            events: events,
            user: user
        });
    })

    .post('/events/:id/remove', async (req, res) => {
        const user = req.user;
        try {
            if (await eventController.eventSignOff(req.params.id, user._id)) {
                req.flash('success', 'Afmelding gennemført');
                res.redirect('back');
            } else{
                req.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                res.redirect('back');
            }
        } catch (err) {
            res.sendStatus(405);
        }
    })

    .get('/events/:id', async function (req, res) {
        const event = await eventController.findEvent(req.params.id); 
        const maxparticipants = event.maxparticipants;
        const participantsLength = maxparticipants - event.participants.length;
        
    res.locals.metaTags = {
        title: 'Login',
        description: 'Here goes the description',
        keywords: 'Here goes keywords'
    };
    res.render('public/eventView', {
        action: '/eventView',
        events: event,
        success: req.session.success,
        errors: req.session.errors,
        inputs: req.session.inputs,
        ticket: participantsLength,
        user: req.user
        
    });
    req.session.errors = null;
    req.session.inputs = null;
    req.session.success = null;
});

module.exports = router;
