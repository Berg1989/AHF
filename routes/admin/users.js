const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();

const validate = require('../../middleware/validations');
const auth = require('../../middleware/authentications');

router
    .get('/', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('admin/users', {
            messages: { errors, success },
            metaTags: {
                title: 'AHF Admin - Users',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            layout: 'admin',
            users: await controller.findUsers(),
            userCount: await controller.getUsersCount(),
            usertypes: await controller.findUsertypes(),
            inputs: request.session.inputs,
        });
    })

    .post('/', auth.adminIsLoggedIn, validate.adminCreateUser, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            request.session.inputs = { email: request.body.email, firstname: request.body.firstname, lastname: request.body.lastname, func: request.body.func };
            response.redirect('back');
        } else {
            const { usertype, email, password, firstname, lastname, func } = request.body;

            if (await controller.createUser(email, password, firstname, lastname, usertype, func)) {
                request.flash('success', 'Success - ny bruger: ' + email + ' oprettet');
                response.redirect('back');
            } else {
                request.flash('error', 'Ups der skete en fejl');
                response.redirect('back');
            }
        }
    })

    .get('/search=:searchid', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('admin/users', {
            messages: { errors, success },
            metaTags: {
                title: 'AHF Admin - Users',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            layout: 'admin',
            users: await controller.findUsersByText(request.params.searchid),
            userCount: await controller.getUsersCount(),
            usertypes: await controller.findUsertypes(),
            inputs: request.session.inputs,
        });
    })

    .get('/id=:id', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');
        const user = await controller.findUser(request.params.id);
        const userSub = await controller.findSubscription(user.subscription);
        if (user) {
            response.render('admin/user', {
                user: user,
                messages: { errors, success },
                metaTags: {
                    title: 'AHF Admin - Users',
                    description: 'Personal user page',
                    keywords: 'Profile and stuff'
                },
                layout: 'admin',
                user: user,
                currentSub: userSub ? userSub : false,
                usertypes: await controller.findUsertypes(),
                inputs: request.session.inputs,
            });
        } else {
            request.flash('error', 'Bruger ikke fundet');
            response.redirect('back');
        }
    })

    .post('/id=:id', auth.adminIsLoggedIn, validate.adminUpdateUser, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('back');
        } else {
            const { firstname, lastname, birth, phone, zipcode, street, usertype, func, email } = request.body;

            const res1 = await controller.updateUserInfo(request.params.id, firstname, lastname, birth, phone, zipcode, street, func);
            const res2 = await controller.updateUserType(request.params.id, usertype);
            if (email) await controller.updateUserEmail(request.params.id, email);

            if (res1 && res2) {
                request.flash('success', 'Success - ' + res1.info.firstname + ' opdateret');
                response.redirect('back');
            } else {
                request.flash('error', 'Ups noget gik galt');
                response.redirect('back');
            }
        }
    })

    .post('/id=:id/resetpw', auth.adminIsLoggedIn, async (request, response) => {
        const result = await controller.resetPassword(request.params.id);
        if (result) {
            request.flash('success', 'Success - password ændre til: ' + result);
            response.redirect('back');
        } else {
            request.flash('error', 'Ups noget gik galt');
            response.redirect('back');
        }
    })

    .post('/:id/delete', auth.adminIsLoggedIn, async (request, response) => {
        const user = await controller.findUser(request.params.id);
        if (user) {
            const result = controller.deleteUser(request.params.id);
            if (result) {
                request.flash('success', 'Success - ' + result + ' blev slettet');
                response.redirect('/admin/users');
            } else {
                request.flash('error', 'Ups noget gik galt');
                response.redirect('/admin/users');
            }
        } else {
            request.flash('error', 'Ups noget gik galt');
            response.redirect('/admin/users');
        }
    });

module.exports = router;