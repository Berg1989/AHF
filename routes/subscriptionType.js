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

.post('/', async (request,response) =>{
    const {name, duration, mdrPrice} = request.body;
    const exists = await controller.findSubType(name);
    if(!exists){
        const result = await controller.createSubType(name, duration, mdrPrice)
        if(result){
            request.session.subType = result;
            request.session.success = true;
            response.redirect('/subscriptionType');
        }
    }else{
        request.session.success = false;
        request.redirect('/subscriptionType');
    }
});

//.delete('/subscriptionTypes/:_ID', (request,response) =>{
//});



module.exports = router;