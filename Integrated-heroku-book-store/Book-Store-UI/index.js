var express = require('express');
var path = require('path');
var app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var bodyParser = require('body-parser');
var csurf = require('csurf');
//var csurfProtection = csurf();
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('port', (process.env.PORT || 5000));

//app.use(csurfProtection);
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: 'mysupersecret', 
	resave: false, 
	saveUninitialiazed: false,
	cookie: { maxAge: 180 * 60 * 1000} //in milliseconds 
}));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//   response.render('pages/index');
// });

app.get('/signup', function(request, response) {
  response.render('user/signup');
});

app.post('/signup', function(request, response) {
	if(request.session.oldUrl){
		var oldUrl = request.session.oldUrl;
		request.session.oldUrl = null;
		response.redirect(oldUrl);
	} else {
		response.redirect('/user/profile');
	}
});

app.get('/signin', function(request, response) { //URL
	// var messages = request.flash('error');
	// res.render('user/signin', {csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});  //view file views/user/signin.hbs
	response.render('user/signin');
});

app.post('/signin', function(request, response) {
	if(req.session.oldUrl){
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});

app.get('/logout', function (request, response) {
	//console.log("Delete session called for id :" + req.session.currentuser.id);
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
    var id = request.session.currentuser.id;
	request.session.sessionvalue =  "";
    request.session.currentuser = "";
	request.logout();
	res.redirect('/');
	xmlhttp.open("DELETE", "http://localhost:9000/v1/login");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify({'id': id}));
});

app.get('/user/profile', function(request,response){
	response.render('user/profile');
});

// app.post('/logs/insert', function(request, response){
function activityLog(log, response) {
	console.log("inside activity log function");
	var data = {
		"log_id" : 1,
		"user" : "Aartee",
		"ipAddress" : "10.0.0.0",
		"message" : "Sample message",
		"timestamp" : "12:00:01"
	};
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			resptext = JSON.parse(this.responseText);
			state_changed = true;
			// var data = {
			// 	tmp: resptext.shortUrl,
			// 	noSuccess: 0,
			// 	isValidURL: 1
			// }
			response.render('pages/logs', {data: log});
		}
	}
	
    xmlhttp.open("POST", "http://localhost:7000/logs/insert");
    //xmlhttp.open("POST", "http://control-panel-elb-492600712.us-west-1.elb.amazonaws.com:8081/v1/shorten");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	//xmlhttp.send(JSON.stringify({'originalUrl': request.body.originalUrl}));
	xmlhttp.send(JSON.stringify(log));
}
	
// });

app.get('/add-to-cart/:id', function(request, response) {
	// var productId = req.params.id;
	// var cart = new Cart(req.session.cart ? req.session.cart : {});

	// Product.findById(productId, function(err, product) {
	// 	if(err) {
	// 		return res.redirect('/');
	// 	}
	// 	cart.add(product, product.id);
	// 	req.session.cart = cart; //storing the cart into the session
	// 	console.log(req.session.cart);
	// 	res.redirect('/');
	// });
	console.log("inside add-to-cart");
	

	//called Aartee's UserActivityLog's POSt method
	//Create Json of 5 attributes like
	var log = {
		"log_id": 345,  //not required, Aartee will change python server accordingly
		"user" : "Aartee",
		"ipAddress" : "10.0.0.0",
		"message" : "Added this item",
		"timestamp" : "12:00:01"
	};
	activityLog(log, response);
	response.redirect('/');

});

app.get('/', function(request, response){
	console.log("In GET Products ");
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			console.log("data" + this.responseText);
			data = JSON.parse(data.data);
			console.log("data" + data);
			//console.log("data " + data[0].message);
			var array = [];
			for(d in data){
				//if(data[d].user != null || data[d].ipAddress != null || data[d].message != null || data[d].timestamp != null){
					array.push(data[d]);
				//}
			}
			response.render('pages/index', {products: array});
		}
	}
    xmlhttp.open("GET", "http://0.0.0.0:8080/v1/books");  //User Activity Logs Python server
    //xmlhttp.open("GET", "http://linked-redirect-elb-13359793.us-west-1.elb.amazonaws.com:8082/v1/domain");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();

});

app.get('/shopping-cart', function(request, response) {
	// if(!req.session.cart) {
	// 	return res.render('shop/shopping-cart', {products: null});
	// }
	// var cart = new Cart(req.session.cart);
	// res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
	response.render('shop/shopping-cart');
});

app.get('/checkout', isLoggedIn, function(request, response) {
	// if(!req.session.cart) {
	// 	return res.redirect('/shopping-cart');
	// }
	// var cart = new Cart(req.session.cart);
	// var errMsg = req.flash('error')[0];
	// res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
	response.redirect('/');
});

function isLoggedIn(req, res, next) {
	// if (!req.session.sessionvalue == undefined && !req.session.sessionvalue == "" && req.isAuthenticated()) {
	// 	return next();
	// }
	// req.session.oldUrl = req.url;
	res.redirect('/signin');
}

app.get('/logs', function(request, response){
	console.log("In GET Logs ");
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			console.log("data" + this.responseText);
			data = JSON.parse(data.data);
			console.log("data" + data);
			console.log("data " + data[0].message);
			var array = [];
			for(d in data){
				if(data[d].user != null || data[d].ipAddress != null || data[d].message != null || data[d].timestamp != null){
					array.push(data[d]);
				}
			}
			response.render('pages/logs', {data: array});
		}
	}
    xmlhttp.open("GET", "http://127.0.0.1:7000/logs");  //User Activity Logs Python server
    //xmlhttp.open("GET", "http://linked-redirect-elb-13359793.us-west-1.elb.amazonaws.com:8082/v1/domain");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
});

app.listen(process.env.PORT || 5000, function() {
  console.log('Node app is running on port ' + app.get('port'));
});
