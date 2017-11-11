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
