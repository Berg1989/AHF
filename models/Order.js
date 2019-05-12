const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orders = new Schema({
    date: { type: Date, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'user' },
    price: { type: Number, required: true },
    orderlines: [{ type: Schema.Types.ObjectId, ref: 'Orderlines' }],
    recipient: { type: Number, required: true }
});

module.exports = mongoose.model('Orders', orders);