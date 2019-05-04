const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionModel = new Schema({
    name: String,
    duration: Number,
    price: Number,
    active: Boolean,
    users: [{ type: Schema.Types.ObjectId, ref: 'user' }]  
});

module.exports = mongoose.model('subscriptionModel', subscriptionModel);