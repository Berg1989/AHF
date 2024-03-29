const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const passport = require('passport');

const auth = require('../../middleware/authentications');

router.use(csrfProtection)

router
    .get('/', auth.notloggedIn, (req, res) => {
        const messages = req.flash('error')
        res.render('public/login', {
            messages: messages,
            metaTags: {
                title: 'AHF - Login',
                description: 'User login page',
                keywords: 'Login and stuff'
            },
            action: '/user/login',
            csrfToken: req.csrfToken(),
        });
    })

    .post('/', passport.authenticate('local.login', {
        successRedirect: '/user',
        failureRedirect: '/user/login',
        failureFlash: true
    }));

module.exports = router;