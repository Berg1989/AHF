const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router

.get('/', function (request, response) {
    /* if (request.session.user) response.redirect('/profile/id=' + request.session.user._id); */
    /* else { */
        response.locals.metaTags = {
            title: 'Login',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/news', {
            action: '/news',
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

module.exports = router;