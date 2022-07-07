const Event = require('../models/event');

exports.findEvent = (id) => {
    return Event.findById(id).exec();
};

exports.findUserEvents = (userid) => {
    return Event.find({ "participants": { "$in": userid } })
};

exports.eventSignOff = (eventId, userId) => {
    return Event.findByIdAndUpdate(eventId, {
        $pull: {
            participants: userId
        }
    }).exec();
};

exports.createEvent = (headline, author, startDate, endDate, body, deadline, maxParticipants, price) => {
    const result = Event.create({
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
    return Event.findByIdAndUpdate(eventId, {
        $push: {
            participants: userId
        }
    }).exec();
};

exports.updateEvent = (id, headline, author, startDate, endDate, body, deadline, maxParticipants, price) => {

    return Event.findByIdAndUpdate(id, {
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
    return Event.findByIdAndDelete(id).exec();
}

exports.findEvents = (userid) => {
    return Event.find({ "participants": { "$ne": userid } })
};

exports.findUserInEvent = (userId, eventId) => {
    return Event.findOne(eventId,{participants: userId});
};