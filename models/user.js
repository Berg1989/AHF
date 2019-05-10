const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const user = new Schema({
    password: { type: String, required: true },
    email: { type: String, required: true },
    created: { type: String, required: true },
    info: {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        birth: String,
        phone: String,
        zipcode: Number,
        street: String,
        func: String
    },
    usertype: { type: Schema.Types.ObjectId, ref: 'usertypes', required: true },
    subscription: { type: Schema.Types.ObjectId, ref: 'subscriptions' },
});

user.methods.hashPassword = async function(password) {
    return await bcrypt.hash(password, 5);
};

user.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('user', user);