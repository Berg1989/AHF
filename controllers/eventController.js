const EventModel = require('../models/event');

exports.findEvent = (id) => {
    return EventModel.findById(id).exec();
};

exports.findUserEvents = function (userid) {
    return EventModel.find({ "participants": { "$in": userid } })
};

exports.eventSignOff = (eventId, userId) => {
    return EventModel.findByIdAndUpdate(eventId, {
        $pull: {
            participants: userId
        }
    }).exec();
};

exports.createEvent = (headline, author, startDate, endDate, body, deadline, maxParticipants, price) => {
    const result = EventModel.create({
        headline: headline.charAt(0).toUpperCase() + headline.slice(1),
        author: author,
        startdate: startDate,
        enddate: endDate,
        body: body,
        deadline: deadline,
        participants: [],
        maxparticipants: maxParticipants,
        price: price
    })

    return result;
};

exports.eventSignUp = (eventId, userId) => {
    return EventModel.findByIdAndUpdate(eventId, {
        $push: {
            participants: userId
        }
    }).exec();
};

exports.updateEvent = (id, headline, author, startDate, endDate, body, deadline, maxParticipants, price) => {

    return EventModel.findByIdAndUpdate(id, {
        $set: {
            headline: headline,
            author: author,
            startdate: startDate,
            enddate: endDate,
            body: body,
            deadline: deadline,
            maxparticipants: maxParticipants,
            price: price
        }
    }).exec();
};

exports.deleteEvent = async id => {
    return EventModel.findByIdAndDelete(id).exec();
}

exports.findEvents = function (userid) {
    return EventModel.find({ "participants": { "$ne": userid } })
};

exports.findUserInEvent = function(userId, eventId){
    return EventModel.findOne(eventId,{participants: userId});
};