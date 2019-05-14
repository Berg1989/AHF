const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();

const shopController = require('../../controllers/shop');
const auth = require('../../middleware/authentications');
const validate = require('../../middleware/validations');

router
    .get('/', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('admin/shop/orders', {
            messages: { errors, success },
            metaTags: {
                title: 'AHF Admin - Ordrehistorik',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            layout: 'admin',
        });
    })

    .post('/', auth.adminIsLoggedIn, validate.adminOrderDates, async function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', await errors.array());
            res.redirect('back');
        } else {
            const start = new Date(req.body.start);
            const end = new Date(req.body.end);
            const result = await shopController.findOrders(start, end);

            if (result) {
                const errors = req.flash('error');
                const success = req.flash('success');
                res.render('admin/shop/orders', {
                    messages: { errors, success },
                    metaTags: {
                        title: 'AHF Admin - Ordrehistorik',
                        description: 'Personal user page',
                        keywords: 'Profile and stuff'
                    },
                    layout: 'admin',
                    orders: result,
                    period: {
                        start: start.toDateString(),
                        end: end.toDateString(),
                    }
                });
            } else {
                res.redirect('back');
            }
        }
    });

module.exports = router;