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
    if request.method == 'PUT':        
        #TODO 
        # decrement quantity attribute
        # for every product ordered
    elif request.method == 'GET':
        output = books.find()
        data = dumps(output)
    return jsonify({"Status": "OK", "data": data})

# The GET request with oid returns a particular document having that Id

@app.route('/books/<oid>', methods=['GET'])
def get_book_by_id(oid):
	#TODO 
	# parse the request body for oid
	# fetch the product by oid
	# return the document

if __name__ == '__main__':
    app.run(debug=True)
