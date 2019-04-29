"use strict";

const Member = require('../models/member');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Returns a promise that resolves when the user is created
exports.createMember = async (email, password, firstname, lastname) => {
        password = await bcrypt.hash(password, saltRounds);
        const usertype = '5cc6aec31c9d4400004e6db5'
        const member = new Member({
            firstname,
            lastname,
            password,
            email,
            //dogtag,
            //phone,
            //birth,
            usertype
            //zipcode,
            //street
        });
        return member.save();
};

exports.findMember = (email) => {
    return Member.findOne({ email: email }).exec();
};

exports.getMemberById = async (id) => {
    return Member.findOne({ _id: id }).exec();
};

exports.login = async (email, password) => {
    const member = await exports.findMember(email);
    if (member) {
        const result = await bcrypt.compare(password, member.password);
        if (result) return member;
    } else return false;
};

exports.checkpassword = async (plaintextPassword, hash) => {
    return await bcrypt.compare(plaintextPassword, hash);
};