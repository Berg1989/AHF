const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router
.post('/', function (request, response) {
    const {firstname, lastname, email, password} = request.body;
    controller.createUser(firstname, lastname, email, password)
    .then(result => response.json({message: 'user saved!', user: result}))
    .catch(err => {
        console.error("Error: " + err);
        if (err.stack) console.error(err.stack);
        response.status(500).send(err);
    });
    /*
    if (navn === 'nn' && password === 'pp') {
        request.session.navn = navn;
        response.send({ok: true});
    } else {
        response.send({ok: false});
    }*/
});

module.exports = router;