const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderlines = new Schema({
    number: Number,
    produkt: { type: Schema.Types.ObjectId, ref: 'Produkt' }
});

orderlines.methods.calcPrice = function() {
    return this.firstname + ", hours: " + this.lastname;
};

module.exports = mongoose.model('Orderlines', orderlines);