const controller = require("../controllers/controller");

//Skal påføres alle routes, hvor brugeren SKAL være logget ind, for at tilgå
module.exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
};

//Skal påføres alle routes hvor brugeren IKKE skal være logget ind for at tilgå
module.exports.notloggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user');
};

//Skal påføres alle routes, hvor brugeren SKAL være logget ind, for at tilgå. BEMÆRK usertype.level skal være 1 (admin level)
module.exports.adminIsLoggedIn = async function (req, res, next) {
    try {
        const usertype = await controller.findUsertype(req.user.usertype);
        if (req.isAuthenticated() && usertype.level === 1) {
            return next();
        }
        res.redirect('/');
    } catch (err) {
        res.redirect('/');

    }
};

module.exports.adminNotloggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin');
};

module.exports.shopIsLoggedIn = async function (req, res, next) {
    try {
        const usertype = await controller.findUsertype(req.user.usertype);
        if (req.isAuthenticated() && usertype.level <= 2) {
            return next();
        }
        res.redirect('/');
    } catch (err) {
        res.redirect('/');

    }
};

module.exports.shopNotloggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/shop');
};