const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionType = new Schema({
    name: String,
    duration: Number,
    price: Number,
});

module.exports = mongoose.model('SubscriptionType', subscriptionType);