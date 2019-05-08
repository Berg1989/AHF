const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const products = new Schema({
    name: String,
    price: Number,
    size: String,
    img: String
});

products.methods.calcPrice = function() {
    return this.firstname + ", hours: " + this.lastname;
};

products.methods.getPrice = function() {
    return this.price;
};

module.exports = mongoose.model('Products', products);