from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'books'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/books'

mongo = PyMongo(app)

@app.route('/books', methods=['GET','POST'])
def books():
    books = mongo.db.books_collection
    if request.method == "GET":
        output = books.find()
        data = dumps(output)
        return jsonify({"Status": "OK", "data": data})
    elif request.method =="POST":
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

if __name__ == '__main__':
    app.run(debug=True)
