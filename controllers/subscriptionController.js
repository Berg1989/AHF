const Subscriptions = require('../models/subscriptions');
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

exports.findSubscription = (id) => {
    return Subscriptions.findById(id).populate('model').exec();
}

exports.findUserSubscription = (userid) => {
    return Subscriptions.findOne({ user: userid }).populate('model').exec();
};

exports.createSubscription = (user, model) => {
    return result = Subscriptions.create({
        user: user,
        model: model,
    expirationDate: sub.getExpDate(model)
    })
};

exports.updateSubsciption = (id, start, end, modelid) => {
    return Subscriptions.findByIdAndUpdate(id, {
        $set: {
            start: start,
            end: end,
            model: modelid
        }
    }).exec();
};