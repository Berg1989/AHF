"use strict";

const User = require('../models/user');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Returns a promise that resolves when the user is created
exports.createUser = async (username, firstname, lastname, email, password) => {
    password = await bcrypt.hash(password, saltRounds);
    const user = new User({
        firstname,
        lastname,
        username,
        password,
        email
        //phone,
        //birth,
        //accesslevel,
        //zipcode,
        //street
    });
    return user.save();
};

exports.findUser = async (username) => {
    return User.findOne({ username: username }).exec();
};

exports.login = async (username, password) => {
        const user = await exports.findUser(username).json();
        if (user) return hashCheck = await bcrypt.compare(password, user.password);
        else return false;
};