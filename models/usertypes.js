const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usertypes = new Schema({
    title: String,
    level: Number
});

module.exports = mongoose.model('usertypes', usertypes);