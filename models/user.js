const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    password: String,
    email: String,
    created: String,
    info: {
        firstname: String,
        lastname: String,
        birth: String,
        phone: String,
        zipcode: Number,
        street: String,
        func: String
    },
    usertype: { type: Schema.Types.ObjectId, ref: 'usertypes' },
    subscription: { type: Schema.Types.ObjectId, ref: 'subscriptions' },
});

user.methods.toString = function() {
    return this.firstname + ", hours: " + this.lastname;
};

module.exports = mongoose.model('user', user);