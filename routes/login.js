const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
    .post('/', async (request, response) => {
        const { email, password } = request.body;

        request.checkBody('email', 'email is required').notEmpty();
        request.checkBody('password', 'Password is required').notEmpty();

        const errors = request.validationErrors();

        if (errors) {
            request.session.errors = errors;
            request.session.success = false;
            response.redirect('/login');
        } else {
            result = await controller.login(email, password);
            if (result) {
                request.session.success = true;
                request.session.user = email;
                response.redirect('/');
            } else {
                request.session.errors = 'Invalid email and/or password';
                request.session.success = false;
                response.redirect('/login');
            }
        }
    })
    .post('/add', async (request, response) => {
        const { email, password } = request.body;

        controller.createUser(email, password)
            .then(result => response.json({ message: 'user saved!', newMember: result }))
            .catch(err => {
                console.error("Error: " + err);
                if (err.stack) console.error(err.stack);
                response.status(500).send(err);
            });
    })
    .get('/', function (request, response) {
        response.render('login', { success: request.session.success, errors: request.session.errors, user: request.session.user });
        request.session.errors = null;
    })

module.exports = router;