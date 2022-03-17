const User = require('../models/user');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.createUser = async (email, password, firstname, lastname, usertype, func) => {
    return result = User.create({
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        created: new Date().toDateString(),
        info: {
            firstname: firstname.charAt(0).toUpperCase() + firstname.slice(1),
            lastname: lastname.charAt(0).toUpperCase() + lastname.slice(1),
            func: func,
            comments: '',
            isLegalAge: false
        },
        usertype: usertype
    })
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

exports.findUser = (id) => {
    return User.findById(id).populate('usertype').populate('subscription').exec();
};

exports.findUserr = (id) => {
    return User.findById(id).exec();
};

exports.findUsersByText = async (text) => {
    const temp = text.charAt(0).toUpperCase() + text.slice(1);
    return User.find({ 'info.firstname': { $regex: temp } }).exec();
};

exports.checkEmail = (email) => {
    return User.findOne({ email: email }).populate('usertype').exec();
};

exports.getUsersCount = () => {
    return User.countDocuments().exec();
};