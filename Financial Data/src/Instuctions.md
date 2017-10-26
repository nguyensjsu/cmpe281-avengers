Install MongdoDB (https://docs.mongodb.com/manual/installation/)

Start mongodb service

sudo service mongod start
Start mongo shell (mongo)

mongo
Create 'myorders' database

use books
Mongodb will create a new database by the name 'myorders' if it doesn't exist. Similarly, create a collection by the name "myorders_collection". If there is none by the name, mongodb will create a new one.

Insert a few documents. For example:

db.myorders_collection.insertOne({"order-id":"abcd1234","order-date":"my date","total-amount":"$100.00"})

Response:

{
	"acknowledged" : true,
	"insertedId" : ObjectId("59f178a4fe86eecec7cf00c2")
}

Run the server

python server.py &

Test the api with GET request
