const userTypeController = require("../controllers/userTypeController");

//Skal påføres alle routes, hvor brugeren SKAL være logget ind, for at tilgå
module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
};

//Skal påføres alle routes hvor brugeren IKKE skal være logget ind for at tilgå
module.exports.notloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user');
};

//Skal påføres alle routes, hvor brugeren SKAL være logget ind, for at tilgå. BEMÆRK usertype.level skal være 1 (admin level)
module.exports.adminIsLoggedIn = async (req, res, next) => {
    try {
        const usertype = await userTypeController.findUsertype(req.user.usertype);
        if (req.isAuthenticated() && usertype.level === 1) {
            return next();
        }
        res.redirect('/');
    } catch (err) {
        res.redirect('/admin/login');
    }
};

module.exports.adminNotloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin');
};

module.exports.shopIsLoggedIn = async (req, res, next) => {
    try {
        const usertype = await userTypeController.findUsertype(req.user.usertype);
        if (req.isAuthenticated() && usertype.level <= 2) {
            return next();
        }
        res.redirect('/');
    } catch (err) {
        res.redirect('/shop/login');
    }
};

module.exports.shopNotloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/shop');
};