const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptions = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    start: String,
    end: String,
    active: Boolean,
    model: { type: Schema.Types.ObjectId, ref: 'subscriptionModel' }
});

module.exports = mongoose.model('subscriptions', subscriptions);