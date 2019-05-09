const controller = require("../../controllers/controller");
const shopController = require('../../controllers/shop');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
//const multer = require('multer'); //Multipart form data (files)
const upload = require('../../middleware/upload');

router
    .get('/', async (request, response) => {
        response.locals.metaTags = {
            title: 'Admin - Shop',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/shop/shop', {
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

    //Create category
    .post('/categories', [
        check('Cname', 'Navn er påkrævet').isString().isLength({ min: 2 }).custom(async (name) => {
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
            request.session.inputs = { Cname: request.body.Cname };
            response.redirect('/admin/shop');
        } else {
            const result = await shopController.createCategory(request.body.Cname);

            if (result) {
                request.session.success = { msg: 'Success! - ' + result.name + ' oprettet' };
                response.redirect('/admin/shop');
            }
        }
    })

    //Edit category
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

    //Delete category
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
    .post('/products', upload.single('productImage'), [
        check('name', 'Navn er påkrævet').isString().isLength({ min: 2 }).custom(async (name) => {
            if (await shopController.checkProductName(name)) {
                return Promise.reject('Dette navn er allerede i brug');
            } else {
                return true;
            }
        }),
        check('price', 'Pris er påkrævet').isDecimal(),
        check('size', 'Størrelse er påkrævet').isString().isLength({min: 1})
    ], async (request, response) => {
        console.log(request.file);
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            request.session.inputs = { name: request.body.name, price: request.body.price, size: request.body.size };
            response.redirect('/admin/shop');
        } else {
            const { name, price, size, category, image } = request.body;
            const product = await shopController.createProduct(name, price, size, '/uploads/' + request.file.filename);
            const connect = await shopController.addProduktToCategory(category, product._id);
            if (product && connect) {
                request.session.success = { msg: 'Success! - ' + name + ' er oprettet' };
                response.redirect('/admin/shop');

            } else {
                request.session.errors = { msg: 'UPS! der skete en fejl prøv igen senere' };
                response.redirect('/admin/shop');
            }
        }
    })

    //Edit product
    .get('/categories/:id/products/:pid', async (request, response) => {
        response.locals.metaTags = {
            title: 'Admin - Shop - Edit product',
            description: 'Here goes the description',
            keywords: 'Here goes keywords'
        };
        response.render('admin/shop/product', {
            layout: 'admin',
            success: request.session.success,
            errors: request.session.errors,
            product: await shopController.findProduct(request.params.pid),
            category: await shopController.findCategory(request.params.id),
        });

        request.session.success = null;
        request.session.errors = null;
        request.session.inputs = null;
    })

    .post('/categories/:id/products/:pid', [
        check('name', 'Navn er påkrævet').isString().isLength({ min: 2 }).custom(async (name, { req }) => {
            if (req.body.name !== name) {
                if (await shopController.checkProductName(name)) return Promise.reject('Dette navn er allerede i brug');
                else return true;
            } else {
                return true;
            }
        }),
        check('price').isDecimal(),
        check('size').isString()
    ], async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.session.errors = await errors.array();
            response.redirect('/admin/shop/categories/' + request.params.id + '/products/' + request.params.pid);
        } else {
            try {
                const { category, name, price, size } = request.body;
                const product = await shopController.updateProduct(request.params.pid, name, price, size);

                if (product) {
                    request.session.success = { msg: 'Success! - produktet er opdateret' };
                    response.redirect('/admin/shop/categories/' + request.params.id + '/products/' + request.params.pid);
                } else {
                    throw new Error('Product update failed');
                }
            } catch (err) {
                request.session.errors = { msg: 'Ups der skete en fejl' };
                response.redirect('/admin/shop/categories/' + request.params.id + '/products/' + request.params.pid);
            }
        }
    })

    //Delete product
    .delete('categories/:id/products/:pid', async (request, response) => {
        try {
            const product = await shopController.findProduct(request.params.id);
            if (product) {
                const result = await shopController.deleteProduct(product._id);
                const dc = await shopController.removeProduktFromCategory(request.params.id, product._id);

                if (result && dc) {
                    response.sendStatus(200);
                } else {
                    throw new Error('Der skete en fejl prøv igen senere')
                }
            }
        } catch (err) {
            request.session.errors = { msg: err };
            response.redirect('/admin/shop');
        }
    });

module.exports = router;