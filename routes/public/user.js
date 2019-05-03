const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router
    .get('/', (request, response) => {
        const user = request.session.user;
        if (!user) {
            response.redirect('/login');
        } else {
            response.redirect('/user/id=' + user._id)
        }
    })
    .get('/id=:id', async (request, response) => {
        try {
            const user = request.session.user;
            const result = await controller.findMemberById(request.params.id);
            if (result) {
                response.locals.metaTags = {
                    title: 'User - ' + result.info.firstname,
                    description: 'Here goes the description',
                    keywords: 'Here goes keywords'
                };
                if (user && user._id === request.params.id) {
                    response.render('pUser', {
                        user,
                        result,
                        success: request.session.success,
                        errors: request.session.errors,
                        action: '/user/id=' + request.params.id,
                    });
                    request.session.success = null;
                    request.session.errors = null;
                } else {
                    response.render('user', { result, user });
                }
            } else {
                response.render('error'); //render error
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
                const result = await controller.findMember(email);
                if (result)
                    return Promise.reject('Email already in use');
            })
    ], async (request, response) => {
        // handle post requests of a user edit
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/user/id=' + request.params.id);
        } else {
            //const user = await controller.findMemberById(request.params.id);
            let { firstname, lastname, birth, phone, zipcode, street, email } = request.body;
            if (!email) email = request.session.user.email;

            try {
                const result = await controller.updatePublicUserInfo(request.params.id, firstname, lastname, birth, phone, zipcode, street, email);
                if (result) {
                    request.session.success = { msg: 'Success - opdatering gennemført' };
                    response.redirect('/user/id=' + request.params.id);
                }
            } catch (err) {
                console.log(err);
            }

        }
    });

module.exports = router;