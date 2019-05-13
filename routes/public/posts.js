const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');


router

    .get('/', async (request, response) => {
        const user = request.user;
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('public/posts', {
            user: user,
            messages: { errors, success }
        });
        //request.session.success = null;
        //request.session.errors = null;
    })


    .get('/:id', async function (request, response) {
        const post = await controller.findPost(request.params.id);
        const errors = request.flash('error');
        const success = request.flash('success');
        response.locals.metaTags = {
            title: 'Login',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('public/postView', {
            action: '/postView',
            posts: post,
            messages: { errors, success },
            inputs: request.inputs,
            user: request.user

        });
        request.session.inputs = null;
    })





module.exports = router;