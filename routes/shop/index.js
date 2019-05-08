const controller = require("../../controllers/controller");
const shopController = require('../../controllers/shop');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', async (request, response) => {
        response.locals.metaTags = {
            title: 'Shoppen',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('shop/index', {
            layout: 'shop',
            categories: await shopController.findCategoriesNoProducts()
        });
    })

    .get('/category/:id', async (request, response) => {
        response.locals.metaTags = {
            title: 'Shoppen',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('shop/category', {
            layout: 'shop',
            success: request.session.success,
            errors: request.session.errors,
            categories: await shopController.findCategoriesNoProducts(),
            category: await shopController.findCategory(request.params.id)
        });

        request.session.success = null;
        request.session.errors = null;
    });

module.exports = router;