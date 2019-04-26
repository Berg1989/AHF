const controller = require("../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', function (request, response) {
        if (!request.session.user) {
            response.render('registration', { success: request.session.success, errors: request.session.errors, user: request.session.user });
            request.session.errors = null;
        } else {
            response.redirect('/');
        }
        
    })

module.exports = router;