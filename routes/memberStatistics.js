const controller = require("../controllers/controller");
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

router

.get('/', async (request, response) => {
    response.locals.metaTags = {
        title: 'Medlems statistik',
        description: 'Here goes the description',
        keywords: 'Here goes keywords'
    };    
    const statistics = request.session.statistics;
    response.render('memberStatistics', {layout: 'main'});
})

module.exports = router;