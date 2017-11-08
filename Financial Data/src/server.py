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

# Using 'PyMongo' python-mongodb driver 
mongo = PyMongo(app)

# Using flask_restful Api
api = Api(app)

class ProductApi(Resource):
    def get(self):
        output = mongo.db.myorders_collection.find()
        data = dumps(output)
        return jsonify({"Status": "OK", "data": json.loads(data)})

api.add_resource(ProductApi,'/')

if __name__ == '__main__':
    app.run(debug=True)
