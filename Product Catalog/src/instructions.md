Install MongdoDB ([installation](https://docs.mongodb.com/manual/installation/))

Start mongodb service
```shell
sudo service mongod start
```
Start mongo shell ([mongo](https://docs.mongodb.com/manual/mongo/))
```shell
mongo
```
Create 'books' database
```shell
use books
```
Mongodb will create a new database by the name 'books' if it doesn't exist. Similarly, create a collection by the name "books_collection". If there is none by the name, mongodb will create a new one.

Insert a few documents. 
For example:
```shell
db.books_collection.insertOne({"title":"sample book","author":"sample author","price":"$10.00"})
```
Response would be like:
```bson
{
	"acknowledged" : true,
	"insertedId" : ObjectId("59ef95771fe8881db48299b8")
}
```

Run the server
```shell
python server.py &
```
Test the api with GET request
```shell
curl 127.0.0.1:5000
```
Response would be like:
```json
{
  "Status": "OK", 
  "data": [
    {
      "_id": {
        "$oid": "59ea4f507c494b5e85c1954d"
      }, 
      "author": "ABCD EFGH", 
      "price": 10.0, 
      "title": "Python Crash course"
    }, 
    {
      "_id": {
        "$oid": "59ea51397c494b650987eaa8"
      }, 
      "author": "ABCD EFGH", 
      "price": 10.0, 
      "title": "Python Crash course"
    }, 
    {
      "_id": {
        "$oid": "59ef95771fe8881db48299b8"
      }, 
      "author": "sample author", 
      "price": "$10.00", 
      "title": "sample book"
    }
  ]
}
```
