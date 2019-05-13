const { check, validationResult } = require('express-validator/check');

const controller = require('../controllers/controller');

module.exports = {
    userinfo: [
        check('firstname', 'Fornavn skal udfyldes').isString().isLength({ min: 2 }),
        check('lastname', 'Efternavn skal udfyldes').isString().isLength({ min: 2 }),
        check('birth', 'Invalid input').optional({ checkFalsy: true }).isString(),
        check('phone', 'Invalid input').optional({ checkFalsy: true }).isString(),
        check('zipcode', 'Postnummer skal være et tal').optional({ checkFalsy: true }).isDecimal(),
        check('street', 'Invalid input').optional({ checkFalsy: true }).isString()
    ],
    userLogin: [
        check('email', 'Email påkrævet').isEmail(),
        check('password', 'Password påkrævet (min. 5 tegn)').isString().isLength({ min: 5 })
    ],
    userChangeEmail: [
        check('pw', 'Indtast venligst dit password').isString().custom(async (pw, { req }) => {
            if (!await controller.checkPassword(pw, req.user.password))
                return Promise.reject('Forkert password indtastet');
        }),
        check('newEmail', 'Please enter a valid email').isEmail().custom(async (email) => {
            if (await controller.checkEmail(email))
                return Promise.reject('Email already in use');
        })
    ],
    userChangePassword: [
        check('oldpw').custom(async (oldpw, { req }) => {
            if (!await controller.checkPassword(oldpw, req.user.password))
                return Promise.reject('Forkert password indtastet');
        }),
        check('newpw', 'Nyt password skal være min. 5 karaktere lang').isLength({ min: 5 }).custom((newpw, { req }) => {
            if (newpw === req.body.oldpw) {
                throw new Error('Find venligst på et nyt password :)');
            } else {
                return true;
            }
        })
    ],
    eventInfoCheck: [
        check('headline', 'Headline must be 1 character or longer').not().isEmpty(),
        check('startDate', 'Start date not valid').not().isEmpty(),
        check('endDate', 'end date not valid').not().isEmpty(),
        check('deadline', 'deadline not valid').not().isEmpty(),
        check('body', 'The description must be 1 character or longer').not().isEmpty(),
        check('maxparticipants', 'Please enter number of participants').isNumeric(),
        check('price', 'Please input a price').isNumeric()
    ],
    postInfoCheck: [
        check('headline', 'Headline must be 1 character or longer').not().isEmpty(),
        check('body', 'The description must be 1 character or longer').not().isEmpty(),
    ]
}