const passport = require('passport');
const LocalStrategy = require('passport-local');
const controller = require('../controllers/controller');
const User = require('../models/user');

passport.serializeUser(function (user, done) {
    done(null, user._id)
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //Så vi kan validere req
}, async function (req, email, password, done) {
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

    const inUse = await controller.checkEmail(email);
    if (inUse) {
        return done(null, false, { message: 'Denne email er allerede i brug' });
    }

    
    
    User.findOne({ email: email }, async function (err, user) {
        if (err) {
            return done(err); //Hvis fejl, returner done med fejlen
        }
        if (user) {
            return done(null, false, { message: 'Emailen er allerede i brug' }); //Hvis bruger findes er emailen allerede i brug, returner fejl besked
        }
    

        //const user = await controller.createUser(email, password, req.body.firstname, req.body.lastname, req.body.usertype, 'Medlem');

        const newUser = new User();
        newUser.email = email;
        newUser.password = await newUser.hashPassword(password);
        newUser.created = new Date().toDateString();
        newUser.info.firstname = req.body.firstname;
        newUser.info.lastname = req.body.firstname;
        newUser.info.func = req.body.func;
        newUser.usertype = req.body.usertype;

        newUser.save(function (err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    }).exec()
}))