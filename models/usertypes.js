const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usertypes = new Schema({
    title: { type: String, required: true },
    level: { type: Number, required: true }
});

module.exports = mongoose.model('usertypes', usertypes);