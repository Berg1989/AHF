const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = require('./subscriptionModel');

const subscriptions = new Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
    model: { type: Schema.Types.ObjectId, ref: 'subscriptionModel', required: true }
    //createdAt: { type: Date, expires: 10 * 60, default: Date.now }
});

subscriptions.methods.getEndDate = function() {
    return new Date(this.end);
};

module.exports = mongoose.model('subscriptions', subscriptions);