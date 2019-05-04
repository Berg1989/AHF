const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router
    .get('/', async (request, response) => {
        //if (!request.session.subscription) response.redirect('/');
        //else {
        response.locals.metaTags = {
            title: 'Admin - Manage subscriptions',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/subscriptions', {
            layout: 'admin',
            subscriptions: await controller.findSubscriptionModels(),
            errors: request.session.errors,
            success: request.session.success,
            inputs: request.session.inputs
        });
        request.session.errors = null;
        request.session.success = null;
        request.session.inputs = null;
        // }
    })

    .post('/', [
        check('name', 'Navn er påkrævet')
            .not().isEmpty(),//.isLength({ min: 1 }),
        check('duration', 'Varighed er påkrævet')
            .isDecimal(),//.not().isEmpty(),
        check('price', 'Pris er påkrævet')
            .isDecimal(),
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { name: request.body.name, duration: request.body.duration, price: request.body.price };
            response.redirect('/admin/subscriptions');
        } else {
            const { name, duration, price } = request.body;

            if (await controller.createSubscriptionModel(name, duration, price, true)) {
                request.session.success = { msg: 'Success! - Kontingent oprettet' };
                response.redirect('/admin/subscriptions');
            }
        }
    })

    .get('/id=:id', async (request, response) => {
        try {
            const subscription = await controller.findSubscriptionModel(request.params.id);
            if (subscription) {
                response.locals.metaTags = {
                    title: 'Admin - edit subscription: ' + subscription.name,
                    description: 'Here goes the description',
                    keywords: 'Here goes keywords'
                };
                response.render('admin/subscription', {
                    layout: 'admin',
                    subscription,
                    errors: request.session.errors,
                    success: request.session.success
                });
                request.session.errors = null;
                request.session.success = null;
            }
        } catch (err) {
            response.render('error');
        }
    })

    .post('/id=:id', [
        check('name', 'Navn er påkrævet')
            .isString(),
        check('duration', 'Varighed er påkrævet')
            .isDecimal(),//.not().isEmpty(),
        check('price', 'Pris er påkrævet')
            .isDecimal(),
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { price: request.body.price };
            response.redirect('/admin/subscriptions/id=' + request.params.id);
        } else {
            const { name, duration, price } = request.body;

            if (await controller.updateSubscriptionModel(request.params.id, name, duration, price, true)) {
                request.session.success = { msg: 'Success! - Kontingentet er opdateret' };
                response.redirect('/admin/subscriptions/id=' + request.params.id);
            }
        }
    })

    .delete('/id=:id', async (request, response) => {
        try {
            if (await controller.deleteSubscriptionModel(request.params.id)) response.sendStatus(200);
        } catch (err) {
            response.sendStatus(405);
        }
    });

module.exports = router;