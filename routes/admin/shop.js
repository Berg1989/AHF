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

    .delete('/categories/:id', async (request, response) => {
        try {
            const category = await shopController.findCategory(request.params.id);
            if (category) {
                for (let product of category.products) {
                    await shopController.deleteProduct(product._id);
                }

                const result = await shopController.deleteCategory(request.params.id);

                if (result) {
                    response.sendStatus(200);
                } else {
                    throw new Error('Der skete en fejl prøv igen senere')
                }
            }
        } catch (err) {
            request.session.errors = { msg: err };
            response.redirect('/admin/shop/categories')
        }
        

    })

    //Create product
    .post('/categories/:id/products', [
        check('pname', 'Navn er påkrævet').isString().isLength({ min: 2 }).custom(async (name) => {
            if (await shopController.checkProductName(name)) {
                return Promise.reject('Dette navn er allerede i brug');
            } else {
                return true;
            }
        }),
        check('pprice').isDecimal(),
        check('psize').isString()
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { name: request.body.pname, price: request.body.pprice, size: request.body.psize };
            response.redirect('/admin/shop/categories/' + request.params.id);
        } else {
            const { pname, pprice, psize } = request.body;
            const product = await shopController.createProduct(pname, pprice, psize, request.params.id);
            const connect = await shopController.addProduktToCategory(request.params.id, product._id);
            if (product && connect) {
                request.session.success = { msg: 'Success! - ' + pname + ' er oprettet' };
                response.redirect('/admin/shop/categories/' + request.params.id);

            } else {
                request.session.errors = { msg: 'UPS! der skete en fejl prøv igen senere' };
                response.redirect('/admin/shop/categories/' + request.params.id);
            }
        }
    })

    .get('/categories/:id/products/:productid', async (request, response) => {
        response.locals.metaTags = {
            title: 'Admin - Shop - Edit product',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/shop/product', {
            layout: 'admin',
            success: request.session.success,
            errors: request.session.errors,
            categories: await shopController.findCategories(),
            product: await shopController.findProduct(request.params.productid)
        });

        request.session.success = null;
        request.session.errors = null;
    })

    //EDIT
    .post('/categories/:id/products/:productid', [
        check('name', 'Navn er påkrævet').isString().isLength({ min: 2 }),
        check('price').isDecimal(),
        check('size').isString(),
        check('category').not().isEmpty()
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/admin/shop/categories/' + request.params.id + '/products/' + request.params.productid);
        } else {
            try {
                const { name, price, size, category } = request.body;
                const product = await shopController.updateProduct(request.params.productid, name, price, size, category);

                if (request.params.id !== category) {
                    const dc = await shopController.removeProduktFromCategory(request.params.id, request.params.productid);
                    const connect = await shopController.addProduktToCategory(category, request.params.productid);
                    if (!dc && !connect) {
                        throw new Error('DC failed');
                    }
                }
                if (product) {
                    request.session.success = { msg: 'Success! - produktet er opdateret' };
                    response.redirect('/admin/shop/categories/' + category + '/products/' + request.params.productid);
                } else {
                    throw new Error('Product update failed');
                }
            } catch (err) {
                request.session.errors = { msg: err };
                response.redirect('/admin/shop/categories/' + request.params.id + '/products/' + request.params.productid);
            }
        }
    })

    .delete('/products/:id', async (request, response) => {
        try {
            const product = await shopController.findProduct(request.params.id);
            if (product) {
                const result = await shopController.deleteProduct(product._id);
                const dc = await shopController.removeProduktFromCategory(product.category._id, product._id);

                if (result && dc) {
                    response.sendStatus(200);
                } else {
                    throw new Error('Der skete en fejl prøv igen senere')
                }
            }
        } catch (err) {
            request.session.errors = { msg: err };
            response.redirect('/admin/shop/categories/' + product.category._id);
        }

    });

module.exports = router;