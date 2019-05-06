const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionModel = new Schema({
    name: String,
    duration: Number,
    price: Number
});

module.exports = mongoose.model('subscriptionModel', subscriptionModel);