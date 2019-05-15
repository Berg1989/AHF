const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');


router

    .get('/', async (request, response) => {
        response.redirect('back');
    })


    .get('/:id', async function (request, response) {
        const post = await controller.findPost(request.params.id);
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('public/postView', {
            metaTags: {
                title: 'AHF - ' + post.headline,
                description: 'User login page',
                keywords: 'Login and stuff'
            },
            action: '/postView',
            posts: post,
            messages: { errors, success },
            inputs: request.inputs,
            user: request.user

        });
        request.session.inputs = null;
    })





module.exports = router;