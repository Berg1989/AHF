const SubscriptionModel = require('../models/subscriptionModel');

exports.createSubscriptionModel = (name, duration, price) => {
    return result = SubscriptionModel.create({
        name: name,
        duration: duration,
        price: price,
    })
};

exports.updateSubscriptionModel = (id, name, duration, price) => {
    return SubscriptionModel.findByIdAndUpdate(id, {
        $set: {
            name: name,
            duration: duration,
            price: price
        }
    }).exec();
};

exports.findSubscriptionModel = (id) => {
    return SubscriptionModel.findById(id).exec();
};

exports.findSubscriptionModels = () => {
    return SubscriptionModel.find().exec();
};

exports.deleteSubscriptionModel = (id) => {
    return SubscriptionModel.findByIdAndDelete(id).exec();
}
