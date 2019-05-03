"use strict";

const Member = require('../models/member');
const SubscriptionType = require('../models/subscriptionType')
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Returns a promise that resolves when the user is created
exports.createMember = async (email, password, firstname, lastname, level, func) => {
    const type = { title: exports.userTitle(level), level };
    const info = { firstname: firstname, lastname: lastname };
    const created = Date.now();
    password = await bcrypt.hash(password, saltRounds);

    const member = new Member({
        password,
        email,
        func,
        created,
        info,
        type
    });
    return member.save();
};

exports.updatePublicUserInfo = (id, firstname, lastname, birth, phone, zipcode, street, email) => {
    const info = { firstname, lastname, birth, phone, zipcode, street };
    
    return Member.findByIdAndUpdate(id, {
        email: email,
        info: info
    }).exec();
};

exports.updateUserInfo = (id, firstname, lastname, birth, phone, zipcode, street, level, func, email) => {
    const type = { title: exports.userTitle(level), level };
    return Member.findByIdAndUpdate(
        id,
        {
            email: email,
            func: func,
            info: {
                firstname: firstname,
                lastname: lastname,
                birth: birth,
                phone: phone,
                zipcode: zipcode,
                street: street
            },
            type: type
        }
    ).exec();
};

exports.updateUser = (id, firstname, lastname) => {
    return Member.findByIdAndUpdate(
        id,
        { info: { firstname: firstname, lastname: lastname } }
    ).exec();
};

exports.deleteUser = (id) => {
    //return Member.findOneAndDelete({ _id : id }).exec();
    return Member.findByIdAndDelete(id);
};

exports.userTitle = (level) => {
    if (level === '1') level = 'admin';
    else if (level === '2') level = 'frivillig';
    else level = 'medlem';
    return level;
};

exports.findMembers = () => {
    return Member.find().exec();
};

exports.findMember = (email) => {
    return Member.findOne({ email: email }).exec();
};

exports.findMemberById = (id) => {
    return Member.findById(id).exec();
};

exports.login = async (email, password) => {
    const member = await exports.findMember(email);
    if (member) {
        const result = await bcrypt.compare(password, member.password);
        if (result) return member;
    } else return false;
};

exports.createSubscription = function (name, frequenzy, price) {
    const subType = new SubscriptionType({
        name,
        frequenzy,
        price
    });
    return subType.save();
};

exports.findSubscriptions = () => {
    return SubscriptionType.find().exec();
};

exports.checkpassword = async (plaintextPassword, hash) => {
    return await bcrypt.compare(plaintextPassword, hash);
};