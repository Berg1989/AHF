const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router

    .get('/', async function (request, response) {
        
        response.locals.metaTags = {
            title: 'Login',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/news', {
            action: '/news',
            events: await controller.findEvents(),
            posts: await controller.findPosts(),
            success: request.session.success,
            errors: request.session.errors,
            email: request.session.email,
            inputs: request.session.inputs,
            user: request.session.user
            
        });
        request.session.errors = null;
        request.session.email = null;
        request.session.inputs = null;
    })

    .get('/createpost', function (request, response) {
        const user = request.session.user;
        if (user && user.usertype.level == 1) {
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
        } else {
            response.redirect('/');
        }
    })

    .get('/createevent', function (request, response) {
        const user = request.session.user;
        if (user && user.usertype.level == 1) {

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
                user: user
            });
            request.session.errors = null;
            request.session.email = null;
            request.session.inputs = null;

        } else {
            response.redirect('/');
        }
    })

    .post('/createevent',

        [
            check('headline', 'Headline must be 1 character or longer')
                .not().isEmpty(),
            check('startDate', 'Start date not valid')
                .not().isEmpty(),
            check('endDate', 'end date not valid')
                .not().isEmpty(),
            check('deadline', 'deadline not valid')
                .not().isEmpty(),
            check('body', 'The description must be 1 character or longer')
                .not().isEmpty(),
            check('maxparticipants', 'Please enter number of participants')
                .isNumeric(),
            check('price', 'Please input a price')
                .isNumeric()
        ], async (request, response) => {
            const user = request.session.user;
            if (user && user.usertype.level == 1) {

                const errors = validationResult(request);
                if (!errors.isEmpty()) {
                    request.session.errors = await errors.array();
                    request.session.inputs = { headline: request.body.headline, startDate: request.body.startDate, endDate: request.body.endDate, body: request.body.body, deadline: request.body.deadline, maxparticipants: request.body.maxparticipants, price: request.body.price };
                    response.redirect('/admin/news/createevent')
                } else {
                    const { headline, startDate, endDate, body, deadline, maxparticipants, price } = request.body;
                    if (await controller.createEvent(headline, user.info.firstname, startDate, endDate, body, deadline, maxparticipants, price)) {

                        request.session.success = { msg: 'Success - nyt event: ' + headline + ', er oprettet' };
                        response.redirect('/admin/news')
                    }

                }

            }
        })


    .post('/createpost',

        [
            check('headline', 'Headline must be 1 character or longer')
                .not().isEmpty(),
            check('body', 'The description must be 1 character or longer')
                .not().isEmpty(),
        ], async (request, response) => {
            const user = request.session.user;
            if (user && user.usertype.level == 1) {

                const errors = validationResult(request);
                if (!errors.isEmpty()) {
                    request.session.errors = await errors.array();
                    request.session.inputs = { headline: request.body.headline, body: request.body.body };
                    response.redirect('/admin/news/createpost')
                } else {
                    const { headline, body } = request.body;
                    if (await controller.createPost(headline, body, user.info.firstname)) {

                        request.session.success = { msg: 'Success - nyt opslag: ' + headline + ', er oprettet' };
                        response.redirect('/admin/news')
                    }

                }

            }
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
        const user = request.session.user;
        if (user && user.usertype.level == 1) {
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
                        errors: request.session.errors,
                        success: request.session.success
                    });
                    request.session.errors = null;
                    request.session.success = null;
                }
            } catch (err) {
                response.render('error');
            }
        } else {
            response.redirect('/');
        }
    })

    .get('/eventedit/id=:id', async (request, response) => {
        const user = request.session.user;
        if (user && user.usertype.level == 1) {
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
                        errors: request.session.errors,
                        success: request.session.success
                    });
                    request.session.errors = null;
                    request.session.success = null;
                }
            } catch (err) {
                response.render('error');
            }
        } else {
            response.redirect('/');
        }
    })

    .post('/eventedit/id=:id', 
        [
            check('headline', 'Headline must be 1 character or longer')
                .not().isEmpty(),
            check('startDate', 'Start date not valid')
                .not().isEmpty(),
            check('endDate', 'end date not valid')
                .not().isEmpty(),
            check('deadline', 'deadline not valid')
                .not().isEmpty(),
            check('body', 'The description must be 1 character or longer')
                .not().isEmpty(),
            check('maxparticipants', 'Please enter number of participants')
                .isNumeric(),
            check('price', 'Please input a price')
                .isNumeric()
        ], async (request, response) => {
            const user = request.session.user;
            if (user && user.usertype.level == 1) {
                const errors = validationResult(request);
                if (!errors.isEmpty()) {
                    request.session.errors = await errors.array();
                    request.session.inputs = { headline: request.body.headline, startDate: request.body.startDate, endDate: request.body.endDate, body: request.body.body, deadline: request.body.deadline, maxparticipants: request.body.maxparticipants, price: request.body.price };
                    response.redirect('/admin/news/eventedit/id=' + request.params.id)
                } else {
                    const { headline, startDate, endDate, body, deadline, maxparticipants, price } = request.body;
                    if (await controller.updateEvent(request.params.id, headline, user.info.firstname, startDate, endDate, body, deadline, maxparticipants, price)) {

                        request.session.success = { msg: 'Success - event: ' + headline + ', er opdateret' };
                        response.redirect('/admin/news')
                    }
                }
            } else {
                response.redirect('/');
            }
            
        })

    .post('/postedit/id=:id', [
        check('headline', 'Headline must be 1 character or longer')
            .not().isEmpty(),
        check('body', 'The description must be 1 character or longer')
            .not().isEmpty(),
    ], async (request, response) => {
        const user = request.session.user;
        if (user && user.usertype.level == 1) {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                request.session.errors = await errors.array();
                request.session.inputs = { headline: request.body.headline, body: request.body.body };
                response.redirect('/admin/news/postedit/id=' + request.params.id)
            } else {
                const { headline, body } = request.body;
                if (await controller.updatePost(request.params.id, headline, body)) {
                    request.session.success = { msg: 'Success - opslag: ' + headline + ', er opdateret' };
                    response.redirect('/admin/news')
                }

            } 

        }  else {
            response.redirect('/');
        }
    })

module.exports = router;