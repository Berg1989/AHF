const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router

    //Admin root
    .get('/', async (request, response) => {
        response.locals.metaTags = {
            title: 'Admin - Home',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/index', { layout: 'admin', user: request.session.user });
        /*
        if (user && user.usertype.accesslevel < 3) {
            response.locals.metaTags = {
                title: 'Frontpage',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('admin/index', { user, usertypes });
        } else {
            response.redirect('/');
        }*/
    });

module.exports = router;