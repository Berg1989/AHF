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
        response.render('admin/index', { 
            layout: 'admin', 
            admin: request.session.admin 
        });

        console.log(request.session.admin);
        /*
        if (admin && admin.admintype.accesslevel < 3) {
            response.locals.metaTags = {
                title: 'Frontpage',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            response.render('admin/index', { admin, admintypes });
        } else {
            response.redirect('/');
        }*/
    });

module.exports = router;