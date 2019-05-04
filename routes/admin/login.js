const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();

router
    .get('/', function (request, response) {
        if (!request.session.user) {
            response.locals.metaTags = {
                title: 'Admin Login',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('login', {
                action: '/admin/login',
                errors: request.session.errors,
                email: request.session.email,
                user: request.session.user
            });
            request.session.errors = null;
            request.session.email = null;
        } else {
            response.redirect('/admin');
        }
    })

    .post('/', [
        check('loginEmail', 'Email is required')
            .isEmail(),
        check('loginPassword', 'Password is required')
            .isLength({ min: 5 }).custom(async (password, { req }) => {
                if (!await controller.login(req.body.loginEmail, password))
                    return Promise.reject('Password and email do not match');
            })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.email = request.body.loginEmail;
            response.redirect('/admin/login');
        } else {
            request.session.user = await controller.checkEmail(request.body.loginEmail);
            response.redirect('/admin');
        }
    });

module.exports = router;