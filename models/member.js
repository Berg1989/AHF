const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const member = new Schema({
    password: String,
    email: String,
    dogtag: String,
    info: {
        firstname: String,
        lastname: String,
        birth: String,
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