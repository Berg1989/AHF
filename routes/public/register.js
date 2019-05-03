const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();

router
    .get('/', function (request, response) {
        if (!request.session.user) {
            response.locals.metaTags = {
                title: 'Register',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('register', {
                errors: request.session.errors,
                user: request.session.user,
                inputs: request.session.inputs,
            });
            request.session.errors = null;
            request.session.inputs = null;
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
            request.session.inputs = { email: request.body.email, firstname: request.body.firstname, lastname: request.body.lastname };
            response.redirect('/register');
        } else {
            const { email, password, firstname, lastname } = request.body;

            const result = await controller.createMember(email, password, firstname, lastname, 3, 'medlem');
            if (result) {
                request.session.user = result;
                response.redirect('/user');
            }
        }
    });

module.exports = router;