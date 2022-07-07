const postController = require("../../controllers/postController");
const eventController = require("../../controllers/eventController");
const express = require('express');
const { validationResult } = require('express-validator/check');
const router = express.Router();
const auth = require('../../middleware/authentications');
const validate = require('../../middleware/validations');

router

    .get('/', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');

        response.render('admin/news', {
            metaTags: {
                title: 'AHF - Begivenheder',
                description: 'User login page',
                keywords: 'Login and stuff'
            },
            layout: 'admin',
            action: '/news',
            events: await eventController.findEvents(),
            posts: await postController.findPosts(),
            messages: { errors, success }
        });
    })

    .get('/createpost', auth.adminIsLoggedIn, (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');

        response.render('admin/createpost', {
            metaTags: {
                title: 'AHF - Opret opslag',
                description: 'User login page',
                keywords: 'Login and stuff'
            },
            layout: 'admin',
            messages: { errors, success },
            inputs: request.session.inputs,
        });
        request.session.inputs = null;
    })

    .get('/createevent', auth.adminIsLoggedIn, (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');

        response.render('admin/createevent', {
            metaTags: {
                title: 'AHF - Opret begivenhed',
                description: 'User login page',
                keywords: 'Login and stuff'
            },
            layout: 'admin',
            action: '/createevent',
            messages: { errors, success },
            inputs: request.session.inputs,
        });
        request.session.inputs = null;
    })

    .post('/createevent', validate.eventInfoCheck, auth.adminIsLoggedIn, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            request.session.inputs = { headline: request.body.headline, startDate: request.body.startDate, endDate: request.body.endDate, body: request.body.body, deadline: request.body.deadline, maxparticipants: request.body.maxparticipants, price: request.body.price };
            response.redirect('/admin/news/createevent')
        } else {
            const { headline, startDate, endDate, body, deadline, maxparticipants, price } = request.body;
            if (await eventController.createEvent(headline, request.user.info.firstname, startDate, endDate, body, deadline, maxparticipants, price)) {

                request.flash('success', 'Success - Ny begivenhed: ' + headline + ', er oprettet');
                response.redirect('/admin/news')
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }

        }
    })


    .post('/createpost', validate.postInfoCheck, auth.adminIsLoggedIn, async (request, response) => {

        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            request.session.inputs = { headline: request.body.headline, body: request.body.body };
            response.redirect('/admin/news/createpost')
        } else {
            const { headline, body } = request.body;
            if (await postController.createPost(headline, body, request.user.info.firstname)) {

                request.flash('success', 'Success - Nyt opslag: ' + headline + ', er oprettet')
                response.redirect('/admin/news')
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }

        }
    })

    .delete('/delete/eventid=:id', auth.adminIsLoggedIn, async (request, response) => {
        try {
            if (await eventController.deleteEvent(request.params.id)) {
                request.flash('success', 'Success - Begivenheden er slettet');
                response.sendStatus(200);
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }
        } catch (err) {
            response.sendStatus(405);
        }
    })

    .delete('/delete/postid=:id', auth.adminIsLoggedIn, async (request, response) => {
        try {
            if (await postController.deletePost(request.params.id)) {
                request.flash('success', 'Success - Opslaget er slettet');
                response.sendStatus(200);
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }

        } catch (err) {
            response.sendStatus(405);
        }
    })




    //
    // EDIT
    //

    .get('/postedit/:id', auth.adminIsLoggedIn, async (request, response) => {

        const errors = request.flash('error');
        const success = request.flash('success');
        try {
            const post = await postController.findPost(request.params.id);
            if (post) {
                response.render('admin/post', {
                    metaTags: {
                        title: 'AHF - ' + post.headline,
                        description: 'User login page',
                        keywords: 'Login and stuff'
                    },
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

    .get('/eventedit/:id', auth.adminIsLoggedIn, async (request, response) => {

        const errors = request.flash('error');
        const success = request.flash('success');
        try {
            const event = await eventController.findEvent(request.params.id);
            if (event) {
                response.render('admin/event', {
                    metaTags: {
                        title: 'AHF - ' + event.headline,
                        description: 'User login page',
                        keywords: 'Login and stuff'
                    },
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

    .post('/eventedit/:id', validate.eventInfoCheck, auth.adminIsLoggedIn, async (request, response) => {

        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            request.session.inputs = { headline: request.body.headline, startDate: request.body.startDate, endDate: request.body.endDate, body: request.body.body, deadline: request.body.deadline, maxparticipants: request.body.maxparticipants, price: request.body.price };
            response.redirect('/admin/news/eventedit/' + request.params.id)
        } else {
            const { headline, startDate, endDate, body, deadline, maxparticipants, price } = request.body;
            if (await eventController.updateEvent(request.params.id, headline, request.user.info.firstname, startDate, endDate, body, deadline, maxparticipants, price)) {
                request.flash('success', 'Success - Begivenheden: ' + headline + ' er opdateret');
                response.redirect('/admin/news');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('/admin/news');
            }
        }
    })

    .post('/postedit/:id', validate.postInfoCheck, auth.adminIsLoggedIn, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            request.session.inputs = { headline: request.body.headline, body: request.body.body };
            response.redirect('/admin/news/postedit/' + request.params.id)
        } else {
            const { headline, body } = request.body;
            if (await postController.updatePost(request.params.id, headline, body)) {
                request.flash('success', 'Success - opslag: ' + headline + ', er opdateret');
                response.redirect('/admin/news')
            }
            else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('/admin/news');
            }
        }
    })

module.exports = router;