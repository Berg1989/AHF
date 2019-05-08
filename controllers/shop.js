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
        products: []
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

exports.findCategoriesNoProducts = () => {
    return Category.find().exec();
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
exports.createProduct = (name, price, size) => {
    return new Product({
        name: name,
        price: price,
        size: size
    }).save();
};

exports.updateProduct = (id, name, price, size) => {
    return Product.findByIdAndUpdate(id, {
        $set: {
            name: name,
            price: price,
            size: size
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

exports.checkProductName = (name) => {
    return Product.findOne({ name: name }).exec();
}

//
// ORDERLINES
//
exports.createOrderline = (product, number) => {
    return new Orderline({
        number: number,
        product: product
    }).save();
};

exports.deleteOrderline = (id) => {
    return Orderline.findByIdAndRemove(id).exec();
};

exports.updateOrderline = (id, number) => {
    return Orderline.findByIdAndUpdate(id, {
        $set: { number: number }
    })
};

//
// ORDER
//
exports.createOrder = (date, sellerId) => {
    return new Order({
        date: date,
        sellerId: sellerId,
        price: 0,
        orderlines: []
    }).save();
};

exports.updateOrderPrice = (id, price) => {
    return Order.findByIdAndUpdate(id, {
        $set: { price: price }
    }).exec();
};

exports.addOrderlineToOrder = (orderid, orderlineid) => {
    return Order.findByIdAndUpdate(orderid, {
        $push: { orderlines: orderlineid }
    }).exec();
};

exports.removeOrderlineFromOrder = (orderid, orderlineid) => {
    return Order.findByIdAndUpdate(orderid, {
        $pull: { orderlines: orderlineid }
    }).exec();
};