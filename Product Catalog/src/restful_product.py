from flask import Flask
from flask import jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'books'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/books'

mongo = PyMongo(app)

@app.route('/books', methods=['GET'])
def get_all_books():
    books = mongo.db.books_collection
    output = books.find()
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
