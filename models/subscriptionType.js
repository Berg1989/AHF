const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionType = new Schema({
    name: String,
    duration: Number,
    mdrPrice: Number,
    isActive: Boolean,
});

const subTypeModel = mongoose.model('SubscriptionType', subscriptionType);

module.exports = subTypeModel;

//subscription.method = function timeLeft() {
//    let timeSpend = Math.abs(startDate - Date.now);  
//}

subscriptionType.method = function setIsActive(boolean){
    this.isActive = boolean;
}