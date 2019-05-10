const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();

router

    .post('/eventid=:eventid', async (request, response) => {
        const event = request.params.eventid;
        const user = request.session.user;
        try{
            if  (await controller.eventSignUp(event, user._id)) {
              //response.sendStatus(200);
                response.redirect('/events');  
            } 
        } catch (err) {
            response.sendStatus(405);
        }
    })

module.exports = router;