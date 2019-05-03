const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');


router
    .get('/', async (request, response) => {
        response.locals.metaTags = {
            title: 'Kontingenter',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('subscriptionType', {
            layout: 'main',
            success: request.session.success,
            errors: request.session.errors,
            goodErrors: request.session.goodErrors,
            subtypes: request.session.subtypes = await controller.getSubTypes()
        });
        request.session.errors = null;
        request.session.goodErrors = null;
        request.session.success = null;
    })

    .post('/', [
        //checks if sub name is defined
        check('name', 'Kontingent skal defineres')
            .isLength({ min: 2 }),
        //checks if duration of sub is defined
        check('duration', 'Kontingent længde skal defineres')
            .isLength({ min: 1 }),
        //checks if sub price is defined
        check('mdrPrice', 'Pris skal defineres')
            .isLength({ min: 1 })
    ],
        async (request, response) => {
            const { name, duration, mdrPrice, isActive } = request.body;
            const exists = await controller.findSubTypeName(name);
            const errors = validationResult(request);
            const goodErrors = validationResult(request);
            if (!errors.isEmpty()) {
                request.session.errors = await errors.array();
                response.redirect('/subscriptionType');
            }
            if (!exists) {
                let isActiveBoo;
                if (isActive == null) {
                    isActiveBoo = false;
                } else {
                    isActiveBoo = true;
                }
                const result = await controller.createSubType(name, duration, mdrPrice, isActiveBoo)
                if (result) {
                    request.session.goodErrors = [{ message: 'Kontingent oprettet' }];
                    request.session.subType = result;
                    response.redirect('/subscriptionType');
                }
            } else {
                request.session.errors = [{ msg: 'Kontingent eksisterer allerede' }];
                request.session.name = request.body.name;
                response.redirect('/subscriptionType');

            };
        })

    .get('/:id', async (request, response) => {
        try {
            const subType = await controller.findSubTypeId(request.params.id);
            if (subType) {
                response.send(subType);
            }
        } catch (err) {
            response.render('error');
        }


    })

    .delete('/:id', async (request, response) => {
        const subType = await controller.findSubTypeId(request.params.id);
        if (subType.isActive == null) {
            try {
                const goodErrors = validationResult(request);
                const result = await controller.deleteSubType(request.params.id);

                if (result) {
                    request.session.goodErrors = [{ message: 'Kontingent slettet' }];
                    response.sendStatus(200);
                }
            } catch (err) {
                response.render('error');
            }
        } else {
            request.session.errors = [{ message: 'Kontingent er aktivt' }];
            response.sendStatus(200);
        }

    })

module.exports = router;