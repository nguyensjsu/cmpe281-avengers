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

@app.route('/books', methods=['GET',])
def books():
    books = mongo.db.books_collection
    output = books.find()
    data = dumps(output)
    return jsonify({"Status": "OK", "data": data})

@app.route('/books/insert/', methods=['POST'])
def insert_book():
    books = mongo.db.books_collection        
    book = {}
    result = json.loads(request.get_data(as_text=True))
    book['title']=result['title']
    book['author'] = result['author']
    book['price']=result['price']
    output = books.insert(book)
    data = dumps(output)
    return jsonify({"Status": "OK", "data": data})

@app.route('/books/title/<title>', methods=['GET'])
def get_book_by_title(title):
    books = mongo.db.books_collection
    output = books.find_one({'title': title})
    data = dumps(output)
    return jsonify({"Status": "OK", "data": data})

@app.route('/books/author/<author>', methods=['GET'])
def get_book_by_author(author):
    books = mongo.db.books_collection
    output = books.find_one({'author': author})
    data = dumps(output)
    return jsonify({"Status": "OK", "data": data})

@app.route('/books/delete/<oid>', methods=['DELETE'])
def delete_book(oid):
    books = mongo.db.books_collection
    try:
        output = books.delete_one({'_id': ObjectId(oid)})
    #data = dumps(output,default=json_util.default)
        return jsonify({"Status": "OK"})
    except e:
        return jsonify({"Error":"404"})

if __name__ == '__main__':
    app.run(debug=True)
