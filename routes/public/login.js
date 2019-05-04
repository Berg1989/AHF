const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', function (request, response) {
        if (request.session.user) response.redirect('/profile/id=' + request.session.user._id);
        else {
            response.locals.metaTags = {
                title: 'Login',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('public/login', {
                action: '/login',
                errors: request.session.errors,
                email: request.session.email,
                inputs: request.session.inputs,
                user: request.session.user
            });
            request.session.errors = null;
            request.session.email = null;
            request.session.inputs = null;
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
            response.redirect('/login');
        } else {
            request.session.user = await controller.checkEmail(request.body.loginEmail);
            response.redirect('/user');
        }
    })

    .post('/register', [
        check('email', 'Please enter a valid email')
            .isEmail()
            .custom(async email => {
                if (await controller.checkEmail(email))
                    return Promise.reject('Email already in use');
            }),
        check('password', 'Password must be atleast 5 characters or longer')
            .isString().isLength({ min: 5 }),
        check('firstname', 'Please enter your firstname')
            .isString().isLength({ min: 2 }),
        check('lastname', 'Please enter your lastname')
            .isString().isLength({ min: 2 })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { email: request.body.email, firstname: request.body.firstname, lastname: request.body.lastname };
            response.redirect('/login');
        } else {
            const { email, password, firstname, lastname } = request.body;
            const result = await controller.createUser(email, password, firstname, lastname, await controller.getUserTitle(3), 3, 'medlem');

            if (result) {
                request.session.user = result;
                response.redirect('/user');
            }
        }
    });

module.exports = router;