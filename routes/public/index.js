const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', async (request, response) => {
        const news = await controller.findPosts();
        const posts = news.reverse();
        response.render('public/index', {
            metaTags: {
                title: 'AHF - Home',
                description: '',
                keywords: ''
            },
            posts
        });
    })

    .get('/events', async (request,response) => {
        const user = request.session.user;
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('public/events', {
            user: user,
            messages: { errors, success },
            events: await controller.findEvents(user),
        });
        
    });

module.exports = router;