const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();

router
    .get('/', async (request, response) => {
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
            inputs: request.session.inputs,
            success: request.session.success,
            errors: request.session.errors,
            //user: request.session.user,
        });
        request.session.errors = null;
        request.session.success = null;
        request.session.inputs = null;
    })

    .post('/', [
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
            .not().isEmpty()
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { email: request.body.email, firstname: request.body.firstname, lastname: request.body.lastname };
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
    })

    .post('/users/id=:id', [
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
                const result = await controller.findMember(email);
                if (result)
                    return Promise.reject('Email already in use');
            })
    ], async (request, response) => {
        // handle post requests of a user edit
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/admin/users/id=' + request.params.id);
        } else {
            const user = await controller.findMemberById(request.params.id);
            let { firstname, lastname, birth, phone, zipcode, street, level, func, email } = request.body;
            if (!email) email = user.email;
            const result = await controller.updateUserInfo(request.params.id, firstname, lastname, birth, phone, zipcode, street, level, func, email);

            if (result) {
                request.session.success = { msg: 'Success - bruger opdateret' };
                response.redirect('/admin/users/id=' + request.params.id);
            }
        }
    })

    .delete('/users/id=:id', async (request, response) => {
        try {
            //const result = await controller.deleteUser(request.params.id);
            if (await controller.deleteUser(request.params.id)) response.sendStatus(200);
        } catch (err) {
            response.sendStatus(405);
        }
    })

module.exports = router;