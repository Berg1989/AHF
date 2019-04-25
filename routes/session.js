const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
.post('/', function (request, response) {
    const {navn, password} = request.body;
    if (navn === 'nn' && password === 'pp') {
        request.session.navn = navn;
        response.send({ok: true});
    } else {
        response.send({ok: false});
    }
})

.get('/', function (request, response) {
    const navn = request.session.navn; //id is better
    if (navn) {
        response.render('session', {navn});
    }
    else {
        response.render('login');
    }
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