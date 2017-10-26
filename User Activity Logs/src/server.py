from flask import Flask, request
from flask_restful import Resource, Api
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json

app = Flask(__name__)
# configure the mondodb database name with 'logs' and database service uri for the same
app.config['MONGO_DBNAME'] = 'logs'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/logs'

# Using 'PyMongo' python-mongodb driver 
mongo = PyMongo(app)

# Using flask_restful Api
api = Api(app)

class LogApi(Resource):
    def get(self):
        output = mongo.db.logs_collection.find()
        data = dumps(output)
        return jsonify({"Status": "OK", "data": json.loads(data)})

api.add_resource(LogApi,'/')

if __name__ == '__main__':
    app.run(debug=True)
