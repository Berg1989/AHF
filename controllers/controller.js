"use strict";

const Member = require('../models/member');
const SubscriptionType = require('../models/subscriptionType')
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Returns a promise that resolves when the user is created
exports.createMember = async (email, password, firstname, lastname, level) => {
    const type = { title: exports.userTitle(level), level };
    const info = { firstname: firstname, lastname: lastname };
    password = await bcrypt.hash(password, saltRounds);

    const member = new Member({
        password,
        email,
        info,
        type
    });
    return member.save();
};

exports.updateUserInfo = (id, firstname, lastname, birth, phone, zipcode, street) => {
    return Member.findByIdAndUpdate(
        id,
        { info: { 
            firstname: firstname, 
            lastname: lastname,
            birth: birth,
            phone: phone,
            zipcode: zipcode,
            street: street 
        }}
    )
};

exports.updateUser = (id, firstname, lastname) => {
    return Member.findByIdAndUpdate(
        id,
        { info: { firstname: firstname, lastname: lastname } }
    )
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

exports.findUserTypes = () => {
    return Usertype.find().exec();
};

exports.findUsertype = (id) => {
    return Usertype.findOne({ _id: id }).exec();
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
    return Member.findById(id).exec();
};

exports.login = async (email, password) => {
    const member = await exports.findMember(email);
    if (member) {
        const result = await bcrypt.compare(password, member.password);
        if (result) return member;
    } else return false;
};

exports.getSubTypes = () => {
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

exports.deleteSubType = (_id) => {
    return SubscriptionType.findOneAndDelete({_id: _id}).exec();
}

exports.checkpassword = async (plaintextPassword, hash) => {
    return await bcrypt.compare(plaintextPassword, hash);
};

exports.createSubStatistics = async (name) => {
    return member.SubscriptionType.name.findOne({name: name}).exec();
}