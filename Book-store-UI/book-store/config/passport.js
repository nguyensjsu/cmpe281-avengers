var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

//store the user in the session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	//find() in the MongoDB by id
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use('local.signup', new LocalStrategy({
	firstnamefield: 'firstname',
	lastnamefield: 'lastname',
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	req.checkBody('firstname', 'Required First Name').notEmpty();
	req.checkBody('lastname', 'Required Last Name').notEmpty();
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
	var errors = req.validationErrors();
	if(errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user) {
		if (err) {
			return done(err);
		}
		if (user) {
			return done(null, false, {message: 'Email is already in use'});
		}
		var newUser = new User();
		newUser.firstname = req.body.firstname;
		newUser.lastname = req.body.lastname;
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
        	var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				console.log("API call successful. Status: " + this.status);
				response = JSON.parse(this.responseText);
				state_changed = true;
				req.session.sessionvalue = response.session;
				req.session.id = response.id;
				console.log("session:" + JSON.stringify(req.session.sessionvalue));
				return done(null, newUser);
		        }
		}
		console.log("before POST");
		xmlhttp.open("POST", "http://localhost:5000/v1/users");
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.send(JSON.stringify({'firstname': req.body.firstname,
	 				     'lastname': req.body.lastname,
	 				     'email': email,
	 				     'password': password}));
	})
}));

passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty();
	var errors = req.validationErrors();
	if(errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user) {
		if (err) {
			return done(err);
		}
		/*if (!user) {
			return done(null, false, {message: 'Email not Found.'});
		}
		if(!user.validPassword(password)) {
			return done(null, false, {message: 'Incorrect Password'});
		}*/
		var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				console.log("API call successful for sign in. Status: " + this.status);
				response = JSON.parse(this.responseText);
				req.session.sessionvalue = response.session;
				req.session.id = response.id;
				console.log("session:" + JSON.stringify(req.session.sessionvalue));
				return done(null, null);
		        }
		}
		console.log("before POST for Login");
		xmlhttp.open("POST", "http://localhost:5000/v1/login");
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.send(JSON.stringify({'email': email,
	 				     'password': password}));
		//return done(null, null);
	})
}));
