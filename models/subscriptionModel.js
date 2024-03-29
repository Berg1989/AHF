const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionModel = new Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('subscriptionModel', subscriptionModel);