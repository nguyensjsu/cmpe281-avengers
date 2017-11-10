from flask import Flask, request
from flask_restful import Resource, Api
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json

app = Flask(__name__)
# configure the mondodb database name with 'myorders' and database service uri for the same
app.config['MONGO_DBNAME'] = 'myorders'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/myorders'
client = mongo_client()

# Using 'PyMongo' python-mongodb driver 
mongo = PyMongo(app)

# Using flask_restful Api
api = Api(app)

#The GET request returns all the orders in the database.
   
  @app.route('/v1/orders', methods=['GET'])
  def orders():
 -    if mongo is None:
 -        return "No server"
 -    try:
 -        books = mongo.db.books_collection
 -        output = books.find()
 -        data = dumps(output)
 -    except pymongo.errors.ConnectionFailure as e:
 -        return jsonify({"Status": "Error","Message":"Connection lost with database server"})
 -    except pymongo.errors.ServerSelectionTimeoutError as e:
 -        return jsonify({"Status": "Error","Message":"Could not connect to database server"})
 -    return jsonify({"Status": "OK", "data": json.loads(data)})
 +    data = client.get_all()
 +    return data

if __name__ == '__main__':
    app.run(debug=True)
