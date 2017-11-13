var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');

var csurfProtection = csurf();
router.use(csurfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
	res.render('user/profile');
});

router.get('/logout', isLoggedIn, function (req, res, next) {
	req.logout();  //passport method
	res.redirect('/');
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
