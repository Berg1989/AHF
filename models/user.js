const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    setup: String,
    punchline: String
});

user.methods.toString = function() {
    return "setup: " + this.setup + ", punchline: " + this.punchline;
};

module.exports = mongoose.model('users', user);