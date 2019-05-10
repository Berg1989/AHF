const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orders = new Schema({
    date: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'user' },
    price: { type: Number, required: true },
    orderlines: [{ type: Schema.Types.ObjectId, ref: 'Orderlines' }],
    phone: { type: Number, required: true }
});

orders.methods.calcPrice = function() {
    return this.firstname + ", hours: " + this.lastname;
};

module.exports = mongoose.model('Orders', orders);