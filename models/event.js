const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const event = new Schema({
    headline: String,
    author: String,
    startdate: String,
    enddate: String,
    body: String,
    deadline: String,
    participants: [{type: Schema.Types.ObjectId, ref: 'user'}],
    maxparticipants: Number,
    price: Number
    
});

module.exports = mongoose.model('event', event);