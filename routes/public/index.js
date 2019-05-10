const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', async (request, response) => {
        response.locals.metaTags = {
            title: 'Home',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
            response.render('public/index', { user: request.session.user });
            request.session.errors = null;
    })

    .get('/logout', (request, response) => {
        request.session.destroy(err => {
            if (err) {
                console.log(err);
            } else {
                response.redirect('/login');
            }
        });
    })

    .get('/events', async (request,response) => {
        const user = request.session.user;
        response.render('public/events', {
            user: user,
            errors: request.session.errors,
            success: request.session.success,
            events: await controller.findEvents(user),
        });
        request.session.success = null;
        request.session.errors = null;  
    });

module.exports = router;