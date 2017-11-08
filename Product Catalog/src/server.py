import pymongo
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json
import bson
from bson.objectid import ObjectId
from bson import json_util
from pymongo import errors

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'books'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/books'

mongo = PyMongo(app)

#  The GET request returns all the books in the database.
global books
 
@app.route('/v1/books', methods=['GET'])
def books():
    if mongo is None:
        return "No server"
    try:
        books = mongo.db.books_collection
        output = books.find()
        data = dumps(output)
    except pymongo.errors.ConnectionFailure as e:
        return jsonify({"Status": "Error","Message":"Connection lost with database server"})
    except pymongo.errors.ServerSelectionTimeoutError as e:
        return jsonify({"Status": "Error","Message":"Could not connect to database server"})
    return jsonify({"Status": "OK", "data": json.loads(data)})

# The GET request with oid returns a particular document having that Id
# The PUT request decrements the quantity of the book in the inventory

@app.route('/v1/books/<oid>', methods=['GET','PUT'])
def book_by_id(oid):
    try:
        books = mongo.db.books_collection
    except pymongo.errors.ConnectionFailure as e:
        return jsonify({"Status": "Error","Message":"Connection lost with database server"})
    except pymongo.errors.ServerSelectionTimeoutError as e:
        return jsonify({"Status": "Error","Message":"Could not connect to database server"})
    
    if request.method =='PUT':
        try:
            output = books.update_one({'_id': ObjectId(oid)},\
                                      {'$inc':{\
                                               'Qty': -1\
                                              }})
        except Exception as e:
            print(e)
            return jsonify({"Status": "Error"})
        return jsonify({"Status":"OK"})
    elif request.method == 'GET':
        try:
            output = books.find_one({'_id': ObjectId(oid)})
            data = dumps(output)
        except Exception as e:
            return jsonify({"Status":"Error"})
        return jsonify({"Status": "OK", "data": json.loads(data)})

if __name__ == '__main__':
    app.run(debug=True)
