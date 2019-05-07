const controller = require("../../controllers/controller");
const shopController = require('../../controllers/shop');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', async (request, response) => {
        response.locals.metaTags = {
            title: 'Admin - Shop',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/shop/shop', { 
            layout: 'admin', 
            admin: request.session.admin 
        });
    })

    .get('/categories', async (request, response) => {
        // If level > 2 redirect
        response.locals.metaTags = {
            title: 'Admin - Shop - Categories',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/shop/categories', { 
            layout: 'admin', 
            success: request.session.success,
            errors: request.session.errors,
            inputs: request.session.inputs,
            categories: await shopController.findCategories()
        });

        request.session.success = null;
        request.session.errors = null;
        request.session.inputs = null;
    })

    .post('/categories', [
        check('name', 'Navn er påkrævet').isString().isLength({ min: 2 }).custom(async (name) => {
                if (await shopController.checkCategoryName(name)) {
                    return Promise.reject('Dette navn er allerede i brug');
                } else {
                    return true;
                }
            })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { name: request.body.name };
            response.redirect('/admin/shop/categories');
        } else {
            const name = request.body.name;
            const result = await shopController.createCategory(name);

            if (result) {
                request.session.success = { msg: 'Success! - ' + name + ' oprettet' };
                response.redirect('/admin/shop/categories');
            }
        }
    })

    .get('/categories/:id', async (request, response) => {
        // If level > 2 redirect
        response.locals.metaTags = {
            title: 'Admin - Shop - Categories - edit',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/shop/category', { 
            layout: 'admin',
            success: request.session.success,
            errors: request.session.errors,
            inputs: request.session.inputs,
            category: await shopController.findCategory(request.params.id), 
        });

        request.session.success = null;
        request.session.errors = null;
        request.session.inputs = null;
    })

    .post('/categories/:id', [
        check('name', 'Navn er påkrævet').isString().isLength({ min: 2 }).custom(async (name) => {
                if (await shopController.checkCategoryName(name)) {
                    return Promise.reject('Dette navn er allerede i brug');
                } else {
                    return true;
                }
            })
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { name: request.body.name };
            response.redirect('/admin/shop/categories/' + request.params.id);
        } else {
            const name = request.body.name;
            const result = await shopController.updateCategory(request.params.id, name);

            if (result) {
                request.session.success = { msg: 'Success! - ' + name + ' opdateret' };
                response.redirect('/admin/shop/categories/' + request.params.id);
            }
        }
    })

    .get('/categories/:id/products/:productid', async (request, response) => {
        // If level > 2 redirect
        response.locals.metaTags = {
            title: 'Admin - Shop - Categories - edit',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/shop/categories', { 
            layout: 'admin',
            success: request.session.success,
            errors: request.session.errors,
            inputs: request.session.inputs,
            categories: await shopController.findCategories(), 
            product: await shopController.findProduct(request.params.productid)
        });

        request.session.success = null;
        request.session.errors = null;
        request.session.inputs = null;
    })

module.exports = router;