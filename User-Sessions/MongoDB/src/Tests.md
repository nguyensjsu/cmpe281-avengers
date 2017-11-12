# CURL commands to test the API  
  
## 1. POST API for register:  
curl -H "Content-Type: application/json" -X POST -d '{"firstname":"Amita","lastname":"Kamat", "email":"abc@gmail.com", "password":"xyz"}' http://localhost:5000/v1/users
  
## 2. PUT API for updating user details:  
curl -H "Content-Type: application/json" -X PUT -d '{"firstname":"Ami","lastname":"Kam", "email":"abc@gmail.com", "password":"xyz"}' http://localhost:5000/v1/users/<id-from-above-command>
  
## 3. GET user details:
curl -X GET http://localhost:5000/v1/users/<id>
  
## 4. Login Post:  
curl -H "Content-Type: application/json" -X POST -d '{"email":"abc@gmail.com", "password":"xyz"}' http://localhost:5000/v1/login
  
## 5. Login Get:  
curl -H "Content-Type: application/json" -X GET -d '{"id":<id>, "session":<session-value>}' http://localhost:5000/v1/login

## 6. Login Delete:  
curl -H "Content-Type: application/json" -X DELETE -d '{"id":<id>}' http://localhost:5000/v1/login 
