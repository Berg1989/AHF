const assert = require('chai').assert;
const controller = require('../controllers/shop');
const userController = require('../controllers/controller');

describe('Shop-controller test', function () {
    it('createProduct() test', async function () {
        this.timeout(3000);
        const data = { name: 'test', price: 10, size: 'XL' };
        const product = await controller.createProduct(data.name, data.price, data.size);

        assert.isObject(await controller.findProduct(product._id));
        assert.equal(product.name, data.name);
        assert.equal(product.price, data.price);
        assert.equal(product.size, data.size);

        assert.isObject(await controller.deleteProduct(product._id));
    });
    it('createCategory() test', async function () {
        this.timeout(3000);
        const data = { name: 'test' };
        const category = await controller.createCategory(data.name);

        assert.isObject(await controller.findCategory(category._id));
        assert.equal(category.name, data.name);

        assert.isObject(await controller.deleteCategory(category._id));
    });
    it('createOrderline() test', async function () {
        this.timeout(3000);
        const productData = { name: 'test', price: 10, size: 'XL' };
        const product = await controller.createProduct(productData.name, productData.price, productData.size);

        const data = { qty: 2, price: 2 * productData.price };
        const orderline = await controller.createOrderline(product, data.qty, data.price);

        assert.isObject(await controller.findOrderline(orderline));
        assert.equal(orderline.product, product);
        assert.equal(orderline.qty, data.qty);
        assert.equal(orderline.price, data.price);

        assert.isObject(await controller.deleteProduct(product));
        assert.isObject(await controller.deleteOrderline(orderline));
    });
    it('createOrder() test', async function () {
        this.timeout(3000);
        const seller = await userController.createUser('lol', 'lol', 'lol', 'lol', '5cd04bc81c9d4400009071ce', 'lol');

        const productData = { name: 'test', price: 10, size: 'XL' };
        const product = await controller.createProduct(productData.name, productData.price, productData.size);

        const orderlineData = { qty: 2, price: 2 * productData.price };
        const orderline = await controller.createOrderline(product, orderlineData.qty, orderlineData.price);

        const data = { orderlines: [orderline], price: orderline.price, phone: 123 };
        const order = await controller.createOrder(seller, data.orderlines, data.price, data.phone);

        assert.isObject(await controller.findOrder(order));
        assert.isArray(order.orderlines, data.orderlines);
        assert.equal(order.seller, seller);
        assert.equal(order.price, data.price);
        assert.equal(order.recipient, data.phone);

        assert.isObject(await userController.deleteUser(seller));
        assert.isObject(await controller.deleteProduct(product));
        assert.isObject(await controller.deleteOrderline(orderline));
        assert.isObject(await controller.deleteOrder(order));
    });
});
