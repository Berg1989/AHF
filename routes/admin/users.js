const userController = require("../../controllers/userController");
const userTypeController = require("../../controllers/userTypeController");
const subscriptionController = require("../../controllers/subscriptionController");
const express = require('express');
const { validationResult } = require('express-validator/check');
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
            users: await userController.findUsers(),
            userCount: await userController.getUsersCount(),
            usertypes: await userTypeController.findUsertypes(),
            inputs: request.session.inputs,
        });
    })

    .post('/', auth.adminIsLoggedIn, validate.adminCreateUser, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('back');
        } else {
            const { usertype, email, password, firstname, lastname, func } = request.body;

            if (await userController.createUser(email, password, firstname, lastname, usertype, func)) {
                request.flash('success', 'Success - ny bruger: ' + email + ' oprettet');
                response.redirect('back');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
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
            users: await userController.findUsersByText(request.params.searchid),
            userCount: await userController.getUsersCount(),
            usertypes: await userController.userTypeController(),
            inputs: request.session.inputs,
        });
    })

    .get('/id=:id', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');
        const user = await userController.findUser(request.params.id);
        const userSub = await subscriptionController.findSubscription(user.subscription);
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
                usertypes: await userController.userTypeController(),
                inputs: request.session.inputs,
            });
        } else {
            request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
            response.redirect('back');
        }
    })

    .post('/id=:id', auth.adminIsLoggedIn, validate.adminUpdateUser, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('back');
        } else {
            const { firstname, lastname, isLegalAge, comments, usertype, func, email } = request.body;
            let checked = false;
            if (isLegalAge === 'checked') {
                checked = true;
            }

            const res1 = await userController.updateUserInfo(request.params.id, firstname, lastname, comments, checked, func);
            const res2 = await userController.updateUserType(request.params.id, usertype);
            if (email) await userController.updateUserEmail(request.params.id, email);

            if (res1 && res2) {
                request.flash('success', 'Success - ' + res1.info.firstname + ' opdateret');
                response.redirect('back');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }
        }
    })

    .post('/id=:id/resetpw', auth.adminIsLoggedIn, async (request, response) => {
        const result = await userController.resetPassword(request.params.id);
        if (result) {
            request.flash('success', 'Success - password ændre til: ' + result);
            response.redirect('back');
        } else {
            request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
            response.redirect('back');
        }
    })

    .post('/:id/delete', auth.adminIsLoggedIn, async (request, response) => {
        const user = await userController.findUser(request.params.id);

        if (user) {
            if (JSON.stringify(request.user._id) === JSON.stringify(user._id)) {
                request.flash('error', [{ msg: 'UPS! Du kan ikke slette dig selv...' }]);
                response.redirect('/admin/users');
            } else {
                const result = await userController.deleteUser(request.params.id);
                if (result) {
                    request.flash('success', 'Success - ' + result.email + ' blev slettet');
                    response.redirect('/admin/users');
                } else {
                    request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                    response.redirect('/admin/users');
                }
            }
        } else {
            request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
            response.redirect('/admin/users');
        }
    });

module.exports = router;