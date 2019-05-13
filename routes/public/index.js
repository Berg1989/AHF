const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', async (request, response) => {
        response.render('public/index', {
            metaTags: {
                title: 'AHF - Home',
                description: 'User login page',
                keywords: 'Login and stuff'
            },
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
    })

    .get('/contact', async (request, response) => {
        response.render('public/contact', {
            metaTags: {
                title: 'AHF - Contact',
                description: 'User login page',
                keywords: 'Login and stuff'
            },
        })
    })

module.exports = router;