const controller = require("../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', function (request, response) {
        const user = request.session.user;
        if (user && user.usertype.accesslevel < 3) {
            response.locals.metaTags = {
                title: 'Frontpage',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('admin/index', { user });
        } else {
            response.redirect('/');
        }
    })
    .get('/login', function (request, response) {
        const user = request.session.user;
        if (!user) {
            response.locals.metaTags = {
                title: 'Admin Login',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('login', { action: '/admin/login' });
            request.session.errors = null;
        } else {
            response.redirect('/admin');
        }
    })
    .post('/login', [
        //check email og om den findes i db
        check('email', 'Email is required')
            .isEmail(),
        //check password
        check('password', 'Password is required')
            .isLength({ min: 5 })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.email = request.body.email;
            request.session.success = false;
            response.redirect('/admin/login');
        } else {
            const { email, password } = request.body;
            const result = await controller.login(email, password);
            if (result && result.usertype.accesslevel < 3) {
                request.session.user = result;
                request.session.success = true;
                response.redirect('/admin');
            } else {
                request.session.errors = [{ msg: 'Username and password do not match' }];
                request.session.email = request.body.email;
                request.session.success = false;
                response.redirect('/admin/login');
            }
        }
    });

module.exports = router;