const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const products = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    imgPath: String
});

module.exports = mongoose.model('Products', products);