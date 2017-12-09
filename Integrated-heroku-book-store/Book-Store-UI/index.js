var express = require('express');
var path = require('path');
var app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var bodyParser = require('body-parser');
var csurf = require('csurf');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('port', (process.env.PORT || 5000));
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
var hasErrors = false;
var cartItemsQuantity = 0;
var uId;
var uSession;
var flag = 0;

app.get('/signup', function(request, response) {
  response.render('user/signup', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
});

app.post('/signup', function(request, response) {
	var newUser = {};
	newUser.firstname = request.body.firstname;
	newUser.lastname = request.body.lastname;
	newUser.email = request.body.email;
	newUser.password = request.body.password;

    var xmlhttp = new XMLHttpRequest();  
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				console.log("API call successful. Status: " + this.status);
				res = JSON.parse(this.responseText);
				state_changed = true;
				request.session.sessionvalue = res.session;
				newUser.id = JSON.stringify(res.id);
				request.session.id = res.id;
				console.log("session:" + JSON.stringify(request.session.sessionvalue));		
				console.log(request.user);
				request.session.currentuser = newUser;
				isLoggedIn = true;
				hasErrors = false;
				var log = {
					"user" : request.session.currentuser.firstname,
					"message" : request.session.currentuser.firstname+" Signed up!",
					"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
				};
				activityLog(log, response);

				response.render('pages/index', {products: array, login: isLoggedIn, hasErrors: hasErrors,cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
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

app.get('/signin', function(request, response) { 
	response.render('user/signin', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
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
				isLoggedIn = true;
                uId = request.session.currentuser.id;
				var log = {
					"user" : request.session.currentuser.firstname,
					"message" : request.session.currentuser.firstname+" Signed in!",
					"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
				};
				activityLog(log, response);

				response.render('pages/index', {products: array, login: isLoggedIn, hasErrors: hasErrors, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
		        }
		}
		console.log("before POST for Login");
		xmlhttp.open("POST", "http://localhost:9000/v1/login");
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.send(JSON.stringify({'email': request.body.email,
	 				     'password': request.body.password}));
});

app.get('/logout', function (request, response) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			console.log("API call successful for sign out. Status: " + this.status);
			res = JSON.parse(this.responseText);
			console.log(this.responseText);
			if(res.result == 0)
				console.log("Session deleted successfully.");
			else if (res.result == 1)	
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
		"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
	};
	activityLog(log, response);

	request.session.sessionvalue =  "";
    request.session.currentuser = "";
	xmlhttp.open("DELETE", "http://localhost:9000/v1/login");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify({'id': id}));
	isLoggedIn = false;
	response.render('pages/index', {products: array, login: isLoggedIn, hasErrors: hasErrors, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
});

function activityLog(log, response) {
	console.log("inside activity log function");
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			resptext = JSON.parse(this.responseText);
			state_changed = true;
		}
	}
    xmlhttp.open("POST", "http://localhost:7000/logs/insert");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(log));
}

app.get('/add-to-cart/:id', function(request, response) {
	console.log("haroon testing params");
	var productId = request.params.id;
	console.log(productId);
	console.log(request.session);
	
	try{
		uSession = request.session.sessionvalue;
		if(flag == 1)
		{
			uId = uId;
		}else{
			uId = request.session.currentuser.id;
		}
    }
    catch(e) {
    	//Display alert box and redirect to signin page
    	if(e.name == "TypeError")
    	    response.render('user/signin', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
    }
    console.log("session value:"+request.session.sessionvalue);
    console.log("session id:"+request.session.currentuser.id);
    
    //Check whether the user is logged in
	var xmlhttp2 = new XMLHttpRequest();  
	xmlhttp2.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			cartItemsQuantity++;
			state_changed = true;
			var data = JSON.parse(this.responseText);
			console.log(data);
			resResult = data.result;
			// If logged in and session is valid
            if(resResult == 0) {
                var xmlhttp = new XMLHttpRequest();
	            xmlhttp.onreadystatechange = function() {

          		if (this.readyState === 4 && this.status === 200) {
		    	state_changed = true;
			    data = this.responseText;
			    //data is in string format
			    data = JSON.parse(data);
                //data is in json format
			    data = data.data;
			    //data now contains output from product catalog
            
                var requestData = {
                "author" : data.Author,
                "imageUrl" : data.Image_URL,
                "price" : data.Price,
                "title" : data.Title,
                "productId" : productId,
                "userId" : uId
                }
                //add to cart
	            var xmlhttp1 = new XMLHttpRequest();  
	            xmlhttp1.onreadystatechange = function() {
		        if (this.readyState === 4 && this.status === 200) {
			        state_changed = true;
			    
		            }
	            }
                xmlhttp1.open("POST", "http://0.0.0.0:9999/v1/cart"); 
    			
    			var log = {
					"user" : request.session.currentuser.firstname,
					"message" : request.session.currentuser.firstname+" Added " + data.Title + " book.",
					"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
				};
				activityLog(log, response);

	            xmlhttp1.setRequestHeader("Content-Type", "application/json");
	            xmlhttp1.send(JSON.stringify(requestData));	
			    response.render('pages/index', {products: array, login: isLoggedIn, hasErrors: hasErrors, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
		        }
	        }
            xmlhttp.open("GET", "http://0.0.0.0:8080/v1/books/"+productId);  
	        xmlhttp.setRequestHeader("Content-Type", "application/json");
	        xmlhttp.send();
            } 
		}
	}
    xmlhttp2.open("POST", "http://127.0.0.1:9000/v1/verifySession"); 
	xmlhttp2.setRequestHeader("Content-Type", "application/json");
	xmlhttp2.send(JSON.stringify({'id':uId, 'session':uSession}));	
});

app.get('/', function(request, response){
	console.log("In GET Products ");
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			data = JSON.parse(data.data);
			array = [];
			for(d in data){
					array.push(data[d]);
			}
			response.render('pages/index', {products: array, login: isLoggedIn, hasErrors: hasErrors, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
		}
	}
    xmlhttp.open("GET", "http://0.0.0.0:8080/v1/books");  
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
});

app.get('/hightolow', function(request, response){
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			data = JSON.parse(data.data);
			array = [];

			for(d in data){
				array.push(data[d]);
			}
			response.render('pages/index', {products: array, login: isLoggedIn, hasErrors: hasErrors, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
		}
	}
    xmlhttp.open("GET", "http://0.0.0.0:8080/v1/sort/hightolow");  
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
});

app.get('/lowtohigh', function(request, response){
	console.log("Sorting products from low to low ");
	var xmlhttp = new XMLHttpRequest();  
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			data = JSON.parse(data.data);
			array = [];
			for(d in data){
					array.push(data[d]);
			}
			response.render('pages/index', {products: array, login: isLoggedIn, hasErrors: hasErrors, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
		}
	}
    xmlhttp.open("GET", "http://0.0.0.0:8080/v1/sort/lowtohigh");  
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
});

app.post('/find', function(request, response) {
	if(request.body.search != ""){
		console.log(typeof(request.body.filter));
		var xmlhttp = new XMLHttpRequest();
		var my_url = "";
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				state_changed = true;
				var data = JSON.parse(this.responseText);
				data = JSON.parse(data.data);
				array = [];
				for(d in data){
					array.push(data[d]);
				}
				response.render('pages/index', {products: array, login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
			}
		}
		if(request.body.filter === "Author"){
		   my_url = "http://0.0.0.0:8080/v1/search/author/"+request.body.search;
		} else {
			my_url = "http://0.0.0.0:8080/v1/search/title/"+request.body.search;
		}
		if(!(request.session.sessionvalue === undefined || request.session.currentuser === undefined || request.session.sessionvalue === "" || request.session.currentuser === "")){
			var log = {
				"user" : request.session.currentuser.firstname,
				"message" : request.session.currentuser.firstname+" Searched For "+ request.body.search +" in "+request.body.filter,
				"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
			};
			activityLog(log, response);
		}
	    xmlhttp.open("GET", my_url);  
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.send();
	}
	else{
		var xmlhttp = new XMLHttpRequest();  
		xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			data = JSON.parse(data.data);
			array = [];
			for(d in data){
				array.push(data[d]);
			}
			response.render('pages/index', {userId : uId, products: array, login: isLoggedIn, hasErrors: hasErrors, cartItemsQuantity: cartItemsQuantity, userSession: uSession});
		}
	}
	xmlhttp.open("GET", "http://0.0.0.0:8080/v1/books");  
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
	
	}
	if(request.body.filter === "Author"){
           my_url = "http://0.0.0.0:8080/v1/search/author/"+request.body.search;
	} else {
		my_url = "http://0.0.0.0:8080/v1/search/title/"+request.body.search;
	}
    xmlhttp.open("GET", my_url);  
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
});

app.get('/shopping-cart', function(request, response) {
	try{
	    if(request.session.sessionvalue === undefined || request.session.currentuser === undefined || request.session.sessionvalue === "" || request.session.currentuser === "")
	    {
	    	response.render('user/signin', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
	    }       
	    else
	    {
			uSession = request.session.sessionvalue;
	    	uId = request.session.currentuser.id;
	    	console.log("session value:"+request.session.sessionvalue);
	    	console.log("session id:"+request.session.currentuser.id);
	    
		    //Check whether the user is logged in
			var xmlhttp2 = new XMLHttpRequest();  
			xmlhttp2.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				state_changed = true;
				var data = JSON.parse(this.responseText);
				console.log(data);
				resResult = data.result;
				// If logged in and session is valid
		    	if(resResult == 0) {
				    var xmlhttp = new XMLHttpRequest();  
				    xmlhttp.onreadystatechange = function() {
				 	if (this.readyState === 4 && this.status === 200) {
						state_changed = true;
				    	var data = JSON.parse(this.responseText);
					    cartBooks = JSON.parse(data.data);
						cartStats = JSON.parse(data.stats);
					    cartArray = [];
						cartStatsArray = [];
						for(data in cartBooks){
				   			cartArray.push(cartBooks[data]);
					    }
						for(stat in cartStats){
							cartStatsArray.push(cartStats[stat]);
			    		}
				    	response.render('shop/shopping-cart', {userId: uId, cartItems: cartArray, login: isLoggedIn,cartStatistics : cartStatsArray,cartItemsQuantity: cartItemsQuantity, userSession: uSession } );
			    		var log = {
							"user" : request.session.currentuser.firstname,
							"message" : request.session.currentuser.firstname+" Accessed Shopping Cart",
							"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
						};
						activityLog(log, response);
				    	response.render('shop/shopping-cart', {userId: uId, cartItems: cartArray, login: isLoggedIn,cartStatistics : cartStatsArray,cartItemsQuantity: cartItemsQuantity, userSession: uSession } );
					}
				}
				xmlhttp.open("POST", "http://0.0.0.0:9999/v1/shoppingCart");  //User Activity Logs Python server
				xmlhttp.setRequestHeader("Content-Type", "application/json");
				var requestData = {"userId": uId};
				xmlhttp.send(JSON.stringify(requestData));
			}
		}
		} //if valid session
		xmlhttp2.open("POST", "http://127.0.0.1:9000/v1/verifySession");  
		xmlhttp2.setRequestHeader("Content-Type", "application/json");
		xmlhttp2.send(JSON.stringify({'id':uId, 'session':uSession}));	
	}
	}
	catch(e) {
	    	//Display alert box and redirect to signin page
	    	if(e.name == "TypeError")
	    	    response.render('user/signin', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
    }
});

app.post('/checkout', function(request, response){
	try{
		uSession = request.session.sessionvalue;
    	uId = request.session.currentuser.id;
    }
    catch(e) {
    	//Display alert box and redirect to signin page
    	if(e.name == "TypeError")
    	    response.render('user/signin', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userSession: uSession});
    }
    console.log("session value:"+request.session.sessionvalue);
    console.log("user id:"+request.session.currentuser.id);
    
    //Check whether the user is logged in
	var xmlhttp2 = new XMLHttpRequest();  
	xmlhttp2.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			console.log(data);
			resResult = data.result;
			// If logged in and session is valid
            if(resResult == 0) {
	        	var xmlhttp = new XMLHttpRequest();
        		xmlhttp.onreadystatechange = function() {
		    	if (this.readyState === 4 && this.status === 200) {
			    	state_changed = true;
					var data = JSON.parse(this.responseText);
			    	orderData = JSON.parse(data.data);
				    console.log(orderData);
	                orderStats = JSON.parse(data.stats);
	                console.log(orderStats);
			    	orderArray = [];
	                orderStatsArray = [];

	     			for(data in orderData){
		   				orderArray.push(orderData[data]);
			    	}
				    for(stat in orderStats){
						orderStatsArray.push(orderStats[stat]);
	    			}
			        var xmlhttp1 = new XMLHttpRequest();  
			        xmlhttp1.onreadystatechange = function() {
		    		if (this.readyState === 4 && this.status === 200) {
			    		state_changed = true;
					    data = this.responseText;
				    	//data is in string format
					    data = JSON.parse(data);
					    console.log("response after adding to order database:");
					    console.log(data);
					    status = data.Status;
					    if(status == 'OK') {
				    	orderDate = data.timestamp;
				    	orderId = data.orderId;
				    	
				    	//Delete from cart
			            var xmlhttp4 = new XMLHttpRequest();  
			            xmlhttp4.onreadystatechange = function() {
				        if (this.readyState === 4 && this.status === 200) {
					        state_changed = true;
					    }
	           		}
                	xmlhttp4.open("DELETE", "http://0.0.0.0:9999/v1/cart");  
	            	xmlhttp4.setRequestHeader("Content-Type", "application/json");
	            	var requestData4 = {"userId": uId};
	            	xmlhttp4.send(JSON.stringify(requestData4));

	            	var log = {
						"user" : request.session.currentuser.firstname,
						"message" : request.session.currentuser.firstname+" has done the payment successfully!",
						"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
					};
					activityLog(log, response);

			    	response.render('pages/order', {data: orderArray, stats: orderStatsArray,
			     	orderId: orderId, orderDate:orderDate, login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userSession: uSession});
			    }
		    }
	    }
        xmlhttp1.open("POST", "http://0.0.0.0:2000/v1/order");  
	    xmlhttp1.setRequestHeader("Content-Type", "application/json");
	    var requestData2 = {"userId": uId, "orderData":orderData, "stats":orderStats};
	    xmlhttp1.send(JSON.stringify(requestData2));

	}
	}
    xmlhttp.open("POST", "http://0.0.0.0:9999/v1/checkout");  
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    var requestData = {"userId": uId};
    console.log(requestData);
    xmlhttp.send(JSON.stringify(requestData));
	}
	}
	}//end of function
    xmlhttp2.open("POST", "http://127.0.0.1:9000/v1/verifySession"); 
	xmlhttp2.setRequestHeader("Content-Type", "application/json");
	xmlhttp2.send(JSON.stringify({'id':uId, 'session':uSession}));	
});

app.get('/checkout', function(request, response) {
	try{
		uSession = request.session.sessionvalue;
    	uId = request.session.currentuser.id;
    }
    catch(e) {
    	//Display alert box and redirect to signin page
    	if(e.name == "TypeError")
    	    response.render('user/signin', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
    }
    console.log("session value:"+request.session.sessionvalue);
    console.log("user id:"+request.session.currentuser.id);
    
    //Check whether the user is logged in
	var xmlhttp2 = new XMLHttpRequest();  
	xmlhttp2.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			console.log(data);
			resResult = data.result;
			// If logged in and session is valid
            if(resResult == 0) {
	        var xmlhttp = new XMLHttpRequest();
        	xmlhttp.onreadystatechange = function() {
		    if (this.readyState === 4 && this.status === 200) {
			    state_changed = true;

	    		var data = JSON.parse(this.responseText);
		    	orderData = JSON.parse(data.data);
			    console.log(orderData);
                orderStats = JSON.parse(data.stats);
                console.log(orderStats);
		    	orderArray = [];
                orderStatsArray = [];

     			for(data in orderData){
	   				orderArray.push(orderData[data]);
		    	}
			    for(stat in orderStats){
					orderStatsArray.push(orderStats[stat]);
    			}
	        var xmlhttp1 = new XMLHttpRequest();  
	        xmlhttp1.onreadystatechange = function() {
		    if (this.readyState === 4 && this.status === 200) {
			    state_changed = true;
			    data = this.responseText;
		    	//data is in string format
			    data = JSON.parse(data);
			    console.log("response after adding to order database:");
			    console.log(data);
			    status = data.Status;
			    if(status == 'OK') {
		    	orderDate = data.timestamp;
		    	orderId = data.orderId;
			    response.render('pages/order', {data: orderArray, stats: orderStatsArray,
			     orderId: orderId, orderDate:orderDate, login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
			    }
		    }
	        }
            xmlhttp1.open("POST", "http://0.0.0.0:2000/v1/order");  
	        xmlhttp1.setRequestHeader("Content-Type", "application/json");
	        var requestData2 = {"userId": uId, "orderData":orderData, "stats":orderStats};
	        xmlhttp1.send(JSON.stringify(requestData2));

		    }
	        }
            xmlhttp.open("POST", "http://0.0.0.0:9999/v1/checkout");  
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            var requestData = {"userId": uId};
            console.log(requestData);
            xmlhttp.send(JSON.stringify(requestData));
            } 
		}
	}//end of function
    xmlhttp2.open("POST", "http://127.0.0.1:9000/v1/verifySession");  
	xmlhttp2.setRequestHeader("Content-Type", "application/json");
	xmlhttp2.send(JSON.stringify({'id':uId, 'session':uSession}));	
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
			var array = [];
			data = data.slice(0).reverse();
			for(d in data){
				if(data[d].user != null || data[d].ipAddress != null || data[d].message != null || data[d].timestamp != null){
					array.push(data[d]);
				}
			}
			response.render('pages/logs', {data: array, login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
		}
	}
    xmlhttp.open("GET", "http://127.0.0.1:7000/logs");  
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send();
});

app.get('/payment/:totalAmount', function(request, response) {
	response.render('shop/checkout', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, totalAmount: request.params.totalAmount, userSession: uSession});
});

app.get('/myOrders', function(request, response) {
	try{
		var uSession = request.session.sessionvalue;
    	uId = request.session.currentuser.id;
    }
    catch(e) {
    	//Display alert box and redirect to signin page
    	if(e.name == "TypeError")
    	    response.render('user/signin', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
    }    
    //Check whether the user is logged in
	var xmlhttp2 = new XMLHttpRequest();  
	xmlhttp2.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			console.log(data);
			resResult = data.result;
			// If logged in and session is valid
            if(resResult == 0) {

	            var xmlhttp = new XMLHttpRequest();  
				xmlhttp.onreadystatechange = function() {
         		if (this.readyState === 4 && this.status === 200) {
		    	state_changed = true;
			  
     			console.log("after get from python db" + this.responseText);
	    		var data = JSON.parse(this.responseText);
		    	userOrders = JSON.parse(data.data);
			    console.log(userOrders);
                
		    	ordersArray = [];
     			for(order in userOrders){
	   				ordersArray.push(userOrders[order]);
		    	}
		    	var log = {
						"user" : request.session.currentuser.firstname,
						"message" : request.session.currentuser.firstname+ " viewed all orders!",
						"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
					};
					activityLog(log, response);

	    		response.render('pages/orders', {orders: ordersArray, login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
		        }
	            }
                xmlhttp.open("POST", "http://0.0.0.0:2000/v1/myOrders");  
             	xmlhttp.setRequestHeader("Content-Type", "application/json");
            	var requestData = {"userId": uId};
            	console.log(requestData);
            	xmlhttp.send(JSON.stringify(requestData));

            }
		}
	}
    xmlhttp2.open("POST", "http://127.0.0.1:9000/v1/verifySession");  
	xmlhttp2.setRequestHeader("Content-Type", "application/json");
	xmlhttp2.send(JSON.stringify({'id':uId, 'session':uSession}));	
});

app.post('/updateQty', function(request, response) {
	try{
		uSession = request.session.sessionvalue;
    	uId = request.session.currentuser.id;
    	if(uSession === 'undefined' || uId === 'undefined')
    	{
    		response.render('user/signin', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
    	}
    }
    catch(e) {
    	//Display alert box and redirect to signin page
    	if(e.name == "TypeError")
    	    response.render('user/signin', {login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
    }
    console.log("session value:"+request.session.sessionvalue);
    console.log("session id:"+request.session.currentuser.id);
    
    //Check whether the user is logged in
	var xmlhttp2 = new XMLHttpRequest();  
	xmlhttp2.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			state_changed = true;
			var data = JSON.parse(this.responseText);
			resResult = data.result;
			// If logged in and session is valid
	        if(resResult == 0) {
	        	var requestData = {
	            	"author" : request.body.book_Author_Hidden,
	                "imageUrl" : request.body.image_URL_Hidden,
	                "price" : request.body.book_Price_Hidden,
	                "title" : request.body.book_Title_Hidden,
	                "productId" : request.body.book_Id,
	                "userId" : uId,
	                "quantity" : request.body.quantity
	            }
	            //add to cart
		        var xmlhttp1 = new XMLHttpRequest();  
		        xmlhttp1.onreadystatechange = function() {
			    if (this.readyState === 4 && this.status === 200) {
				    state_changed = true;
			    }
		    }
	        xmlhttp1.open("PUT", "http://0.0.0.0:9999/v1/cart");  
		    xmlhttp1.setRequestHeader("Content-Type", "application/json");
		    xmlhttp1.send(JSON.stringify(requestData));	
		    var log = {
				"user" : request.session.currentuser.firstname,
				"message" : request.session.currentuser.firstname+" has updated the quantity of " + request.body.book_Title_Hidden + " to "  + request.body.quantity,
				"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
					};
			activityLog(log, response);
			response.render('pages/index', {products: array, login: isLoggedIn, cartItemsQuantity: cartItemsQuantity, userId : uId, userSession: uSession});
	    } 
	}
	}
    xmlhttp2.open("POST", "http://127.0.0.1:9000/v1/verifySession"); 
	xmlhttp2.setRequestHeader("Content-Type", "application/json");
	xmlhttp2.send(JSON.stringify({'id':uId, 'session':uSession}));	
});

app.get('/:cid/:uSession', function(request, response) {
	console.log("Aartee testing SharedCart");
	uId = request.params.cid;
	uSession = request.params.uSession;
	flag = 1;
	isLoggedIn = true;
	var log = {
		"user" : request.session.currentuser.firstname,
		"message" : request.session.currentuser.firstname+" Shared the Cart!",
		"timestamp" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
	};
	activityLog(log, response);
	response.redirect('/');
});

app.listen(process.env.PORT || 5000, function() {
  console.log('Node app is running on port ' + app.get('port'));
});
