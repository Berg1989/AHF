const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usertype = new Schema({
    title: String,
    accesslevel: Number
});

usertype.methods.toString = function() {
    return "Titel: " + this.title + ", niveau: " + this.accesslevel;
};

module.exports = mongoose.model('usertype', usertype);