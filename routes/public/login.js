const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const csrf = require('csurf');

const csrfProtection = csrf();
router.use(csrfProtection)

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
                csrfToken: request.csrfToken(),
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
        check('loginEmail', 'Email er påkrævet')
            .isEmail().custom(async (email) => {
                if (!await controller.checkEmail(email))
                    return Promise.reject('Ukendt email');
                else return true;
            }),
        check('loginPassword', 'Password er påkrævet')
            .isLength({ min: 5 }),/*.custom(async (password, { req }) => {
                if (!await controller.login(req.body.loginEmail, password))
                    return Promise.reject('Password og email matcher ikke');
            })*/
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.email = request.body.loginEmail;
            response.redirect('/login');
        } else {
            const { loginEmail, loginPassword } = request.body;
            const user = await controller.login(loginEmail, loginPassword);

            if (user) {
                request.session.user = user;
                response.redirect('/user');
            } else {
                request.session.errors = [{ msg: 'Password og email matcher ikke' }];
                response.redirect('/login');
            }
        }
    })

    .post('/register', [
        check('email', 'Email er påkrævet')
            .isEmail().custom(async email => {
                if (await controller.checkEmail(email))
                    return Promise.reject('Email er allerede i brug');
            }),
        check('password', 'Password skal min. være 5 karaktere')
            .isString().isLength({ min: 5 }),
        check('firstname', 'Fornavn er påkrævet')
            .isString().isLength({ min: 2 }),
        check('lastname', 'Efternavn er påkrævet')
            .isString().isLength({ min: 2 })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { email: request.body.email, firstname: request.body.firstname, lastname: request.body.lastname };
            response.redirect('/login');
        } else {
            const { email, password, firstname, lastname } = request.body;
            const result = await controller.createUser(email, password, firstname, lastname, '5cd04bc81c9d4400009071ce', 'medlem');

            if (result) {
                request.session.user = result;
                response.redirect('/user');
            }
        }
    });

module.exports = router;