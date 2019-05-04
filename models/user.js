const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    password: String,
    email: String,
    created: Date,
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
    submodel: { type: Schema.Types.ObjectId, ref: 'subscriptionModel' },
    subscription: {
        startdate: Date,
        enddate: Date,
        active: Boolean
    }    
});

module.exports = mongoose.model('user', user);