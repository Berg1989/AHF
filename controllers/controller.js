"use strict";

const User = require('../models/user');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.createHash = async (pw) => {
    const hashedpw = bcrypt.hash(pw, saltRounds, function(hash) {
        console.log(hash);
        return hash;
      });
      return hashedpw;
}

// Returns a promise that resolves when the user is created
exports.createUser = async (firstname, lastname, email, password) => {
    password = await exports.createHash(password);
    console.log(password);
    const user = new User({
        firstname,
        lastname,
        //username,
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
    return Joke.findOne({ username: username }).exec();
};