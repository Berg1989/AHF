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

.post('/createpost',

    [
        check('headline', 'Headline must be 1 character or longer')
            .not().isEmpty(),
        check('startdate', 'Start date not valid')
            .not().isEmpty(),
        check('enddate', 'end date not valid')
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
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = {headline: request.body.headline, startDate: request.body.startDate, endDate: request.body.endDate, body: request.body.body, deadline: request.body.deadline, maxparticipants: request.body.maxparticipants, price: print};
            response.redirect('/admin/news/eventedit/id=' + request.body._id);
        } else {
            const{headline, startDate, endDate, body, deadline, maxparticipants, price} = request.body;
            if(await controller.createEvent(headline, 'Oscar', startDate, endDate, body, deadline, maxparticipants, price)){
                request.session.success = { msg: 'Success - nyt event: ' + headline + ', er oprettet' };
                response.redirect('/admin/news/createevent')
            }
            
        
        }

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