const controller = require("../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', function (request, response) {
        response.locals.metaTags = {
            title: 'Home',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
            response.render('index', { layout: 'main' });
            request.session.errors = null;
    });

module.exports = router;