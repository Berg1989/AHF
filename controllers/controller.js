"use strict";

const User = require('../models/user');
const fetch = require('node-fetch');

// Returns a promise that resolves when the user is created
exports.createUser = function (setup, punchline) {
    const user = new User({
        setup,
        punchline
    });
    return user.save();
};