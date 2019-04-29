const controller = require("../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', function (request, response) {
        if (!request.session.user) {
            response.locals.metaTags = {
                title: 'Register',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('register', {
                layout: 'main',
                success: request.session.success,
                errors: request.session.errors,
                user: request.session.user,
                email: request.session.email,
                firstname: request.session.firstname,
                lastname: request.session.lastname
            });
            request.session.errors = null;
        } else {
            response.redirect('/');
        }
    })
    .post('/', [
        //check om email og denne allerede existere i database
        check('email', 'Please enter a valid email')
            .isEmail()
            .custom(async email => {
                const result = await controller.findMember(email);
                if (result)
                    return Promise.reject('Email already in use');
            }),
        //check om password er min 5 chars lang
        check('password', 'Password must be 5 characters or longer')
            .isLength({ min: 5 }),
        check('firstname', 'Please enter your firstname')
            .isLength({ min: 2 }),
        check('lastname', 'Please enter your lastname')
            .isLength({ min: 2 })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.email = request.body.email;
            request.session.firstname = request.body.firstname;
            request.session.lastname = request.body.lastname;
            request.session.success = false;
            response.redirect('/register');
        } else {
            const { email, password, firstname, lastname } = request.body;

            const result = await controller.createMember(email, password, firstname, lastname, 'Member');
            if (result) {
                request.session.user = result;
                request.session.success = true;
                response.redirect('/profile');
            }
        }
    });

module.exports = router;