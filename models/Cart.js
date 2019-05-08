module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.addProduct = function (item, id) {
        let storedItem = this.items[id]; //Findes varen allerede i kurven
        if (!storedItem) {
            //Hvis ikke opret nyt item til StoredItems array og global items array
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
        }

        //Opdater stored item obj
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;

        //Opdater totale cart værdier
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.generateArray = function () {
        const arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

    this.getItems = function() {
        return this.items;
    }

    this.getTotalPrice = function() {
        return this.totalPrice;
    }

    this.getTotalQty = function() {
        return this.totalQty;
    }
};