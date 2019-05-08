const controller = require("../../controllers/controller");
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router

    .post('/', async (request, response) => {
        const user = request.session.user;
        response.redirect('/events')
    })

module.exports = router;