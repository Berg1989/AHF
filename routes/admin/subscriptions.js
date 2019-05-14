const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/authentications');
const validate = require('../../middleware/validations');

router
    .get('/', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');

        response.render('admin/subscriptions', {
            messages: { errors, success },
            metaTags: {
                title: 'AHF Admin - Subscriptionmodels',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            layout: 'admin',
            subscriptions: await controller.findSubscriptionModels(),
        });
    })

    .post('/', auth.adminIsLoggedIn, validate.adminCreateSubModel, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('back');
        } else {
            const { name, duration, price } = request.body;
            const result = await controller.createSubscriptionModel(name, duration, price);

            if (result) {
                request.flash('success', 'Success! - Kontingent oprettet');
                response.redirect('back');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }
        }
    })

    .get('/:id', auth.adminIsLoggedIn, async (request, response) => {
        const subscription = await controller.findSubscriptionModel(request.params.id);

        const errors = request.flash('error');
        const success = request.flash('success');

        if (subscription) {
            response.render('admin/subscription', {
                messages: { errors, success },
                metaTags: {
                    title: 'AHF Admin - Subscriptionmodels',
                    description: 'Personal user page',
                    keywords: 'Profile and stuff'
                },
                layout: 'admin',
                subscription: subscription
            });
        } else {
            request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
            response.redirect('back');
        }
    })

    .post('/:id', auth.adminIsLoggedIn, validate.adminCreateSubModel, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('back');
        } else {
            const { name, duration, price } = request.body;

            const result = await controller.updateSubscriptionModel(request.params.id, name, duration, price);

            if (result) {
                request.flash('success', 'Success! - Kontingent opdateret');
                response.redirect('back');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }
        }
    })

    .post('/:id/delete', auth.adminIsLoggedIn, async (request, response) => {
        const sub = await controller.findSubscriptionModel(request.params.id);

        if (sub) {
            const result = await controller.deleteSubscriptionModel(sub);

            if (result) {
                request.flash('success', 'Success! - Kontingent blev slettet');
                response.redirect('/admin/subscriptions');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }
        } else {
            request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
            response.redirect('/admin/subscriptions');
        }

    });

module.exports = router;