const controller = require("../../controllers/controller");
const express = require('express');
const router = express.Router();

router

    .post('/eventid=:eventid/userid=:userid', async (request, response) => {
        const event = request.params.eventid;
        const user = request.params.userid;
        try{
            if  (await controller.eventSignUp(event, user) && await controller.userSignUp(event, user)) {
              //response.sendStatus(200);
                response.redirect('/events');  
            } 
        } catch (err) {
            response.sendStatus(405);
        }
    })

module.exports = router;