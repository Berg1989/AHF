const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router

    .get('/', function (request, response) {
        response.render('userprofiles', { success: request.session.success, errors: request.session.errors, user: request.session.user });
        request.session.errors = null;
    })

    .get('/userprofiles', async (request, response) => {
        const { name } = request.body;
        const users = await controller.findMembersByText(name);
        return await users.json();
    }

    

    )


    
module.exports = router;