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

    .get('/events', (request,response) => {
        response.render('public/events');
    });

module.exports = router;