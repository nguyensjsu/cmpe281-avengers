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
#  The PUT request decrements the quantity of the book in the inventory

@app.route('/v1/books', methods=['PUT','GET'])
def books():
    books = mongo.db.books_collection
    #TODO
    #Decrement Quantity for PUT method
    if request.method == 'GET':
        try:
            output = books.find()
            data = dumps(output)
        except Exception as e:
            return jsonify({"Status":"Error"})
    return jsonify({"Status": "OK", "data": json.loads(data)})

# The GET request with oid returns a particular document having that Id

@app.route('/v1/books/<oid>', methods=['GET'])
def get_book_by_id(oid):
    books = mongo.db.books_collection
    try:
        output = books.find_one({'_id': ObjectId(oid)})
        data = dumps(output)
    except Exception as e:
        return jsonify({"Status":"Error"})
    return jsonify({"Status": "OK", "data": json.loads(data)})

if __name__ == '__main__':
    app.run(debug=True)
