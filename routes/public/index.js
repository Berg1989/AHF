const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', async (request, response) => {
        
        const user = request.user;
        response.render('public/index', {
            metaTags: {
                title: 'AHF - Home',
                description: '',
                keywords: ''
            },
            posts: await controller.findPosts()
        });
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