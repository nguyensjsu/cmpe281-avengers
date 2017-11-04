from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json
import bson
from bson.objectid import ObjectId
from bson import json_util

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'books'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/books'

mongo = PyMongo(app)

#  The GET request returns all the books in the database.

@app.route('/v1/books', methods=['GET'])
def books():
    books = mongo.db.books_collection
        try:
            output = books.find()
            data = dumps(output)
        except Exception as e:
            return jsonify({"Status":"Error"})
    return jsonify({"Status": "OK", "data": json.loads(data)})

# The GET request with oid returns a particular document having that Id
# The PUT request decrements the quantity of the book in the inventory

@app.route('/v1/books/<oid>', methods=['GET','PUT'])
def get_book_by_id(oid):
    books = mongo.db.books_collection
    if request.method =='PUT':
        try:
            output = books.update_one({'_id': ObjectId(oid)},\
                                      {'$inc':{\
                                               'Qty': -1\
                                              }})
        except Exception as e:
            return jsonify({"Status": "Error"})
    elif request.method == 'GET':
        try:
            output = books.find_one({'_id': ObjectId(oid)})
            data = dumps(output)
        except Exception as e:
            return jsonify({"Status":"Error"})
    return jsonify({"Status": "OK", "data": json.loads(data)})

if __name__ == '__main__':
    app.run(debug=True)
