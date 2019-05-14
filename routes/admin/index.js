const express = require('express');
const router = express.Router();

const auth = require('../../middleware/authentications');

router
    //Admin root
    .get('/', auth.adminIsLoggedIn, async (request, response) => {
        const errors = request.flash('error');
        const success = request.flash('success');
        response.render('admin/index', {
            layout: 'admin',
            metaTags: {
                title: 'Admin - Home',
                description: 'Here goes the description',
                keywords: 'Here goes keywords'
            },
            admin: request.user,
            messages: { errors, success }
        })
    })

    .get('/logout', auth.adminIsLoggedIn, function (req, res, next) {
        req.logout();
        res.redirect('/admin/login');
    });

module.exports = router;