Install MongdoDB ([installation](https://docs.mongodb.com/v3.0/tutorial/install-mongodb-on-os-x/))

Start mongodb service  //make sure PATH enviornment variable is set to <mongodb-nstallation-directory>/bin
```shell
sudo mongod
```
Start mongo shell ([mongo](https://docs.mongodb.com/manual/mongo/))
```shell
mongo
```
Create 'logs' database
```shell
use logs
```
Mongodb will create a new database by the name 'logs' if it doesn't exist.
Similarly, create a collection by the name "logs_collection". If there is none by the name, mongodb will create a new one.

Insert a few documents. 
For example:
```shell
db.logs_collection.insertOne({"log_id":1,"timestamp":"2017-10-26 04:06:10","message":"Sample User Activity Log Message"})
```
Response would be like:
```bson
{
	"acknowledged" : true,
	"insertedId" : ObjectId("59f1614878d10b86c988c66d")
}
```

Run the server
```shell
python server.py &
```
Test the api with GET request
```shell
curl 127.0.0.1:5000/logs
```
Response would be like:
```json
{
  "Status": "OK", 
  "data": [
    {
      "_id": {
        "$oid": "59f15f32b05383671a9b9a94"
      }, 
      "log_id": 2,
      "timestamp": "2017-10-26 04:06:10",
      "message": "Sample User Activity Log Message"
    },
  ]
}
```
