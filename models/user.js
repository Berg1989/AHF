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
    type: {
        title: String,
        level: Number
    },
    subscription: {
        type: { type: Schema.Types.ObjectId, ref: 'subscriptionModel' },
        date: String,
        active: Boolean
    }    
});

module.exports = mongoose.model('user', user);