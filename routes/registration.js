const controller = require("../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .post('/', [
        //check om email og denne allerede existere i database
        check('email', 'Must be a valid email')
            .isEmail()
            .custom(async email => {
                const result = await controller.findMember(email);
                if (result)
                    return Promise.reject('Email already in use');
            }),
        //check om password er min 5 chars lang
        check('password', 'Password must be 5 characters or longer')
            .isLength({ min: 5 })
    ], async (request, response) => {
        const errs = request.validationErrors();
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = errs;
            request.session.success = false;
            response.redirect('/registration');
        } else {
            const result = await controller.createMember(request.body.email, request.body.password);
            if (result) {
                request.session.user = result;
                request.session.success = true;
                response.redirect('/');
            }
        }
    })
    .get('/', function (request, response) {
        response.render('registration', { success: request.session.success, errors: request.session.errors, user: request.session.user });
        request.session.errors = null;
    })

module.exports = router;