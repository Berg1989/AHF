const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./subscriptionModel');

const subscriptions = new Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
    model: { type: Schema.Types.ObjectId, ref: 'subscriptionModel', required: true }
});

subscriptions.methods.getEndDate = async function() {
    return 'lol';
};

module.exports = mongoose.model('subscriptions', subscriptions);