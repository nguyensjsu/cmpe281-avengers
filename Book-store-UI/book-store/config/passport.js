var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');


String.prototype.format = function () {
        var args = [].slice.call(arguments);
        return this.replace(/(\{\d+\})/g, function (a){
            return args[+(a.substr(1,a.length-2))||0];
        });
};

//store the user in the session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(req, id, done) {
	if(req.session.currentuser == undefined || req.session.currentuser == "")
	{
		var xmlhttp = new XMLHttpRequest(); 
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				if (this.responseText){
					console.log("API Get call successful. readyState: " + this.readyState);
					response = JSON.parse(this.responseText);
					var user = new User();
					user.id = response.id;
					user.firstname = response.firstname;
					user.lastname = response.lastname;
					user.email = response.email;
					user.password = user.encryptPassword(response.password);
					req.session.currentuser = user;		
					done(null, user);
				}
			}
		}
		console.log("before GET");
		url = "http://localhost:5000/v1/users/{0}";
		url_id = url.format(id.replace(/"/g, ''))
		console.log(url_id);
		xmlhttp.open("GET", url_id);
		xmlhttp.send();
	}
	else
		done(null, req.session.currentuser);
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
        	var xmlhttp = new XMLHttpRequest();  
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				console.log("API call successful. Status: " + this.status);
				response = JSON.parse(this.responseText);
				state_changed = true;
				req.session.sessionvalue = response.session;
				newUser.id = JSON.stringify(response.id);
				req.session.id = response.id;
				console.log("session:" + JSON.stringify(req.session.sessionvalue));		
				console.log(req.user);
				console.log(req.isAuthenticated());
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
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				console.log("API call successful for sign in. Status: " + this.status);
				response = JSON.parse(this.responseText);
				var newUser = new User();
				newUser.firstname = response.firstname;
				newUser.lastname = response.lastname;
				newUser.email = response.email;
				newUser.password = newUser.encryptPassword(response.password);
				newUser.id = response.id;
				req.session.sessionvalue = response.session;
				req.session.id = response.id;
				console.log("session:" + JSON.stringify(req.session.sessionvalue));
				console.log(req.isAuthenticated());
				return done(null, newUser);
		        }
		}
		console.log("before POST for Login");
		xmlhttp.open("POST", "http://localhost:5000/v1/login");
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.send(JSON.stringify({'email': email,
	 				     'password': password}));
	})
}));
