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
    .get('/edit', (request, response) => {
        const user = request.session.user;
        if (!user) {
            response.redirect('/login');
        } else {
            response.render('editProfile', { user });
        }
    })
    .get('/:id', async (request, response) => {
        const user = request.session.user;
        const result = await controller.getMemberById(request.params.id);
        if (result) {
            response.locals.metaTags = {
                title: 'Profile - ' + result.firstname,
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            };
            if (user && user._id === request.params.id) {
                response.render('personalProfile', { user });
            } else {
                response.render('profile', { result });
            }
        } else {
            response.sendStatus(404); //render error
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