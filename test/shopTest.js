const assert = require('chai').assert;
const shopController = require('../controllers/shopController');
const userController = require('../controllers/userController');

describe('Shop-controller test', () => {
    it('createProduct() test', async function () {
        this.timeout(3000);
        const data = { name: 'test', price: 10, size: 'XL' };
        const product = await shopController.createProduct(data.name, data.price, data.size);

        assert.isObject(await shopController.findProduct(product._id));
        assert.equal(product.name, data.name);
        assert.equal(product.price, data.price);
        assert.equal(product.size, data.size);

        assert.isObject(await shopController.deleteProduct(product._id));
    });
    it('createCategory() test', async function () {
        this.timeout(3000);
        const data = { name: 'test' };
        const category = await shopController.createCategory(data.name);

        assert.isObject(await shopController.findCategory(category._id));
        assert.equal(category.name, data.name);

        assert.isObject(await shopController.deleteCategory(category._id));
    });
    it('createOrderline() test', async function () {
        this.timeout(3000);
        const productData = { name: 'test', price: 10, size: 'XL' };
        const product = await shopController.createProduct(productData.name, productData.price, productData.size);

        const data = { qty: 2, price: 2 * productData.price };
        const orderline = await shopController.createOrderline(product, data.qty, data.price);

        assert.isObject(await shopController.findOrderline(orderline));
        assert.equal(orderline.product, product);
        assert.equal(orderline.qty, data.qty);
        assert.equal(orderline.price, data.price);

        assert.isObject(await shopController.deleteProduct(product));
        assert.isObject(await shopController.deleteOrderline(orderline));
    });
    it('createOrder() test', async function () {
        this.timeout(3000);
        const seller = await userController.createUser('lol', 'lol', 'lol', 'lol', '5cd04bc81c9d4400009071ce', 'lol');

        const productData = { name: 'test', price: 10, size: 'XL' };
        const product = await shopController.createProduct(productData.name, productData.price, productData.size);

        const orderlineData = { qty: 2, price: 2 * productData.price };
        const orderline = await shopController.createOrderline(product, orderlineData.qty, orderlineData.price);

        const data = { orderlines: [orderline], price: orderline.price, phone: 123 };
        const order = await shopController.createOrder(seller, data.orderlines, data.price, data.phone);

        assert.isObject(await shopController.findOrder(order));
        assert.isArray(order.orderlines, data.orderlines);
        assert.equal(order.seller, seller);
        assert.equal(order.price, data.price);
        assert.equal(order.recipient, data.phone);

        assert.isObject(await userController.deleteUser(seller));
        assert.isObject(await shopController.deleteProduct(product));
        assert.isObject(await shopController.deleteOrderline(orderline));
        assert.isObject(await shopController.deleteOrder(order));
    });
    it('Cart test', async function () {
        this.timeout(3000);
        const item1 = { price: 10 };
        const item2 = { price: 5 };
        const cart = await shopController.createCart({});
        
        cart.addProduct(item1, '1');
        cart.addProduct(item2, '2');
        cart.addProduct(item2, '2');

        assert.isObject(cart);
        assert.equal(cart.totalPrice, 20);
        assert.equal(cart.totalQty, 3);
        assert.isArray(cart.generateArray());
        assert.equal(cart.generateArray().length, 2);

        cart.retractOne('2');

        assert.equal(cart.totalPrice, 15);
        assert.equal(cart.totalQty, 2);

        cart.removeItem('1');

        assert.equal(cart.totalPrice, 5);
        assert.equal(cart.totalQty, 1);
    });
});
