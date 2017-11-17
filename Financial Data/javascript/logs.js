var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');


var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/order', checkOrder, function(req, res, next){
	res.render('user/order');
});


router.get('/cancelOrder', cancelOrder, function(req, res, next){
	req.logout();
	res.redirect('/');
});

//placed in front of signup and signin to protect routes that go there
router.use('/', notLoggedIn, function(req, res, next){
	next();
});

router.get('/', isLoggedIn, function(req, res, next) {
 -	res.render('user/');
 	Order.find({user: req.user}, function(err, orders){
 		if(err){
 			return res.write('Error!');
 		}
 		var cart;
 		orders.forEach(function(order){
 			cartItems = new Cart(order.cart);
 			order.items = cartItems.generateArray(); 
 			res.render('user/', { orders: orders });
 		});
 	});
 	
  });


module.exports = router;

function checkOrder(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

function cancelOrder(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}
