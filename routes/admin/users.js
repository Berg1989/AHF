const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();

router
    .get('/', async (request, response) => {
        // Get users
        //const usertypes = await controller.findUserTypes();
        //const admin = request.session.admin;
        response.locals.metaTags = {
            title: 'Admin - users',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/users', {
            layout: 'admin',
            users: await controller.findUsers(),
            inputs: request.session.inputs,
            success: request.session.success,
            errors: request.session.errors,
            //admin: request.session.admin,
        });
        request.session.errors = null;
        request.session.success = null;
        request.session.inputs = null;
    })

    .post('/', [
        check('email', 'Please enter a valid email')
            .isEmail().custom(async email => {
                if (await controller.checkEmail(email))
                    return Promise.reject('Email already in use');
            }),
        check('password', 'Password must be 5 characters or longer')
            .isLength({ min: 5 }),
        check('firstname', 'Please enter your firstname')
            .isLength({ min: 2 }),
        check('lastname', 'Please enter your lastname')
            .isLength({ min: 2 }),
        check('level', 'Please select a usertype')
            .not().isEmpty(),
        check('func')
            .optional({ checkFalsy: true }).isString()
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { email: request.body.email, firstname: request.body.firstname, lastname: request.body.lastname, func: request.body.func };
            response.redirect('/admin/users');
        } else {
            const { level, email, password, firstname, lastname, func } = request.body;
            const title = await controller.getUserTitle(level);

            if (await controller.createUser(email, password, firstname, lastname, title, level, func)) {
                request.session.success = { msg: 'Success - ny bruger: ' + email + ', er oprettet' };
                response.redirect('/admin/users');
            }
        }
    })

    .get('/id=:id', async (request, response) => {
        try {
            const user = await controller.findUser(request.params.id);
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
    })

    .post('/id=:id', [
        check('firstname', 'Fornavn skal udfyldes')
            .isLength({ min: 2 }),
        check('lastname', 'Efternavn skal udfyldes')
            .isLength({ min: 2 }),
        check('zipcode', 'Postnummer skal være et tal')
            .optional({ checkFalsy: true }) // Can be falsy
            .isDecimal(),
        check('email', 'Please enter a valid email')
            .optional({ checkFalsy: true }) // Can be falsy
            .isEmail()
            .custom(async email => {
                if (await controller.checkEmail(email))
                    return Promise.reject('Email already in use');
            })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/admin/users/id=' + request.params.id);
        } else {
            const { firstname, lastname, birth, phone, zipcode, street, level, func, email } = request.body;
            const res1 = await controller.updateUserInfo(request.params.id, firstname, lastname, birth, phone, zipcode, street, func);
            const res2 = await controller.updateUserType(request.params.id, await controller.getUserTitle(level), level);
            if (email) await controller.updateUserEmail(request.params.id, email);

            if (res1 && res2) {
                request.session.success = { msg: 'Success - bruger opdateret' };
                response.redirect('/admin/users/id=' + request.params.id);
            }
        }
    })

    .post('/id=:id/resetpw', async (request, response) => {
        const result = await controller.resetPassword(request.params.id);
        if (result) {
            request.session.success = { msg: 'Succes password reset to: ' + result };
            response.redirect('/admin/users/id=' + request.params.id);
        }
    })

    .post('/id=:id/unsubscribe', async (request, response) => {
        const user = await controller.findUser(request.params.id);
        if (user) {
            const result = await controller.unsubscribe(request.params.id, user.subscription.startdate, user.subscription.enddate)
            if (result) {
                request.session.success = { msg: 'Kontingent deaktiveret' };
                response.redirect('/admin/users/id=' + request.params.id);
            }
        }
    })

    .delete('/id=:id', async (request, response) => {
        try {
            if (await controller.deleteUser(request.params.id)) response.sendStatus(200);
        } catch (err) {
            response.sendStatus(405);
        }
    });

module.exports = router;