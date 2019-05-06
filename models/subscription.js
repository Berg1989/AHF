const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscription = new Schema({
    start: String,
    end: String,
    active: Boolean,
    model: { type: Schema.Types.ObjectId, ref: 'subscriptionModel' }
});

module.exports = mongoose.model('subscription', subscription);