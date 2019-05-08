const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderlines = new Schema({
    number: Number,
    product: { type: Schema.Types.ObjectId, ref: 'Products' }
});

orderlines.methods.calcPrice = function() {
    return this.number * this.product.methods.getPrice();
};

module.exports = mongoose.model('Orderlines', orderlines);