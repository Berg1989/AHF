const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const member = new Schema({
    firstname: String,
    lastname: String,
    dogtag: String,
    password: String,
    email: String,
    phone: String,
    birth: Date,
    usertype: String,
    zipcode: Number,
    street: String,
});

member.methods.toString = function() {
    return "Navn: " + this.firstname + ", Efternavn: " + this.lastname;
};

module.exports = mongoose.model('member', member);