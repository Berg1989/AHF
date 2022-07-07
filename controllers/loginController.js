const bcrypt = require('bcryptjs');
const User = require('../models/user');
const userController = require('../controllers/userController')
const saltRounds = 10;

exports.login = async (email, password) => {
    const user = await userController.checkEmail(email);
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