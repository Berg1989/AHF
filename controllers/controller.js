"use strict";

const User = require('../models/user');
const SubscriptionModel = require('../models/subscriptionModel');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// SUBSCRIPTIONMODEL
exports.createSubscriptionModel = (name, duration, price, active) => {
    return new SubscriptionModel({
        name: name,
        duration: duration,
        price: price,
        active: active
    })
    .save();
};

exports.findSubscriptionModels = () => {
    return SubscriptionModel.find().exec();
};

exports.updateSubscriptionModel = (id, name, duration, price, active) => {
    return SubscriptionModel.findByIdAndUpdate(id, {
        name: name,
        duration: duration,
        price: price,
        active: active
    }).exec();
};

exports.findSubscriptionModel = (id) => {
    return SubscriptionModel.findById(id).exec();
};

exports.deleteSubscriptionModel = (id) => {
    return SubscriptionModel.findByIdAndDelete(id).exec();
}

// USER
exports.createUser = async (email, password, firstname, lastname, title, level, func) => {
    const created = new Date().toDateString();
    const newHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        password: newHash,
        email: email,
        created: created,
        info: {
            firstname: firstname,
            lastname: lastname,
            func: func,
            birth: null,
            zipcode: null,
            street: null,
            phone: null
        },
        type: {
            title: title,
            level: level
        },
        submodel: null,
        subscription: null,
    });
    return user.save();
};

exports.updateUserInfo = (id, firstname, lastname, birth, phone, zipcode, street, func) => {
    return User.findByIdAndUpdate(id, {
        info: {
            firstname: firstname,
            lastname: lastname,
            birth: birth,
            phone: phone,
            zipcode: zipcode,
            street: street,
            func: func
        }
    }).exec();
};

exports.updateUserSubscription = (id, subModelId, startdate, enddate, active) => {
    return User.findByIdAndUpdate(id, {
        submodel: subModelId,
        subscription: {
            startdate: startdate,
            enddate: enddate,
            active: active
        }
    }).exec();
};

exports.updateUserEmail = (id, email) => {
    return User.findByIdAndUpdate(id, {
        email: email
    }).exec();
};

exports.updateUserPassword = async (id, password) => {
    const newHash = await bcrypt.hash(password, saltRounds);
    return User.findByIdAndUpdate(id, {
        password: newHash
    }).exec()
};

exports.updateUserType = (id, title, level) => {
    return User.findByIdAndUpdate(id, {
        type: {
            title: title,
            level: level
        }
    }).exec();
};

exports.deleteUser = (id) => {
    return User.findByIdAndDelete(id).exec();
};

exports.getUserTitle = (level) => {
    if (level === '1') level = 'admin';
    else if (level === '2') level = 'frivillig';
    else level = 'medlem';
    return level;
};

exports.findUsers = () => {
    return User.find().exec();
};

exports.findUserr = (id) => {
    return User.findById(id).exec();
};

exports.findUser = (id) => {
    return User.findById(id).populate('submodel').exec();
};

exports.checkEmail = (email) => {
    return User.findOne({ email: email }).exec();
};

exports.login = async (email, password) => {
    const user = await exports.checkEmail(email);
    if (user) {
        if (await bcrypt.compare(password, user.password)) return user;
    } else {
        return false;
    }
};

exports.checkPassword = async (plaintext, hash) => {
    return await bcrypt.compare(plaintext, hash);
};

exports.unsubscribe = (id, startdate, enddate) => {
    return User.findByIdAndUpdate(id, {
        submodel: null,
        subscription: {
            startdate: startdate,
            enddate: enddate,
            active: false
        }
    }).exec();
};

exports.addMonths = (date, n) => {
    return new Date(date.setMonth(date.getMonth() + n)).toLocaleDateString();
};

exports.resetPassword = async (id) => {
    const newpw = Math.random().toString(36).substring(2);
    const newHash = await bcrypt.hash(newpw, saltRounds);
    const result =  await User.findByIdAndUpdate(id, {
        password: newHash
    }).exec();
   
    return result ? newpw : false;
};