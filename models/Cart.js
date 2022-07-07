module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    //Tilføj et product til kurven
    this.addProduct = (item, id) => {
        let orderline = this.items[id]; //Findes varen/ordrelinjen allerede i kurven
        if (!orderline) {
            //Hvis ikke så opret ny ordrelinje og tilføj til global items array
            orderline = this.items[id] = { item: item, qty: 0, price: 0 };
        }

        //Opdater ordrelinje obj
        orderline.qty++;
        orderline.price = orderline.item.price * orderline.qty;

        //Opdater totale cart værdier
        this.totalQty++;
        this.totalPrice += orderline.item.price;
    };

    this.generateArray = () => {
        const arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

    //Reducér et product fra kurv
    this.retractOne = (id) => {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        //Hvis qty bliver mindre eller = 0 => fjern varen fra kurv
        if(this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    //Fjern en varelinje
    this.removeItem = (id) => {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }
};