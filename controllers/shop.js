"use strict";

const Category = require('../models/Categories');
const Product = require('../models/Products');
const Orderline = require('../models/Orderlines');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

//
// CART
//
exports.createCart = function (oldCart) {
    return new Cart(oldCart);
};

//
// CATEGORIES
//
exports.createCategory = (name) => {
    const category = new Category();
    category.name = name;
    category.products = [];

    return category.save();
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
exports.createProduct = (name, price, size, imgPath) => {
    const product = new Product();
    product.name = name;
    product.price = price;
    product.size = size;
    product.imgPath = imgPath;

    return product.save();
};

exports.updateProduct = (id, name, price, size, imgPath) => {
    return Product.findByIdAndUpdate(id, {
        $set: {
            name: name,
            price: price,
            size: size,
            imgPath: imgPath
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
exports.createOrderline = (product, qty, price) => {
    const orderline = new Orderline();
    orderline.qty = qty;
    orderline.product = product;
    orderline.price = price;

    return orderline.save();
};

exports.deleteOrderline = (id) => {
    return Orderline.findByIdAndRemove(id).exec();
};

exports.updateOrderline = (id, number) => {
    return Orderline.findByIdAndUpdate(id, {
        $set: { number: number }
    })
};

exports.findOrderline = (id) => {
    return Orderline.findById(id).exec();
};

//
// ORDER
//
exports.createOrder = (sellerId, orderlines, price, phone) => {
    const order = new Order();
    order.date = new Date().toISOString();
    order.seller = sellerId;
    order.price = price;
    order.orderlines = orderlines;
    order.recipient = phone;

    return order.save();
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

exports.findOrder = (id) => {
    return Order.findById(id).exec();
};

exports.findOrders = (start, end) => {
    return Order.find({ "date": { "$gte": start, "$lt": end } }).populate('seller').populate({
        path: 'orderlines',
        populate: { path: 'product' }
    }).exec();
};

exports.deleteOrder = (id) => {
    return Order.findByIdAndRemove(id).exec();
};