const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', (request, response) => {
        const user = request.session.user;
        if (!user) {
            response.redirect('/login');
        } else {
            response.redirect('/profile/' + user._id)
        }
    })
    .get('/:id', (request, response) => {
        const user = request.session.user;
        if (user) {
            if (user._id === request.params.id) {
                response.render('profile', { user });
                request.session.errors = null;
            } else {
                response.redirect('/profile/' + user._id);
            }
        } else {
            response.redirect('/login');
        } 
    })
    .post('/logout', (request, response) => {
        request.session.destroy(err => {
            if (err) {
                console.log(err);
            } else {
                response.redirect('/login');
            }
        });
    });

module.exports = router;