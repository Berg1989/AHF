const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();

router
    .get('/', function (request, response) {
        if (!request.session.admin) {
            response.locals.metaTags = {
                title: 'Admin Login',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('admin/login', {
                errors: request.session.errors,
                email: request.session.email,
                admin: request.session.admin
            });
            request.session.errors = null;
            request.session.email = null;
        } else {
            response.redirect('/admin');
        }
    })

    .post('/', [
        check('loginEmail', 'Email er påkrævet')
            .isEmail(),
        check('loginPassword', 'Password er påkrævet')
            .isLength({ min: 5 }).custom(async (password, { req }) => {
                if (!await controller.login(req.body.loginEmail, password))
                    return Promise.reject('Forkert email og/eller password');
            })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.email = request.body.loginEmail;
            response.redirect('/admin/login');
        } else {
            const { loginEmail, loginPassword } = request.body;
            const result = await controller.login(loginEmail, loginPassword);
            if (result) {
                request.session.admin = result;
                response.redirect('/admin');
            } else {
                request.session.errors = { msg: 'Forkert email og/eller password' };
                response.redirect('/admin/login');
            }
        }
    });

module.exports = router;