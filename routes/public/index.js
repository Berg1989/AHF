const postController = require("../../controllers/postController");
const eventController = require("../../controllers/eventController");
const express = require('express');
const router = express.Router();

router
    .get('/', async (request, response) => {
        const news = await postController.findPosts();
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
            events: await eventController.findEvents(user),
        });
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