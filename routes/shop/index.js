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

    .get('/cart', async function(req, res, next) {
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
        })
    })

    .get('/add-to-cart/:id', async function (req, res, next) {
        const productId = req.params.id;
        const cart = shopController.createCart(req.session.cart ? req.session.cart : {}) //Hvis en cart session findes returner den ellers, et tomt obj

        const product = await shopController.findProduct(productId);
        if (product) {
            cart.addProduct(product, product._id)
            req.session.cart = cart;
            console.log(req.session.cart)
            return res.redirect('/shop');
        } else {
            return res.redirect('/');
        }
    });

module.exports = router;