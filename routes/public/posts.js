const postController = require("../../controllers/postController");
const express = require('express');
const router = express.Router();


router

    .get('/', async (request, response) => {
        response.redirect('back');
    })


    .get('/:id', async function (request, response) {
        const post = await postController.findPost(request.params.id);
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