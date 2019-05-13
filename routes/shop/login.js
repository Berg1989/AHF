const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const passport = require('passport');

const auth = require('../../middleware/authentications');

router.use(csrfProtection)

router
    .get('/', auth.shopNotloggedIn, function (req, res, next) {
        const messages = req.flash('error')
        res.render('public/login', {
            messages: messages,
            metaTags: {
                title: 'AHF Shop - Login',
                description: 'Shop login page',
                keywords: 'Login and stuff'
            },
            action: '/shop/login',
            csrfToken: req.csrfToken(),
        });
    })

    .post('/', passport.authenticate('local.shopLogin', {
        successRedirect: '/shop',
        failureRedirect: '/shop/login',
        failureFlash: true
    }));

module.exports = router;