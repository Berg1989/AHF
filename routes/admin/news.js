const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');
const auth = require('../../middleware/authentications');
const validate = require('../../middleware/validations');

router

    .get('/', /* auth.adminIsLoggedIn , */async function (request, response) {
        const errors = request.flash('error');
        const success = request.flash('success');
        response.locals.metaTags = {
            title: 'Login',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/news', {
            action: '/news',
            events: await controller.findEvents(),
            posts: await controller.findPosts(),
            messages: { errors, success }
        });
    })

    .get('/createpost', /* auth.adminIsLoggedIn , */function (request, response) {
        const user = request.user;
        const errors = request.flash('error');
        const success = request.flash('success');
        if (user) {
            response.locals.metaTags = {
                title: 'Lav opslag',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('admin/createpost', {
                action: '/createpost',
                messages: { errors, success },
                inputs: request.session.inputs,
                user: request.user
            });
            request.session.inputs = null;
        } else {
            response.redirect('/');
        }
    })

    .get('/createevent', function (request, response) {
        const user = request.user;
        const errors = request.flash('error');
        const success = request.flash('success');
        if (user) {

            response.locals.metaTags = {
                title: 'Lav event',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('admin/createevent', {
                action: '/createevent',
                messages: { errors, success },
                inputs: request.session.inputs,
                user: user
            });
            request.session.inputs = null;


        } else {
            response.redirect('/');
        }
    })

    .post('/createevent', validate.eventInfoCheck, /* auth.adminIsLoggedIn, */ async (request, response) => {
        const user = request.user;
        if (user) {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                request.flash('error', await errors.array());
                request.session.inputs = { headline: request.body.headline, startDate: request.body.startDate, endDate: request.body.endDate, body: request.body.body, deadline: request.body.deadline, maxparticipants: request.body.maxparticipants, price: request.body.price };
                response.redirect('/admin/news/createevent')
            } else {
                const { headline, startDate, endDate, body, deadline, maxparticipants, price } = request.body;
                if (await controller.createEvent(headline, user.info.firstname, startDate, endDate, body, deadline, maxparticipants, price)) {

                    request.flash('success', 'Success - Ny begivenhed: ' + headline + ', er oprettet');
                    response.redirect('/admin/news')
                }

            }

        }
    })


    .post('/createpost', validate.postInfoCheck, /* auth.adminIsLoggedIn, */ async (request, response) => {
        const user = request.user;
        if (user) {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                request.flash('error', await errors.array());
                request.session.inputs = { headline: request.body.headline, body: request.body.body };
                response.redirect('/admin/news/createpost')
            } else {
                const { headline, body } = request.body;
                if (await controller.createPost(headline, body, user.info.firstname)) {

                    request.flash('success', 'Success - Nyt opslag: ' + headline + ', er oprettet')
                    response.redirect('/admin/news')
                }

            }

        }
    })

    .delete('/delete/eventid=:id', auth.adminIsLoggedIn, async function (request, response) {
        try {
            if (await controller.deleteEvent(request.params.id)) response.sendStatus(200);
        } catch (err) {
            response.sendStatus(405);
        }
    })

    .delete('/delete/postid=:id', auth.adminIsLoggedIn, async function (request, response) {
        try {
            if (await controller.deletePost(request.params.id)) response.sendStatus(200);
        } catch (err) {
            response.sendStatus(405);
        }
    })




    //
    // EDIT
    //

    .get('/postedit/:id',/* auth.adminIsLoggedIn, */ async (request, response) => {

        const errors = request.flash('error');
        const success = request.flash('success');

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
                    inputs: request.session.inputs,
                    messages: { errors, success }
                });
                request.session.inputs = null;
            }
        } catch (err) {
            response.render('error');
        }
    })

    .get('/eventedit/:id',/* auth.adminIsLoggedIn, */ async (request, response) => {

        const errors = request.flash('error');
        const success = request.flash('success');
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
                    inputs: request.session.inputs,
                    messages: { errors, success }
                });
                request.session.inputs = null;
            }
        } catch (err) {
            response.render('error');
        }

    })

    .post('/eventedit/:id', validate.eventInfoCheck/* , auth.adminIsLoggedIn */, async (request, response) => {
        const user = request.user;

        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            request.session.inputs = { headline: request.body.headline, startDate: request.body.startDate, endDate: request.body.endDate, body: request.body.body, deadline: request.body.deadline, maxparticipants: request.body.maxparticipants, price: request.body.price };
            response.redirect('/admin/news/eventedit/' + request.params.id)
        } else {
            const { headline, startDate, endDate, body, deadline, maxparticipants, price } = request.body;
            if (await controller.updateEvent(request.params.id, headline, user.info.firstname, startDate, endDate, body, deadline, maxparticipants, price)) {

                request.flash('success', 'Success - Begivenheden: ' + headline + ' er opdateret');
                response.redirect('/admin/news');
            }
        }
    })

    .post('/postedit/:id', validate.postInfoCheck/* , auth.adminIsLoggedIn */, async (request, response) => {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                request.flash('error', await errors.array());
                request.session.inputs = { headline: request.body.headline, body: request.body.body };
                response.redirect('/admin/news/postedit/' + request.params.id)
            } else {
                const { headline, body } = request.body;
                if (await controller.updatePost(request.params.id, headline, body)) {
                    request.flash('success', 'Success - opslag: ' + headline + ', er opdateret');
                    response.redirect('/admin/news')
                }
            }
    })

module.exports = router;