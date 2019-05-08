const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personalEvent = new Schema({
    headline: String,
    startdate: Date,
    enddate: Date,
    price: Number
});

module.exports = mongoose.model('personalEvent', personalEvent);