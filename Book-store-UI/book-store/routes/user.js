var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Cart = require('../models/cart');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var csurfProtection = csurf();
router.use(csurfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
	Order.find({user: req.user}, function(err, orders){
		if(err){
			return res.write('Error!');
		}
		var cart;
		orders.forEach(function(order){
			cart = new Cart(order.cart);
			order.items = cart.generateArray(); 
			res.render('user/profile', { orders: orders });
		});
	});
	
});

router.get('/logout', function (req, res, next) {
	console.log("Delete session called for id :" + req.session.currentuser.id);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			console.log("API call successful for sign out. Status: " + this.status);
			response = this.responseText;
			if(response.result == "0")
				console.log("Session deleted successfully.");
			else if (response.result == "1")	
				console.log("Error deleting sesion.");	
			else	
				console.log("Session does not exist for the user.");		
	        }
	}
	console.log("before DELETE for Logout");
        var id = req.session.currentuser.id;
	req.session.sessionvalue =  "";
        req.session.currentuser = "";
	req.logout();
	res.redirect('/');
	xmlhttp.open("DELETE", "http://localhost:5000/v1/login");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify({'id': id}));
});

router.use('/', notLoggedIn, function(req, res, next) {
	next();
});

router.get('/signup', function(req, res, next) { //URL
	var messages = req.flash('error');
	res.render('user/signup', {csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});  //view file views/user/signup.hbs
});

router.post('/signup', passport.authenticate('local.signup', {
	//successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}), function(req, res, next) {
	if(req.session.oldUrl){
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});

router.get('/signin', function(req, res, next) { //URL
	var messages = req.flash('error');
	res.render('user/signin', {csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});  //view file views/user/signin.hbs
});

router.post('/signin', passport.authenticate('local.signin', {
	failureRedirect: '/user/signup',
	failureFlash: true
}), function(req, res, next) {
	if(req.session.oldUrl){
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});

module.exports = router;

function isLoggedIn(req, res, next) {
	console.log("session islogged? : " + req.session.sessionvalue)
	console.log("isAunthenticated : " + req.isAuthenticated())
	if (!req.session.sessionvalue == undefined && !req.session.sessionvalue == "" && req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function notLoggedIn(req, res, next) {
	console.log("session notlogged? : " + req.session.sessionvalue)
	console.log("isAunthenticated : " + req.isAuthenticated())
	if ((req.session.sessionvalue == undefined || req.session.sessionvalue == "") && !req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}
