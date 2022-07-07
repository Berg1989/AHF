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
        res.render('public/register', {
            messages: messages,
            hasErrors: messages.length > 0,
            metaTags: {
                title: 'AHF - Registrering',
                description: 'User register page',
                keywords: 'Register and stuff'
            },
            action: '/user/register',
            csrfToken: req.csrfToken(),
        });
    })

    .post('/', passport.authenticate('local.register', {
        successRedirect: '/user/info',
        failureRedirect: '/user/register',
        failureFlash: true
    }));

module.exports = router;