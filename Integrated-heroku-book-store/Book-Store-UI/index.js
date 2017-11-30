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

var isLoggedIn = false;
var array = [];
var userId = "";

app.get('/signup', function(request, response) {
  response.render('user/signup');
});

app.post('/signup', function(request, response) {
	var newUser = {};
	newUser.firstname = request.body.firstname;
	newUser.lastname = request.body.lastname;
	newUser.email = request.body.email;
	//TO DO - Password encryption
	newUser.password = request.body.password;

    var xmlhttp = new XMLHttpRequest();  
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				console.log("API call successful. Status: " + this.status);
				res = JSON.parse(this.responseText);
				state_changed = true;
				request.session.sessionvalue = res.session;
				userId = res.id;
				newUser.id = JSON.stringify(res.id);
				request.session.id = res.id;
				console.log("session:" + JSON.stringify(request.session.sessionvalue));		
				console.log(request.user);
				request.session.currentuser = newUser;
				isLoggedIn = true;

				var log = {
					"user" : request.session.currentuser.firstname,
					"message" : request.session.currentuser.firstname+" Signed up!",
					"timestamp" : new Date()
				};
				activityLog(log, response);

				response.render('pages/index', {products: array, login: isLoggedIn});
		        }
		}
		console.log("before POST");
		xmlhttp.open("POST", "http://localhost:9000/v1/users");
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.send(JSON.stringify({'firstname': request.body.firstname,
	 				     'lastname': request.body.lastname,
	 				     'email': request.body.email,
	 				     'password': request.body.password}));
});

app.get('/signin', function(request, response) { //URL
	response.render('user/signin');
});

app.post('/signin', function(request, response) {
	var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				console.log("API call successful for sign in. Status: " + this.status);
				res = JSON.parse(this.responseText);
				var newUser = {};
				newUser.firstname = res.firstname;
				console.log("firstname : " + res.firstname);
				newUser.lastname = res.lastname;
				newUser.email = res.email;
				newUser.password = res.password;
				newUser.id = res.id;
				request.session.sessionvalue = res.session;
				request.session.id = res.id;
				request.session.currentuser = newUser;
				console.log("session:" + JSON.stringify(request.session.sessionvalue));
				//console.log(req.isAuthenticated());
				//return done(null, newUser);
				isLoggedIn = true;

				var log = {
					"user" : request.session.currentuser.firstname,
					"message" : request.session.currentuser.firstname+" Signed in!",
					"timestamp" : new Date()
				};
				activityLog(log, response);

				response.render('pages/index', {products: array, login: isLoggedIn});
		        }
		}
		console.log("before POST for Login");
		xmlhttp.open("POST", "http://localhost:9000/v1/login");
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.send(JSON.stringify({'email': request.body.email,
	 				     'password': request.body.password}));
});

app.get('/logout', function (request, response) {
	//console.log("Delete session called for id :" + req.session.currentuser.id);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			console.log("API call successful for sign out. Status: " + this.status);
			res = this.responseText;
			if(res.result == "0")
				console.log("Session deleted successfully.");
			else if (res.result == "1")	
				console.log("Error deleting session.");	
			else	
				console.log("Session does not exist for the user.");		
	        }
	}
	console.log("before DELETE for Logout");
    var id = request.session.currentuser.id;
    var log = {
		"user" : request.session.currentuser.firstname,
		"message" : request.session.currentuser.firstname+" Logged out!",
		"timestamp" : new Date()
	};
	activityLog(log, response);

	request.session.sessionvalue =  "";
    request.session.currentuser = "";
	xmlhttp.open("DELETE", "http://localhost:9000/v1/login");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify({'id': id}));
	isLoggedIn = false;
	response.render('pages/index', {products: array, login: isLoggedIn});
});

app.get('/user/profile', function(request,response){
	response.render('user/profile');
});

// app.post('/logs/insert', function(request, response){
function activityLog(log, response) {
	console.log("inside activity log function");
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			resptext = JSON.parse(this.responseText);
			state_changed = true;
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
	console.log("haroon testing params");
	var xmlhttp = new XMLHttpRequest();
	var productId = request.params.id;
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			data = this.responseText;
			//data is in string format
			data = JSON.parse(data);
            //data is in json format
			data = data.data;
			//data now contains output from product catalog
            author = data.Author;
            imageUrl = data.Image_URL;
            price = data.Price;
            title = data.Title;

            console.log("user id is :"+userId);	        
	        var xmlhttp1 = new XMLHttpRequest();  
	        xmlhttp1.onreadystatechange = function() {
		    if (this.readyState === 4 && this.status === 200) {
			    state_changed = true;
			    
			    
			//response.render('pages/index', {products: array, login: isLoggedIn});
		    }
	        }
            xmlhttp1.open("POST", "http://0.0.0.0:9999/v1/cart");  //Shopping Cart server
    
	        xmlhttp1.setRequestHeader("Content-Type", "application/json");
	        xmlhttp1.send(JSON.stringify({"userId":userId,"productId":productId,"title":title}));	
			response.render('pages/index', {products: array, login: isLoggedIn});
		}
	}

    xmlhttp.open("GET", "http://0.0.0.0:8080/v1/books/"+productId);  //Product Catalog server
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
});

app.post('/add-to-cart/:product', function(request, response) {
	var product = request.params.product;
	console.log(product);

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
	console.log("inside add-to-cart-post");
	

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
	response.redirect('/', {login: isLoggedIn});

});

app.get('/', function(request, response){
	console.log("In GET Products ");
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			//console.log("data" + this.responseText);
			var data = JSON.parse(this.responseText);
			//console.log("data 1st parse" + data);
			data = JSON.parse(data.data);
			//console.log("data second parse" + data);
			array = [];

			//console.log("data " + data[0].message);
			for(d in data){
				//if(data[d].user != null || data[d].ipAddress != null || data[d].message != null || data[d].timestamp != null){
					array.push(data[d]);
				//}
			}
			//console.log(array);
			response.render('pages/index', {products: array, login: isLoggedIn});
		}
	}
    xmlhttp.open("GET", "http://0.0.0.0:8080/v1/books");  //User Activity Logs Python server
    //xmlhttp.open("GET", "http://linked-redirect-elb-13359793.us-west-1.elb.amazonaws.com:8082/v1/domain");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();

});

app.get('/shopping-cart', function(request, response) {
	console.log("In Shopping cart");
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
					array.push(data[d]);
			}
			response.render('shop/shopping-cart', {products: array});
		}
	}
    xmlhttp.open("GET", "http://0.0.0.0:9999/v1/shoppingCart/");  //User Activity Logs Python server
    //xmlhttp.open("GET", "http://linked-redirect-elb-13359793.us-west-1.elb.amazonaws.com:8082/v1/domain");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify({'userId': userId}));
	response.render('shop/shopping-cart');
});

app.get('/checkout', function(request, response) {
	// if(!req.session.cart) {
	// 	return res.redirect('/shopping-cart');
	// }
	// var cart = new Cart(req.session.cart);
	// var errMsg = req.flash('error')[0];
	// res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
	response.redirect('/', {login: isLoggedIn});
});

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
			//console.log("data " + data[0].message);
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
