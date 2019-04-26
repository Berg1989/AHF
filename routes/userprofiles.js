const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router

    .get('/', function (request, response) {
        response.render('userprofiles', { success: request.session.success, errors: request.session.errors, user: request.session.user });
        request.session.errors = null;
    })

module.exports = router;