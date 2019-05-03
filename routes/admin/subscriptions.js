const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router
    .get('/', async (request, response) => {
        //if (!request.session.user) response.redirect('/');
        //else {
        response.locals.metaTags = {
            title: 'Admin - Manage subscriptions',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/subscriptions', {
            layout: 'admin',
            subscriptions: await controller.findSubscriptions(),
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
        check('frequency', 'Varighed er påkrævet')
            .not().isEmpty(),
        check('price', 'Pris er påkrævet')
            .isDecimal(),
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { name: request.body.name, frequency: request.body.frequency, price: request.body.price };
            response.redirect('/admin/subscriptions');
        } else {
            const { name, frequency, price } = request.body;
            console.log(frequency);

            if (await controller.createSubscription(name, frequency, price)) {
                request.session.success = { msg: 'Success! - Kontingent oprettet' };
                response.redirect('/admin/subscriptions');
            }
        }
    });

module.exports = router;