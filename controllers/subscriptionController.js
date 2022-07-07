const Subscriptions = require('../models/subscriptions');

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