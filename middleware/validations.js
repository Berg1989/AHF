const { check, validationResult } = require('express-validator/check');

const controller = require('../controllers/controller');
const shopController = require('../controllers/shop');

module.exports = {
    userinfo: [
        check('firstname', 'Fornavn skal udfyldes').isString().isLength({ min: 2 }),
        check('lastname', 'Efternavn skal udfyldes').isString().isLength({ min: 2 }),
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
        check('headline', 'Overskrift skal være minimum 1 tegn').not().isEmpty(),
        check('startDate', 'Start dato ikke gyldig').not().isEmpty(),
        check('endDate', 'Slut dato ikke gyldig').not().isEmpty(),
        check('deadline', 'Svarfrist ikke gyldig').not().isEmpty(),
        check('body', 'Beskrivelsen skal være minimum 1 tegn').not().isEmpty(),
        check('maxparticipants', 'Skriv et antal maks deltagere').isNumeric(),
        check('price', 'Skriv en pris').isNumeric()
    ],
    postInfoCheck: [
        check('headline', 'Overskrift skal være minimum 1 tegn').not().isEmpty(),
        check('body', 'Beskrivelsen skal være minimum 1 tegn').not().isEmpty(),
    ],
    adminCreateUser: [
        check('email', 'Please enter a valid email')
            .isEmail().custom(async email => {
                if (await controller.checkEmail(email.toLowerCase()))
                    return Promise.reject('Email already in use');
            }),
        check('password', 'Password must be 5 characters or longer')
            .isLength({ min: 5 }),
        check('firstname', 'Please enter your firstname')
            .isLength({ min: 2 }),
        check('lastname', 'Please enter your lastname')
            .isLength({ min: 2 }),
        check('usertype', 'Please select a usertype')
            .not().isEmpty(),
        check('func')
            .optional({ checkFalsy: true }).isString()
    ],
    adminUpdateUser: [
        check('firstname', 'Fornavn skal udfyldes')
            .isLength({ min: 2 }),
        check('lastname', 'Efternavn skal udfyldes')
            .isLength({ min: 2 }),
        check('email', 'Email er påkrævet')
            .optional({ checkFalsy: true }) // Can be falsy
            .isEmail()
            .custom(async email => {
                if (await controller.checkEmail(email))
                    return Promise.reject('Denne email er allerede registreret');
            })
    ],
    amdinCreateProduct: [
        check('name', 'Navn er påkrævet').isString().isLength({ min: 2 }).custom(async (name) => {
            if (await shopController.checkProductName(name)) {
                return Promise.reject('Dette navn er allerede i brug');
            } else {
                return true;
            }
        }),
        check('price', 'Pris er påkrævet').isDecimal(),
        check('size', 'Størrelse er påkrævet').isString().isLength({ min: 1 })
    ],
    adminUpdateProduct: [
        check('name', 'Navn er påkrævet').isString().isLength({ min: 2 }).custom(async (name, { req }) => {
            if (req.body.name !== name) {
                if (await shopController.checkProductName(name)) return Promise.reject('Dette navn er allerede i brug');
                else return true;
            } else {
                return true;
            }
        }),
        check('price').isDecimal(),
        check('size').isString().isLength({ min: 2 })
    ],
    adminCreateSubModel: [
        check('name', 'Navn er påkrævet').isLength({ min: 2 }),
        check('duration', 'Varighed er påkrævet').isDecimal(),
        check('price', 'Pris er påkrævet').isDecimal(),
    ],
    adminOrderDates: [
        check('start', 'Startdato påkrævet').not().isEmpty().custom(async (start, { req }) => {
            const startD = new Date(start);
            const endD = new Date(req.body.end);
            if (startD > endD) {
                return Promise.reject('Startdato skal være mindre end slutdato');
            } else {
                return true;
            }
        }),
        check('end', 'Slutdato påkrævet').not().isEmpty()
    ]
}