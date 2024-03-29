// PASSPORT LOGIC

const passport = require('passport');
const LocalStrategy = require('passport-local');
const userController = require('../controllers/userController');
const User = require('../models/user');

passport.serializeUser( (user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //Så vi kan validere req
}, async (req, email, password, done) => {
    req.checkBody('email', 'Email påkrævet').isEmail();
    req.checkBody('password', 'Password påkrævet (min. 5 tegn)').isString().isLength({ min: 5 });
    req.checkBody('firstname', 'Fornavn påkrævet').isString().isLength({ min: 2 });
    req.checkBody('lastname', 'Efternavn påkrævet').isString().isLength({ min: 2 });
    const errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    try {
        const inUse = await userController.checkEmail(email.toLowerCase());
        if (inUse) {
            return done(null, false, { message: 'Denne email er allerede i brug' });
        }

        const newUser = await userController.createUser(email, password, req.body.firstname, req.body.lastname, req.body.usertype, req.body.func);
        if (!newUser) {
            return done(null, false, { message: 'Bruger kunne ikke oprettes' })
        }

        return done(null, newUser);
    } catch (err) {
        return done(null, false, { message: 'WE FAILED, PLEASE DONT HURT US!' });
    }
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //Så vi kan validere req
}, async (req, email, password, done) => {
    req.checkBody('email', 'Email påkrævet').isEmail();
    req.checkBody('password', 'Password påkrævet (min. 5 tegn)').isString().isLength({ min: 5 });
    const errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
  

    try {
        const user = await userController.checkEmail(email.toLowerCase());
        if (!user) {
            return done(null, false, { message: 'Ukendt email' });
        }
        if (!await user.checkPassword(password)) {
            return done(null, false, { message: 'Email og password matcher ikke' });
        }

        return done(null, user);
    } catch (err) {
        return done(null, false, { message: 'WE FAILED, PLEASE DONT HURT US!' });
    }
}));

passport.use('local.adminlogin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //Så vi kan validere req med express-validater
}, async (req, email, password, done) => {
    req.checkBody('email', 'Email påkrævet').isEmail();
    req.checkBody('password', 'Password påkrævet (min. 5 tegn)').isString().isLength({ min: 5 });
    const errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    try {
        const user = await userController.checkEmail(email.toLowerCase());
        if (!user) {
            return done(null, false, { message: 'Ukendt email' });
        }
        if(user.usertype.level > 1) {
            return done(null, false, { message: 'Ukendt email' });
        }
        if (!await user.checkPassword(password)) {
            return done(null, false, { message: 'Email og password matcher ikke' });
        }

        return done(null, user);
    } catch (err) {
        return done(null, false, { message: 'WE FAILED, PLEASE DONT HURT US!' });
    }
}));

passport.use('local.shopLogin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //Så vi kan validere req med express-validater
}, async (req, email, password, done) => {
    req.checkBody('email', 'Email påkrævet').isEmail();
    req.checkBody('password', 'Password påkrævet (min. 5 tegn)').isString().isLength({ min: 5 });
    const errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    try {
        const user = await userController.checkEmail(email.toLowerCase());
        if (!user) {
            return done(null, false, { message: 'Ukendt email' });
        }
        if(user.usertype.level > 2) {
            return done(null, false, { message: 'Ukendt email' });
        }
        if (!await user.checkPassword(password)) {
            return done(null, false, { message: 'Email og password matcher ikke' });
        }

        return done(null, user);
    } catch (err) {
        return done(null, false, { message: 'WE FAILED, PLEASE DONT HURT US!' });
    }
}));