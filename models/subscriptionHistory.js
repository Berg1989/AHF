const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionHistory = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'subscription' }]
});

module.exports = mongoose.model('subscriptionHistory', subscriptionHistory);