'use strict';

const config = require('./config');

class Cart {
   constructor() {
      this.data = {};
      this.data.items = [];
      this.data.totals = 0;
      this.data.formattedTotals = '';
   }
}

module.exports = new Cart();
calculateTotals() {
    this.data.totals = 0;
    this.data.items.forEach(item => {
        let price = item.price;
        let qty = item.qty;
        let amount = price * qty;

        this.data.totals += amount;
    });
    this.setFormattedTotals();
}

setFormattedTotals() {
    let format = new Intl.NumberFormat(config.locale.lang, {style: 'currency', currency: config.locale.currency });
    let totals = this.data.totals;
    this.data.formattedTotals = format.format(totals);
}

app.post('/cart/update', (req, res) => {
let ids = req.body["product_id[]"];
let qtys = req.body["qty[]"];
if(Security.isValidNonce(req.body.nonce, req)) {
    Cart.updateCart(ids, qtys);
    Cart.saveCart(req);
    res.redirect('/cart');
} else {
    res.redirect('/');
}
});

updateCart(ids = [], qtys = []) {
    let map = [];
    let updated = false;

    ids.forEach(id => {
       qtys.forEach(qty => {
          map.push({
              id: parseInt(id, 10),
              qty: parseInt(qty, 10)
          });
       });
    });
    map.forEach(obj => {
        this.data.items.forEach(item => {
           if(item.id === obj.id) {
               if(obj.qty > 0 && obj.qty !== item.qty) {
                   item.qty = obj.qty;
                   updated = true;
               }
           }
        });
    });
    if(updated) {
        this.calculateTotals();
    }
}

emptyCart(request) {
    this.data.items = [];
    this.data.totals = 0;
    this.data.formattedTotals = '';
    if(request.session) {
        request.session.cart.items = [];
        request.session.cart.totals = 0;
        request.session.cart.formattedTotals = '';
    }


}

const Security = require('./lib/Security');
const Products = require('./models/Products');

app.post('/cart', (req, res) => {
  let qty = parseInt(req.body.qty, 10);
  let product = parseInt(req.body.product_id, 10);
  if(qty > 0 && Security.isValidNonce(req.body.nonce, req)) {
    Products.findOne({product_id: product}).then(prod => {
        Cart.addToCart(prod, qty);
        Cart.saveCart(req);
        res.redirect('/cart');
    }).catch(err => {
       res.redirect('/');
    });
} else {
    res.redirect('/');
}
});

removeFromCart(id = 0) {
    for(let i = 0; i < this.data.items.length; i++) {
        let item = this.data.items[i];
        if(item.id === id) {
            this.data.items.splice(i, 1);
            this.calculateTotals();
        }
    }

}

saveCart(request) {
    if(request.session) {
        request.session.cart = this.data;
    }
}

