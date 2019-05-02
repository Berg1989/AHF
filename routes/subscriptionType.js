const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();


router
.get('/', async (request, response) => {
    response.render('subscriptionType');
})
//.get('/subscriptionTypes', (request,response) =>{
  //  controller.getSubTypes().then(result =>{
    //    response.send(result);
    //});
//})

.post('/subscriptionTypes', (request,response) =>{
    const {name, duration, mdrPrice} = request.body;
    controller.createSubType(name, duration, mdrPrice)
        .then (() => response.json({message: "SubscriptionType saved"}))
        .catch(err =>{
            console.log("Error " + err);
            if(err.stack) console.error(err.stack);
            response.status(500).send(err);
        });
});

//.delete('/subscriptionTypes/:_ID', (request,response) =>{
//});



module.exports = router;