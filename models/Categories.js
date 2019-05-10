const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categories = new Schema({
    name: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Products' }]
});

categories.methods.calcPrice = function() {
    return this.firstname + ", hours: " + this.lastname;
};

module.exports = mongoose.model('Categories', categories);