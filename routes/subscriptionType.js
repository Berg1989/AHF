const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');


router
.get('/', async (request, response) => {
    response.locals.metaTags = {
        title: 'Kontingenter',
        description: 'Here goes the description',
        keywords: 'Here goes keywords'
    };
    response.render('subscriptionType', {
        layout: 'main',
        success: request.session.success,
        errors: request.session.errors,
        goodErrors: request.session.goodErrors,
        subtypes: request.session.subtypes = await controller.getSubTypes()
    });
    //console.log(await controller.getSubTypes());
    //request.session.subtypes = await controller.getSubTypes();
    request.session.errors = null;
    request.session.goodErrors = null;
})

.post('/', [
    //checks if sub name is defined
    check('name', 'Kontingent skal defineres')
    .isLength({min: 2}),
    //checks if duration of sub is defined
    check('duration', 'Kontingent længde skal defineres')
    .isLength({min: 1}),
    //checks if sub price is defined
    check('mdrPrice', 'Pris skal defineres')
    .isLength({min: 1})
],
async (request,response) =>{
    const {name, duration, mdrPrice} = request.body;
    const exists = await controller.findSubType(name);
    const errors = validationResult(request);
    const goodErrors = validationResult(request);
    if(!errors.isEmpty()) {
        request.session.errors = await errors.array();
        response.redirect('/subscriptionType');
    }
    if(!exists){
        const result = await controller.createSubType(name, duration, mdrPrice)
        if(result){
            request.session.goodErrors = [{ message: 'Kontingent oprettet' }];
            request.session.subType = result;
            request.session.success = true;
            response.redirect('/subscriptionType');
        }
    }else{
        request.session.errors = [{ msg: 'Kontingent eksisterer allerede' }];
        request.session.name = request.body.name;
        request.session.success = false;
        response.redirect('/subscriptionType');
        
    };
})


// skal laves om vv
.delete('/',[
//skal tjekke om der er flere kontingenter før man sletter
], async (request, response) => {
    
    const element = request.subType;
    const errors = validationResult(request);
    const goodErrors = validationResult(request);
    //if(!errors.isEmpty()) {
    //    request.session.errors = await errors.array();
    //    response.redirect('/subscriptionType');
    //}
    if(element){
        await controller.deleteSubType(element._id);
        if(controller.findSubType(element.name) == null){
            request.session.goodErrors = [{ message: 'Kontingent slettet' }];
            response.redirect('/subscriptionType');
        }
    }else{
        request.session.errors = [{ msg: 'Der er ikke nogle kontingenter at slette' }];
        response.redirect('/subscriptionType');
    }
    console.log(element);
    //Sletningen kan gøres via:
    //radiobuttons
    //formcontrol med en selection list som viser information om det valgte kontingent
})



module.exports = router;