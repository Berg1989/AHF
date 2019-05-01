const controller = require("../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router

    //Admin root
    .get('/', async (request, response) => {
        const user = request.session.user;
        response.locals.metaTags = {
            title: 'Frontpage',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/index', { user });
        /*
        if (user && user.usertype.accesslevel < 3) {
            response.locals.metaTags = {
                title: 'Frontpage',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('admin/index', { user, usertypes });
        } else {
            response.redirect('/');
        }*/
    })

    //Registrering
    .get('/users/register', async (request, response) => {
        //const usertypes = await controller.findUserTypes();
        //const user = request.session.user;
        response.locals.metaTags = {
            title: 'Admin - regitrer nyt medlem',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/register', {
            success: request.session.success,
            errors: request.session.errors,
            user: request.session.user,
            email: request.session.email,
            firstname: request.session.firstname,
            lastname: request.session.lastname
        });
        request.session.errors = null;
    })
    .post('/users/register', [
        //check email og om denne allerede existere i database
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
            .isLength({ min: 2 }),
        check('select', 'Please select a usertype')
            .isEmpty()
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.email = request.body.email;
            request.session.firstname = request.body.firstname;
            request.session.lastname = request.body.lastname;
            response.redirect('/admin/users/register');
        } else {
            const { level, email, password, firstname, lastname } = request.body;
            const result = await controller.createMember(email, password, firstname, lastname, level);

            if (result) {
                request.session.user = result;
                request.session.success = { msg: 'Success - ny bruger: ' + email + ', er oprettet' };
                response.redirect('/admin/users/register');
            }
        }
    })

    //Login 
    .get('/login', function (request, response) {
        const user = request.session.user;
        if (!user) {
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
            response.redirect('/admin/login');
        } else {
            const { email, password } = request.body;
            const result = await controller.login(email, password);
            if (result && result.type.level === 1) {
                request.session.user = result;
                response.redirect('/admin');
            } else {
                request.session.errors = [{ msg: 'Username and password do not match' }];
                request.session.email = request.body.email;
                response.redirect('/admin/login');
            }
        }
    });

module.exports = router;