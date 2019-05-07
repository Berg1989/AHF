const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const post = new Schema({
    postdate: String,
    body: String,
    headline: String,
    author: String
});

module.exports = mongoose.model('post', post);