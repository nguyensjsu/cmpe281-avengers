//Constructor of the Cart
module.exports = function Cart(oldCart) { //pass old cart info to the cart constructor
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.price / storedItem.qty;
	};

};
