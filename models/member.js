const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const member = new Schema({
    firstname: String,
    lastname: String,
    password: String,
    email: String,
    info: {
        birth: Date,
        dogtag: String,
        phone: String,
        zipcode: Number,
        street: String
    },
    type: {
        title: String,
        level: Number
    },
    subscription: {
        type: { type: Schema.Types.ObjectId, ref: 'subtype' },
        date: Date,
        active: Boolean
    }    
});

member.methods.toString = function () {
    return "Navn: " + this.firstname + ", Efternavn: " + this.lastname;
};

module.exports = mongoose.model('member', member);