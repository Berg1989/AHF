const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const passport = require('passport');

const auth = require('../../middleware/authentications');

router.use(csrfProtection)

router
    .get('/', auth.adminNotloggedIn, (req, res, next) => {
        const messages = req.flash('error')
        res.render('public/login', {
            messages: messages,
            metaTags: {
                title: 'AHF Admin - Login',
                description: 'Admin login page',
                keywords: 'Login and stuff'
            },
            action: '/admin/login',
            csrfToken: req.csrfToken(),
        });
    })

    .post('/', passport.authenticate('local.adminlogin', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true
    }));

module.exports = router;