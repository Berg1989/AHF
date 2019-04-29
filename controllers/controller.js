"use strict";

const Member = require('../models/member');
const SubscriptionType = require('../models/subscriptionType')
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Returns a promise that resolves when the user is created
exports.createMember = async (email, password, firstname, lastname) => {
        password = await bcrypt.hash(password, saltRounds);
        const member = new Member({
            firstname,
            lastname,
            password,
            email
            //dogtag,
            //phone,
            //birth,
            //usertype,
            //zipcode,
            //street
        });
        return member.save();
};

exports.findMember = async (email) => {
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

exports.getSubTypes = async () => {
    return SubscriptionType.find().exec();
}

exports.createSubType = async (name, duration, mdrPrice) => {
    const subType = new SubscriptionType({
        name,
        duration,
        mdrPrice,
    });
    return subType.save();
}

exports.findSubType = async (name) => {
    return SubscriptionType.findOne({ name: name }).exec();
};

exports.checkpassword = async (plaintextPassword, hash) => {
    return await bcrypt.compare(plaintextPassword, hash);
};