var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [
	new Product({
		imagePath: 'https://www.thesecret.tv/wp-content/uploads/2015/04/the-secret-book-cover-img.png',
		title: 'The Secret',
		description: 'Life changing Book!!!',
		price: 15
	}),
	new Product({
		imagePath: 'https://www.thesecret.tv/wp-content/uploads/2015/04/the-secret-book-cover-img.png',
		title: 'The Secret',
		description: 'Life changing Book!!!',
		price: 16
	}),
	new Product({
		imagePath: 'https://www.thesecret.tv/wp-content/uploads/2015/04/the-secret-book-cover-img.png',
		title: 'The Secret',
		description: 'Life changing Book!!!',
		price: 17
	}),
	new Product({
		imagePath: 'https://www.thesecret.tv/wp-content/uploads/2015/04/the-secret-book-cover-img.png',
		title: 'The Secret',
		description: 'Life changing Book!!!',
		price: 18
	})
];

var done = 0;
for(var i = 0; i < products.length; i++) {
	products[i].save(function(err, result) {
		done++;
		if (done === products.length) {
			exit();
		}
	});
}
function exit() {
	mongoose.disconnect();
}
