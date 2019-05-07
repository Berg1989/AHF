const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const products = new Schema({
    name: String,
    price: Number,
    size: String
    //category: { type: Schema.Types.ObjectId, ref: 'Categories' }
});

products.methods.calcPrice = function() {
    return this.firstname + ", hours: " + this.lastname;
};

module.exports = mongoose.model('Products', products);