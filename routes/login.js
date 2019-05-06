const controller = require("../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', function (request, response) {
        response.locals.metaTags = {
            title: 'Login',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('login', {
            action: '/login',
            errors: request.session.errors,
            email: request.session.email,
            user: request.session.user
        });
        request.session.errors = null;
    })
    .post('/', [
        //check email og om den findes i db
        check('email', 'Email is required')
            .isEmail(),
        //check password
        check('password', 'Password is required')
            .isLength({ min: 5 })
        /*.custom(async (password, { req }) => {
            const result = await controller.login(req.body.email, password);
            if (!result)
                return Promise.reject('Password and email do not match');
        })*/
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.email = request.body.email;
            response.redirect('/login');
        } else {
            const { email, password } = request.body;
            const result = await controller.login(email, password);
            if (result) {
                request.session.user = result;
                response.redirect('/profile/id=' + result._id);
            } else {
                request.session.errors = [{ msg: 'Username and password do not match' }];
                request.session.email = request.body.email;
                response.redirect('/login');
            }
        }
    });

module.exports = router;