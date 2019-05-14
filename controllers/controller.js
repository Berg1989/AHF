"use strict";

const User = require('../models/user');
const Usertypes = require('../models/usertypes');
const Subscriptions = require('../models/subscriptions');
const SubscriptionModel = require('../models/subscriptionModel');
const PostModel = require('../models/post');
const EventModel = require('../models/event');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//
// SUBSCRIPTIONMODEL
//
exports.createSubscriptionModel = (name, duration, price) => {
    const tempName = name.charAt(0).toUpperCase() + name.slice(1);
    return new SubscriptionModel({
        //name: tempName,
        name: name,
        duration: duration,
        price: price,
    }).save();
};

exports.findSubscriptionModels = () => {
    return SubscriptionModel.find().exec();
};

exports.updateSubscriptionModel = (id, name, duration, price) => {
    return SubscriptionModel.findByIdAndUpdate(id, {
        $set: {
            name: name,
            duration: duration,
            price: price
        }
    }).exec();
};

exports.findSubscriptionModel = (id) => {
    return SubscriptionModel.findById(id).exec();
};

exports.deleteSubscriptionModel = (id) => {
    return SubscriptionModel.findByIdAndDelete(id).exec();
}

//
// USERS
//
exports.createUser = async (email, password, firstname, lastname, usertype, func) => {
    const newUser = new User();
    newUser.email = email.toLowerCase();
    newUser.password = await newUser.hashPassword(password);
    newUser.created = new Date().toDateString();
    newUser.info.firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
    newUser.info.lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);
    newUser.info.func = func;
    newUser.usertype = usertype;

    return newUser.save();
};

exports.updateUserInfo = (id, firstname, lastname, birth, phone, zipcode, street, func) => {
    return User.findByIdAndUpdate(id, {
        $set: {
            info: {
                firstname: firstname,
                lastname: lastname,
                birth: birth,
                phone: phone,
                zipcode: zipcode,
                street: street,
                func: func
            }
        }
    }).exec();
};

exports.updateUserEmail = (id, email) => {
    return User.findByIdAndUpdate(id, {
        $set: {
            email: email
        }
    }).exec();
};

exports.updateUserPassword = async (id, password) => {
    const newHash = await bcrypt.hash(password, saltRounds);
    return User.findByIdAndUpdate(id, {
        $set: {
            password: newHash
        }
    }).exec()
};

exports.updateUserType = (id, usertype) => {
    return User.findByIdAndUpdate(id, {
        $set: { usertype: usertype }
    }).exec();
};

exports.deleteUser = (id) => {
    return User.findByIdAndDelete(id).exec();
};

exports.findUsers = () => {
    return User.find().populate('usertype').populate('subscription').sort({ 'info.firstname': 1 }).exec();
};

exports.findUserr = (id) => {
    return User.findById(id).exec();
};

exports.findUser = (id) => {
    return User.findById(id).populate('usertype').populate('subscription').exec();
};

exports.findUsersByText = async (text) => {
    const temp = text.charAt(0).toUpperCase() + text.slice(1);
    return User.find({ 'info.firstname': { $regex: temp } }).exec();
};

exports.checkEmail = (email) => {
    return User.findOne({ email: email }).populate('usertype').exec();
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

exports.addMonths = (date, n) => {
    return new Date(date.setMonth(date.getMonth() + n)).toDateString();
};

exports.resetPassword = async (id) => {
    const newpw = Math.random().toString(36).substring(2);
    const newHash = await bcrypt.hash(newpw, saltRounds);
    const result = await User.findByIdAndUpdate(id, {
        $set: { password: newHash }
    }).exec();

    return result ? newpw : false;
};

exports.getUsersCount = () => {
    return User.countDocuments().exec();
};

//
// SUBSCRIPTIONS
//
exports.findUserSubscription = (userid) => {
    return Subscriptions.findOne({ user: userid }).populate('model').exec();
};

exports.createSubscription = (user, model) => {
    const sub = new Subscriptions();
    sub.model = model;
    sub.user = user;
    sub.expirationDate = sub.getExpDate(model);

    return sub.save();
};

exports.connectSubToUser = (userid, subid) => {
    return User.findByIdAndUpdate(userid, {
        $set: { subscription: subid }
    }).exec();
};

exports.updateSubsciption = (id, start, end, modelid) => {
    return Subscriptions.findByIdAndUpdate(id, {
        $set: {
            start: start,
            end: end,
            model: modelid
        }
    }).exec();
};

exports.findSubscription = (id) => {
    return Subscriptions.findById(id).populate('model').exec();
}

//
// USERTYPES
//
exports.findUsertypes = () => {
    return Usertypes.find().exec();
};

exports.findUsertype = (id) => {
    return Usertypes.findById(id).exec();
};


//
//  POSTS / EVENTS
//

exports.createPost = (headline, body, author) => {
    const created = new Date().toDateString();
    const tempHeadline = headline.charAt(0).toUpperCase() + headline.slice(1);

    const post = new PostModel({
        postdate: created,
        body: body,
        headline: tempHeadline,
        author: author
    });
    return post.save();
};

exports.createEvent = (headline, author, startDate, endDate, body, deadline, maxParticipants, price) => {
    const tempHeadline = headline.charAt(0).toUpperCase() + headline.slice(1);
    const event = new EventModel({
        headline: tempHeadline,
        author: author,
        startdate: startDate,
        enddate: endDate,
        body: body,
        deadline: deadline,
        participants: [],
        maxparticipants: maxParticipants,
        price: price
    });
    return event.save();
};

exports.eventSignUp = (eventId, userId) => {
    return EventModel.findByIdAndUpdate(eventId, {
        $push: {
            participants: userId
        }
    }).exec();
};

exports.eventSignOff = (eventId, userId) => {
    return EventModel.findByIdAndUpdate(eventId, {
        $pull: {
            participants: userId
        }
    }).exec();
};
exports.findEvent = (id) => {
    return EventModel.findById(id).exec();
};
exports.findPosts = () => {
    return PostModel.find().exec();
}

exports.deleteEvent = async id => {
    return EventModel.findByIdAndDelete(id).exec();
}

exports.deletePost = id => {
    return PostModel.findByIdAndDelete(id).exec();
}

exports.findPost = id => {
    return PostModel.findById(id).exec();
}

exports.updateEvent = (id, headline, author, startDate, endDate, body, deadline, maxParticipants, price) => {

    return EventModel.findByIdAndUpdate(id, {
        $set: {
            headline: headline,
            author: author,
            startdate: startDate,
            enddate: endDate,
            body: body,
            deadline: deadline,
            maxparticipants: maxParticipants,
            price: price
        }
    }).exec();
};

exports.findUserEvents = function (userid) {
    return EventModel.find({ "participants": { "$in": userid } })
};

exports.findUserInEvent = function(userid, eventId) {
    return EventModel.findOne( eventId, { participants: userid } )
}

exports.findEvents = function (userid) {
    return EventModel.find({ "participants": { "$ne": userid } })
};

exports.updatePost = (id, headline, body) => {

    return PostModel.findByIdAndUpdate(id, {
        $set: {
            headline: headline,
            body: body,
        }
    }).exec();
}

exports.findPosts = () => {
    return PostModel.find().exec();
};