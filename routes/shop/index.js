const controller = require("../../controllers/controller");
const shopController = require('../../controllers/shop');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const fetch = require('node-fetch');

router
    .get('/', async (request, response) => {
        response.render('shop/index', {
            layout: 'shop',
            metaTags: {
                title: 'Shoppen',
                description: 'Shop descr',
                keywords: 'lol'
            },
            categories: await shopController.findCategoriesNoProducts()
        });
    })

    .get('/category/:id', async (request, response) => {
        response.render('shop/category', {
            layout: 'shop',
            metaTags: {
                title: 'Shoppen',
                description: 'Shop descr',
                keywords: 'lol'
            },
            categories: await shopController.findCategoriesNoProducts(),
            category: await shopController.findCategory(request.params.id)
        });
    })

    .get('/cart', async function (req, res, next) {
        if (!req.session.cart) {
            return res.render('shop/cart', { products: null });
        }
        const cart = await shopController.createCart(req.session.cart);
        res.render('shop/cart', {
            layout: 'shop',
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            metaTags: {
                title: 'Cart',
                description: 'cart descr',
                keywords: 'lol'
            }
        });

        req.session.errors = null;
    })

    .post('/cart/checkout', [
        check('phone', 'Telefon nummer er påkrævet').isDecimal()
    ], async function (req, res, next) {
        if (!req.session.cart) {
            return res.render('shop/cart', { products: null });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.errors = await errors.array();
            res.redirect('/shop/cart');
        } else {
            const cart = await shopController.createCart(req.session.cart);
            const items = cart.generateArray();
            let orderlines = [];
            let counter = 0;

            for (let itemGroup of items) {
                const orderline = await shopController.createOrderline(itemGroup.item._id, itemGroup.qty, itemGroup.price);
                orderlines.push(orderline._id);
                counter++;
            }

            if (counter === items.length) {
                const order = await shopController.createOrder('123', orderlines, cart.totalPrice, req.body.phone);

                if (order) {
                    req.session.cart = await shopController.createCart({}); //Empty the cart
                    res.redirect('/shop');
                } else {
                    res.redirect('/shop/cart');
                }
            }
        }
    })

    .get('/add-to-cart/:id', async function (req, res, next) {
        const productId = req.params.id;
        const cart = shopController.createCart(req.session.cart ? req.session.cart : {}) //Hvis en cart session findes returner den ellers, et tomt obj

        const product = await shopController.findProduct(productId);
        if (product) {
            cart.addProduct(product, product._id)
            req.session.cart = cart;
            console.log(req.session.cart)
            return res.redirect('back');
        } else {
            return res.redirect('/');
        }
    })

    .get('/retract-from-cart/:id', async function(req, res, next){
        const product = await shopController.findProduct(req.params.id);
        if (product) {
            const cart = await shopController.createCart(req.session.cart);
            cart.retractOne(product._id);

            req.session.cart = cart;
            res.redirect('/shop/cart');
        }
    })

    .get('/remove-from-cart/:id', async function(req, res, next){
        const product = await shopController.findProduct(req.params.id);
        if (product) {
            const cart = await shopController.createCart(req.session.cart);
            cart.removeItem(product._id);

            req.session.cart = cart;
            res.redirect('/shop/cart');
        }
    })

module.exports = router;