"use strict";

const Category = require('../models/Categories');
const Product = require('../models/Products');
const Orderline = require('../models/Orderlines');
const Order = require('../models/Order');

//
// CATEGORIES
//
exports.createCategory = (name) => {
    return new Category({
        name: name,
        products: null
    }).save();
};

exports.updateCategory = (id, name) => {
    return Category.findByIdAndUpdate(id, {
        $set: { name: name }
    }).exec();
};

exports.deleteCategory = (id) => {
    return Category.findByIdAndRemove(id).exec();
};

exports.addProduktToCategory = (categoryId, produktId) => {
    return Category.findByIdAndUpdate(categoryId, {
        $push: { products: produktId }
    }).exec();
};

exports.removeProduktFromCategory = (categoryId, produktId) => {
    return Category.findByIdAndUpdate(categoryId, {
        $pull: { products: produktId }
    });
};

exports.findCategories = () => {
    return Category.find().populate('products').exec();
};

exports.findCategory = (id) => {
    return Category.findById(id).populate('products').exec();
};

exports.checkCategoryName = (name) => {
    return Category.findOne({ name: name }).exec();
};

//
// PRODUCTS
//
exports.createProduct = (name, price, size, categoryId) => {
    return new Product({
        name: name,
        price: price,
        size: size,
        category: categoryId
    }).save();
};

exports.updateProduct = (id, name, price, size, categoryId) => {
    return Product.findByIdAndUpdate(id, {
        $set: {
            name: name,
            price: price,
            size: size,
            category: categoryId
        }
    }).exec();
};

exports.deleteProduct = (id) => {
    return Product.findByIdAndRemove(id).exec();
};

exports.findProducts = () => {
    return Product.find().exec();
};

exports.findProduct = (id) => {
    return Product.findById(id).exec();
};

exports.findProductsInCategory = (categoryId) => {
    return Product.find({category: categoryId}).exec();
};

exports.checkProductName = (name) => {
    return Product.findOne({ name: name }).exec();
}
