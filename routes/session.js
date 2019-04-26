const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
.post('/', async (request, response) => {
    const {username, password} = request.body;
    const result = await controller.login(username, password);
    if (result) {
        request.session.username = username;
        response.send({ok : result});
    } else {
        response.send({ok : result});
    }
})

.get('/', function (request, response) {
    response.render('login', {errors : request.session.errors});
    request.session.errors = null;
})

.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            response.redirect('/');
        }
    });
});

module.exports = router;