"use strict";

const Member = require('../models/member');
const Usertype = require('../models/usertype');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Returns a promise that resolves when the user is created
exports.createMember = async (email, password, firstname, lastname, usertype) => {
        password = await bcrypt.hash(password, saltRounds);
        const member = new Member({
            firstname,
            lastname,
            password,
            email,
            usertype
        });
        return member.save();
};

exports.findMembers = () => {
    return Member.find().exec();
};

exports.findUserTypes = () => {
    return Usertype.find().exec();
};

exports.findUsertype = (id) => {
    return Usertype.findOne({_id : id}).exec();
};

exports.saveUsertype = (title, accesslevel) => {
    const usertype = new Usertype({
        title,
        accesslevel,
    });
    return usertype.save();
};

exports.findMember = (email) => {
    return Member.findOne({ email: email }).exec();
};

exports.findMemberById = (id) => {
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