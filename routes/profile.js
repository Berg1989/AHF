const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const fetch = require('node-fetch');

router
    .get('/', (request, response) => {
        const user = request.session.user;
        if (!user) {
            response.redirect('/login');
        } else {
            response.redirect('/profile/' + user._id)
        }
    })
    .get('/:id', async (request, response) => {
        try {
            const user = request.session.user;
            const result = await controller.findMemberById(request.params.id);
            if (result) {
                response.locals.metaTags = {
                    title: 'Profile - ' + result.firstname,
                    description: 'Here goes the description',
                    keywords: 'Here goes keywords'
                };
                if (user && user._id === request.params.id) {
                    response.render('personalProfile', { 
                        result,
                        success: request.session.success,
                        errors: request.session.errors,
                        action: '/profile/' + request.params.id,
                     });
                } else {
                    response.render('profile', { result });
                }
            } else {
                response.render('error'); //render error
            }
        } catch(err) {
            response.render('error');
        }
    })
    .post('/:id', [
        check('firstname', 'Please enter your firstname')
            .isLength({ min: 2 }),
        check('lastname', 'Please enter your lastname')
            .isLength({ min: 2 })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.success = false;
            response.redirect('/profile/' + request.params.id);
        } else {
            const { firstname, lastname } = request.body;
            const result = await controller.updateUser(request.params.id, firstname, lastname);

            if (result) {
                request.session.success = { msg: 'Bruger data opdateret!' };
                response.redirect('/profile/' + request.params.id);
            }
        }
    })
    .post('/:id/logout', (request, response) => {
        request.session.destroy(err => {
            if (err) {
                console.log(err);
            } else {
                response.redirect('/login');
            }
        });
    });

module.exports = router;