const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router
    .get('/', (request, response) => {
        const user = request.session.user;
        if (!user) {
            response.redirect('/login');
        } else {
            response.redirect('/user/id=' + user._id)
        }
    })
    .get('/id=:id', async (request, response) => {
        try {
            const user = request.session.user;
            const result = await controller.findUser(request.params.id);
            if (result) {
                response.locals.metaTags = {
                    title: 'User - ' + result.info.firstname,
                    description: 'Here goes the description',
                    keywords: 'Here goes keywords'
                };
                if (user && user._id === request.params.id) {
                    response.render('public/pUser', {
                        user: result,
                        subscription: await controller.findSubscription(user.subscription),
                        success: request.session.success,
                        errors: request.session.errors
                    });
                    request.session.success = null;
                    request.session.errors = null;
                    request.session.user = result; //update user session
                } else {
                    response.render('public/user', { result });
                }
            } else {
                throw new Error(result);
            }
        } catch (err) {
            console.log(err);
        }
    })

    .post('/id=:id', [
        check('firstname', 'Fornavn skal udfyldes').isString().isLength({ min: 2 }),
        check('lastname', 'Efternavn skal udfyldes').isString().isLength({ min: 2 }),
        check('birth', 'Invalid input').optional({ checkFalsy: true }).isString(),
        check('phone', 'Invalid input').optional({ checkFalsy: true }).isString(),
        check('zipcode', 'Postnummer skal være et tal').optional({ checkFalsy: true }).isDecimal(),
        check('street', 'Invalid input').optional({ checkFalsy: true }).isString()
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/user/id=' + request.params.id);
        } else {
            const { firstname, lastname, birth, phone, zipcode, street } = request.body;

            try {
                const result = await controller.updateUserInfo(request.params.id, firstname, lastname, birth, phone, zipcode, street, request.session.user.info.func);

                if (result) {
                    request.session.success = { msg: 'Success - Dine informationer er opdateret' };
                    response.redirect('/user');
                }
            } catch (err) {
                console.log(err);
            }

        }
    })

    .get('/subscription', async (request, response) => {
        const user = request.session.user;
        if (!user) response.redirect('/login');
        else {
            //const result = await controller.findUser(request.params.id);
            response.render('public/subscription', {
                user,
                subscriptionModels: await controller.findSubscriptionModels(),
                success: request.session.success,
                errors: request.session.errors,
            });
            request.session.success = null;
            request.session.errors = null;
        }
    })

    .post('/subscription', async (request, response) => {
        const user = request.session.user;
        if (user) {
            const model = await controller.findSubscriptionModel(request.body.subscriptionModel);
            const today = new Date();
            const start = new Date().toDateString();
            const end = new Date(today.setMonth(today.getMonth() + parseInt(model.duration))).toDateString();

            const newSub = await controller.createSubscription(user._id, start, end, true, model._id);
            const result = await controller.connectSubToUser(newSub._id, user._id);

            /*if (!user.subscription) {
                result = await controller.createSubscription(user._id, start, end, true, model._id);
            } else {
                result = await controller.updateSubsciption(user.subscription, start, end, model._id);
            }*/

            if (result) {
                request.session.success = { msg: 'Kontingent opdateret' };
                response.redirect('/user');
            }
        }
    })

    .post('/unsubscribe', async (request, response) => {
        const user = request.session.user;
        if (user && user.subscription) {
            const result = await controller.unsubscribe(user.subscription);
            if (result) {
                request.session.success = { msg: 'Kontingent deaktiveret' };
                response.redirect('/user');
            }
        }
    })

    .post('/email', [
        check('pw', 'Indtast venligst dit password').isString().custom(async (pw, { req }) => {
            if (!await controller.checkPassword(pw, req.session.user.password))
                return Promise.reject('Forkert password indtastet');
        }),
        check('newEmail', 'Please enter a valid email').isEmail().custom(async (email) => {
            if (await controller.checkEmail(email))
                return Promise.reject('Email already in use');
        })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/user');
        } else {
            const { pw, newEmail } = request.body;
            const result = await controller.updateUserEmail(request.session.user._id, newEmail);
            if (result) {
                request.session.success = { msg: 'Success - Email ændret' };
                response.redirect('/user');
            }
        }
    })

    .post('/pw', [
        check('oldpw').custom(async (oldpw, { req }) => {
            if (!await controller.checkPassword(oldpw, req.session.user.password))
                return Promise.reject('Forkert password indtastet');
        }),
        check('newpw', 'Nyt password skal være min. 5 karaktere lang').isLength({ min: 5 }).custom((newpw, { req }) => {
            if (newpw === req.body.oldpw) {
                throw new Error('Find venligst på et nyt password :)');
            } else {
                return true;
            }
        })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/user');
        } else {
            const { oldpw, newpw } = request.body;
            const result = await controller.updateUserPassword(request.session.user._id, newpw);
            if (result) {
                request.session.success = { msg: 'Success - Password ændret' };
                response.redirect('/user');
            }
        }
    })

    .get('/personalEvents', async (request, response) => {
        const user = request.session.user;
        if (!user) response.redirect('/login');
        else {
            response.render('public/personalEvents', {
                user,
                success: request.session.success,
                errors: request.session.errors,
                events: await controller.findUserEvents(user._id)
            });
            request.session.success = null;
            request.session.errors = null;
        }
    })

    .post('/events/eventid=:id/remove', async (request, response) => {
        const event = request.params.id;
        const user = request.session.user;
        try {
            if (await controller.eventSignOff(event, user._id)) {
                response.redirect('back');
            }
        } catch (err) {
            response.sendStatus(405);
        }
    });

module.exports = router;