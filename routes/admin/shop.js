const controller = require("../../controllers/controller");
const shopController = require('../../controllers/shop');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fs = require('fs');

const upload = require('../../middleware/upload');
const auth = require('../../middleware/authentications');
const validate = require('../../middleware/validations');

router
    .get('/', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('admin/shop/shop', {
            messages: { errors, success },
            metaTags: {
                title: 'AHF Admin - Shop',
                description: 'Personal user page',
                keywords: 'Profile and stuff'
            },
            layout: 'admin',
            categories: await shopController.findCategories(),
        });
    })

    //Create category
    .post('/categories', auth.adminIsLoggedIn, [
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
            request.flash('error', await errors.array());
            response.redirect('back');
        } else {
            const result = await shopController.createCategory(request.body.Cname);

            if (result) {
                request.flash('success', result.name + ' oprettet');
                response.redirect('back');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }
        }
    })

    //Edit category
    .get('/categories/:id', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');
        const category = await shopController.findCategory(request.params.id);

        if (category) {
            response.render('admin/shop/category', {
                messages: { errors, success },
                metaTags: {
                    title: 'AHF Admin - Shop',
                    description: 'Personal user page',
                    keywords: 'Profile and stuff'
                },
                layout: 'admin',
                category: category
            });
        }
    })

    .post('/categories/:id', auth.adminIsLoggedIn, [
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
            request.flash('error', await errors.array());
            response.redirect('back');
        } else {
            const name = request.body.name;
            const result = await shopController.updateCategory(request.params.id, name);

            if (result) {
                request.flash('success', 'Kategorien opdateret');
                response.redirect('back');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }
        }
    })

    //Delete category
    .post('/categories/:id/remove', auth.adminIsLoggedIn, async (request, response) => {
        const category = await shopController.findCategory(request.params.id);
        if (category) {
            for (let product of category.products) {
                await shopController.deleteProduct(product._id);
                if (product.imgPath !== '/uploads/default.png') {
                    fs.unlink('public' + product.imgPath, function (err) {
                        if (err) throw new Error(err);
                        
                    });
                }
            };

            const result = await shopController.deleteCategory(request.params.id);

            if (result) {
                request.flash('success', 'Produktkategorien og tilhørende produkter blev slettet');
                response.redirect('/admin/shop');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }
        } else {
            request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
            response.redirect('back');
        }
    })

    //Create product
    .post('/products', auth.adminIsLoggedIn, upload.single('productImage'), validate.amdinCreateProduct, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('back');;
        } else {
            const { name, price, size, category } = request.body;
            let imgPath = '/uploads/default.png';
            if (request.file) {
                imgPath = '/uploads/' + request.file.filename;
            }

            const product = await shopController.createProduct(name, price, size, imgPath);
            const connect = await shopController.addProduktToCategory(category, product._id);
            if (product && connect) {
                request.flash('success', 'Success ' + name + ' oprettet');
                response.redirect('back');

            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('back');
            }
        }
    })

    //Edit product
    .get('/categories/:id/products/:pid', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');

        const product = await shopController.findProduct(request.params.pid);
        const category = await shopController.findCategory(request.params.id);

        if (!product && !category) {
            request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
            response.redirect('back');
        } else {
            response.render('admin/shop/product', {
                messages: { errors, success },
                metaTags: {
                    title: 'AHF Admin - Shop',
                    description: 'Personal user page',
                    keywords: 'Profile and stuff'
                },
                layout: 'admin',
                product: product,
                category: category
            });
        }
    })

    .post('/categories/:id/products/:pid', auth.adminIsLoggedIn, upload.single('productImage'), validate.adminUpdateProduct, async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            request.flash('error', await errors.array());
            response.redirect('back');
        } else {
            const { category, name, price, size } = request.body;
            const product = await shopController.findProduct(request.params.pid);
            if (!product) {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('/admin/shop');
            } else {
                let currentImage = product.imgPath;
                if (request.file) {
                    if (currentImage !== '/uploads/default.png') {
                        fs.unlink('public' + currentImage, function (err) {
                            if (err) throw new Error(err);
                        })
                    }
                    currentImage = '/uploads/' + request.file.filename;
                }

                const result = await shopController.updateProduct(request.params.pid, name, price, size, currentImage);

                if (result) {
                    request.flash('success', 'Produktet opdateret');
                    response.redirect('back');
                } else {
                    request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                    response.redirect('/amin/shop/categories/' + request.params.id + '/products/' + request.params.pid);
                }
            }
        }
    })

    //Delete product
    .post('/categories/:id/products/:pid/remove', auth.adminIsLoggedIn, async (request, response) => {
        const product = await shopController.findProduct(request.params.pid);
        const category = await shopController.findCategory(request.params.id)
        if (!product) {
            request.flash('error', 'Produkt findes ikke længere');
            response.redirect('/admin/shop');
        } else {
            const result = await shopController.deleteProduct(product._id);
            const dc = await shopController.removeProduktFromCategory(category._id, product._id);
            const imgPath = result.imgPath;

            if (result && dc) {
                if (imgPath !== '/uploads/default.png') {
                    fs.unlink('public' + imgPath, function (err) {
                        if (err) throw new Error(err);
                    });
                }

                request.flash('success', 'Success! produktet slettet');
                response.redirect('back');
            } else {
                request.flash('error', [{ msg: 'UPS! noget gik galt' }]);
                response.redirect('/amin/shop/categories/' + request.params.id + '/products/' + request.params.pid);
            }
        }
    });

module.exports = router;