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

#  A single URI for both GET and PUT requests
#  The GET request returns all the books in the database
#  After a successful order, a PUT request decrements the quantity of the books in the inventory

@app.route('/books', methods=['PUT','GET'])
def books():
    books = mongo.db.books_collection
    #TODO
    #Decrement Quantity for PUT method
    if request.method == 'GET':
        output = books.find()
        data = dumps(output)
    return jsonify({"Status": "OK", "data": json.loads(data)})

# The GET request with oid returns a particular document having that Id

@app.route('/books/<oid>', methods=['GET'])
def get_book_by_id(oid):
    books = mongo.db.books_collection
    output = books.find_one({'_id': ObjectId(oid)})
    data = dumps(output)
    return jsonify({"Status": "OK", "data": json.loads(data)})

if __name__ == '__main__':
    app.run(debug=True)
