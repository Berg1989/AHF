const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderlines = new Schema({
    qty: { type: Number, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Products' },
    price: { type: Number, required: true }
});

orderlines.methods.calcPrice = function() {
    return this.number * this.product.methods.getPrice();
};

module.exports = mongoose.model('Orderlines', orderlines);