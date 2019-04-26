const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
    .post('/', async (request, response) => {
        const { username, password } = request.body;

        request.checkBody('username', 'Username is required').notEmpty();
        request.checkBody('password', 'Password is required').notEmpty();

        const errors = request.validationErrors();

        if (errors) {
            request.session.errors = errors;
            request.session.success = false;
            response.redirect('/user');
        } else {
            result = await controller.login(username, password);
            if (result) {
                request.session.success = true;
                request.session.user = username;
                response.redirect('/');
            } else {
                request.session.errors = 'Invalid username and/or password';
                request.session.success = false;
                response.redirect('/user');
            }
        }
    })
    .post('/add', async (request, response) => {
        const { username, password } = request.body;

        controller.createUser(username, password)
            .then(result => response.json({ message: 'user saved!', user: result }))
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