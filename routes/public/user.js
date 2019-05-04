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
                        success: request.session.success,
                        errors: request.session.errors
                    });
                    request.session.success = null;
                    request.session.errors = null;
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
        check('firstname', 'Fornavn skal udfyldes')
            .isLength({ min: 2 }),
        check('lastname', 'Efternavn skal udfyldes')
            .isLength({ min: 2 }),
        check('zipcode', 'Postnummer skal være et tal')
            .optional({ checkFalsy: true }) // Can be falsy
            .isDecimal(),
        check('email', 'Please enter a valid email')
            .optional({ checkFalsy: true }) // Can be falsy
            .isEmail()
            .custom(async email => {
                if (await controller.checkEmail(email))
                    return Promise.reject('Email already in use');
            })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/user/id=' + request.params.id);
        } else {
            const { firstname, lastname, birth, phone, zipcode, street, email } = request.body;

            try {
                const result = await controller.updateUserInfo(request.params.id, firstname, lastname, birth, phone, zipcode, street, email, request.session.user.info.func);
                if (email) await controller.updateUserEmail(request.params.id, email);

                if (result) {
                    request.session.success = { msg: 'Success - opdatering gennemført' };
                    response.redirect('/user/id=' + request.params.id);
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
                subscriptions: await controller.findSubscriptionModels(),
                success: request.session.success,
                errors: request.session.errors,
            });
            request.session.success = null;
            request.session.errors = null;
        }
    })

    .post('/subscription', async (request, response) => {
        // # dato krig
        const subModel = await controller.findSubscriptionModel(request.body.subscriptionModel);
        if (subModel) {
            const oldEndDate = new Date(request.session.user.subscription.enddate);
            let startdate = new Date();
            let enddate = await controller.addMonths(startdate, parseInt(subModel.duration));
           
            /*if (oldEndDate && oldEndDate > startdate) {
                startdate = oldEndDate;
                enddate = oldEndDate.setMonth(oldEndDate.getMonth() + parseInt(subModel.duration));
            }*/

            console.log(parseInt(subModel.duration));
            console.log(startdate);
            console.log(enddate);

            try {
                const result = await controller.updateUserSubscription(request.session.user._id, subModel, startdate, enddate, true);
                if (result) {
                    request.session.success = { msg: 'Kontingent opdateret' };
                    response.redirect('/user');
                }
            } catch (err) {
                console.log(err);
            }

        }
    })

    .post('/unsubscribe', async (request, response) => {
        if(await controller.unsubscribe(request.session.user)) {
            response.redirect('/user');
        }
    });

module.exports = router;