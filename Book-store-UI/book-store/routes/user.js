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
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/signin', function(req, res, next) { //URL
	var messages = req.flash('error');
	res.render('user/signin', {csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});  //view file views/user/signin.hbs
});

router.post('/signin', passport.authenticate('local.signin', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signin',
	failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function notLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}