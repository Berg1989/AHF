const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router

.get('/', async function (request, response) {
    /* if (request.session.user) response.redirect('/profile/id=' + request.session.user._id); */
    /* else { */
        response.locals.metaTags = {
            title: 'Login',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/news', {
            action: '/news',
            events: await controller.findEvents(),
            posts: await controller.findPosts(),
            errors: request.session.errors,
            email: request.session.email,
            inputs: request.session.inputs,
            user: request.session.user
        });
        request.session.errors = null;
        request.session.email = null;
        request.session.inputs = null;
    /* } */
})

.get('/createpost', function (request, response) {
    /* if (request.session.user) response.redirect('/profile/id=' + request.session.user._id); */
    /* else { */
        response.locals.metaTags = {
            title: 'Lav opslag',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/createpost', {
            action: '/createpost',
            errors: request.session.errors,
            email: request.session.email,
            inputs: request.session.inputs,
            user: request.session.user
        });
        request.session.errors = null;
        request.session.email = null;
        request.session.inputs = null;
    /* } */
})

.get('/createevent', function (request, response) {
    /* if (request.session.user) response.redirect('/profile/id=' + request.session.user._id); */
    /* else { */
        response.locals.metaTags = {
            title: 'Lav event',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/createevent', {
            action: '/createevent',
            errors: request.session.errors,
            email: request.session.email,
            inputs: request.session.inputs,
            user: request.session.user
        });
        request.session.errors = null;
        request.session.email = null;
        request.session.inputs = null;
    /* } */
})

.post('/createpost', async function (request, response) {
    const{body, headline} = request.body;
    await controller.createPost(body,headline, 'Kennet');
    response.redirect('/admin/news/')
})

.post('/createevent', async function (request, response) {
    const{headline, startDate, endDate, body, deadline, maxparticipants, price} = request.body;
    await controller.createEvent(headline, 'Oscar', startDate, endDate, body, deadline, maxparticipants, price);
    response.redirect('/admin/news/')
})

.delete('/delete/eventid=:id', async function (request, response) {
    
    try {
        if (await controller.deleteEvent(request.params.id)) response.sendStatus(200);
    } catch (err) {
        response.sendStatus(405);
    }
})

.delete('/delete/postid=:id', async function (request, response) {
    try {
        if (await controller.deletePost(request.params.id)) response.sendStatus(200);
    } catch (err) {
        response.sendStatus(405);
    }
})




//
// EDIT
//

.get('/postedit/id=:id', async (request, response) => {
    try {
        const post = await controller.findPost(request.params.id);
        if (post) {
            response.locals.metaTags = {
                title: 'Admin - edit user: ' + post.headline,
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('admin/post', {
                layout: 'admin',
                post,
                errors: request.session.errors,
                success: request.session.success
            });
            request.session.errors = null;
            request.session.success = null;
        }
    } catch (err) {
        response.render('error');
    }
})

.get('/eventedit/id=:id', async (request, response) => {
    try {
        const event = await controller.findEvent(request.params.id);
        if (event) {
            response.locals.metaTags = {
                title: 'Admin - edit user: ' + event.headline,
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('admin/event', {
                layout: 'admin',
                event,
                errors: request.session.errors,
                success: request.session.success
            });
            request.session.errors = null;
            request.session.success = null;
        }
    } catch (err) {
        response.render('error');
    }
})

.post('/eventedit/id=:id', async (request, response) => {
    const{headline, startDate, endDate, body, deadline, maxparticipants, price} = request.body;
    await controller.updateEvent(request.params.id, headline, 'Oscar', startDate, endDate, body, deadline, maxparticipants, price);
    response.redirect('/admin/news/')
})

.post('/postedit/id=:id', async (request, response) => {
    const{headline, body} = request.body;
    const id = request.params.id;
    await controller.updatePost(id,headline,body);
    response.redirect('/admin/news/')
})

module.exports = router;