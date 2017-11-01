var express = require('express');
var router = express.Router();
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
	Product.find(function(err, docs) { //MongoDB query
		var productChunks = [];
		/*we have to render 3 thumbnails on each row 
		since each thumbnamil takes 4 units of size out of total 12 units*/
		var chunkSize = 3; 
		for(var i = 0; i < docs.length; i += chunkSize) {
			productChunks.push(docs.slice(i, i + chunkSize));
		}
		res.render('shop/index', { title: 'Shopping Cart', products: productChunks });
	});  
});

module.exports = router;
