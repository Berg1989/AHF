const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categories = new Schema({
    name: { type: String, required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Products' }]
});

module.exports = mongoose.model('Categories', categories);