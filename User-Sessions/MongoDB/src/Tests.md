# CURL commands to test the API  
  
## 1. POST API for register:  
curl -H "Content-Type: application/json" -X POST -d '{"firstname":"Amita","lastname":"Kamat", "email":"abc@gmail.com", "password":"xyz"}' http://localhost:5000/v1/users
