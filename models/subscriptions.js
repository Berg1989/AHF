const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptions = new Schema({
    createdAt: { type: Date, default: Date.now, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'subscriptionModel', required: true },
    model: { type: Schema.Types.ObjectId, ref: 'subscriptionModel', required: true },
    expirationDate: { type: Date, required: true }
    //expirationDate: { type: Date, expires: 0 }
    //createdAt: { type: Date, expires: 10 * 60, default: Date.now }
});

subscriptions.index({ expirationDate: 1, expireAfterSeconds: 0 })

subscriptions.methods.getExpDate = function(model) {
    const created = new Date(this.createdAt);
    const expDate = new Date(created.setMonth(created.getMonth() + parseInt(model.duration)));
    return expDate.toISOString();
};

module.exports = mongoose.model('subscriptions', subscriptions);