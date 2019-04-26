const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', function (request, response) {
        const user = request.session.user;
        if (!user) {
            response.redirect('/login');
        } else {
            response.render('profile', { user });
            request.session.errors = null;
        }
    })
    .post('/logout', async (request, response) => {
        request.session.destroy(err => { 
            if (err) { 
                console.log(err);     
            } else {
                response.redirect('/login');
            }
        });
    });

module.exports = router;