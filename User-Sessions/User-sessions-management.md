# Session
Sessions means a particular interval of time.

# Need of Session Management
HTTP is a stateless protocol. It does not save the user details/state and considers every request as a new request. Every request-response is sent over a new TCP connection.
The server and browser need to have a way to store the user state od identity.
To maintain the state and to make the server understand the requests are from the same user for some amount of time, User session management is necessary in a project.
  
  
# How does Session management work?
1. The user sends the first request to the server via a browser.
2. The server checks if the browser contains cookie information for the request.
3. If the browser does not have any cookie/ or the server does not know the browser,
    a. The server creates a cookie which is a unique identifier and saves it as a key value pair to identify the browser.
    b. It sends the cookie back to the browser in the response which in turn is saved by the browser.
4. Upon subsequent requests, the browser sends this cookie value in the requests. The server first checks if it has any mapping for the browser using the cookie value and serves the requested information.
  
# User session Tracking methods
1. Cookies
2. Hidden Form Field
3. URL Rewriting
4. HttpSession
    
# References
1. https://www.awsadvent.com/2016/12/17/session-management-for-web-applications-on-aws-cloud/
2. https://www.javatpoint.com/session-tracking-in-servlets
