from flask import Flask, request
from flask_restful import Resource, Api
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps

app = Flask(__name__)
# configure the mondodb database name with 'books' and database service uri for the same
app.config['MONGO_DBNAME'] = 'books'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/books'

# Using 'PyMongo' python-mongodb driver 
mongo = PyMongo(app)

# Using flask_restful Api
api = Api(app)

class ProductApi(Resource):
    def get(self):
        output = mongo.db.books_collection.find()
        data = dumps(output)
        return jsonify({"Status": "OK", "data": data})

api.add_resource(ProductApi,'/')

if __name__ == '__main__':
    app.run(debug=True)
