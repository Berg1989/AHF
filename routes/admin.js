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
            title: 'Admin - Home',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/index', { layout: 'admin', user });
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

    // Admin / Users
    .get('/users', async (request, response) => {
        // Get users
        //const usertypes = await controller.findUserTypes();
        //const user = request.session.user;
        response.locals.metaTags = {
            title: 'Admin - users',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/users', {
            layout: 'admin',
            users: await controller.findMembers(),
            success: request.session.success,
            errors: request.session.errors,
            //user: request.session.user,
            email: request.session.email,
            firstname: request.session.firstname,
            lastname: request.session.lastname
        });
        request.session.errors = null;
    })
    .post('/users', [
        //Post new user

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
            response.redirect('/admin/users');
        } else {
            const { level, email, password, firstname, lastname } = request.body;
            const result = await controller.createMember(email, password, firstname, lastname, level);

            if (result) {
                request.session.success = { msg: 'Success - ny bruger: ' + email + ', er oprettet' };
                response.redirect('/admin/users');
            }
        }
    })
    .get('/users/id=:id', async (request, response) => {
        try {
            const user = await controller.findMemberById(request.params.id);
            if (user) {
                response.locals.metaTags = {
                    title: 'Admin - edit user: ' + user.info.firstname,
                    description: 'Here goes the description',
                    keywords: 'Here goes keywords'
                };
                response.render('admin/user', {
                    layout: 'admin',
                    user,
                    errors: request.session.errors,
                    success: request.session.success
                });
                request.session.errors = null;
                request.session.success = null;
            }
        } catch (err) {
            response.render('error');
        }
        // Render a users info to edit
    })
    .post('/users/id=:id', [
        check('firstname', 'Fornavn skal udfyldes')
            .isLength({ min: 2 }),
        check('lastname', 'Efternavn skal udfyldes')
            .isLength({ min: 2 }),
        check('zipcode', 'Postnummer skal være et tal')
            .optional({ checkFalsy: true }) // Can be falsy
            .isDecimal()
    ], async (request, response) => {
        // handle post requests of a user edit
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/admin/users/id=' + request.params.id);
        } else {
            const { firstname, lastname, birth, phone, zipcode, street } = request.body;
            const result = await controller.updateUserInfo(request.params.id, firstname, lastname, birth, phone, zipcode, street);

            if (result) {
                request.session.success = { msg: 'Success - bruger opdateret' };
                response.redirect('/admin/users/id=' + request.params.id);
            }
        }
    })
    .delete('/users/id=:id', async (request, response) => {
        try {
            const result = await controller.deleteUser(request.params.id);
            if (result) location.reload(true);
        } catch (err) {
            response.sendStatus(405);
        }
    })


    .get('/subsciptions', async (request, response) => {
        // Render subscriptions and a create sub form
    })
    .post('/subsciptions', async (request, response) => {
        // Render subscriptions and a create sub form
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