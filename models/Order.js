const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orders = new Schema({
    date: String,
    seller: { type: Schema.Types.ObjectId, ref: 'user' },
    price: Number,
    orderlines: [{ type: Schema.Types.ObjectId, ref: 'Orderlines' }]

});

orders.methods.calcPrice = function() {
    return this.firstname + ", hours: " + this.lastname;
};

module.exports = mongoose.model('Orders', orders);