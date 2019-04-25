const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    salt: String,
    email: String,
    phone: String,
    birth: Date,
    accesslevel: Number,
    zipcode: Number,
    street: String,
});

user.methods.toString = function() {
    return "Navn: " + this.firstname + ", Efternavn: " + this.lastname;
};

module.exports = mongoose.model('user', user);