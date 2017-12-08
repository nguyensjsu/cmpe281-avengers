import json

from bson.json_util import dumps
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_pymongo import PyMongo

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'logs'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/logs'

mongo = PyMongo(app)

@app.route('/logs', methods=['GET',])
def logs():
    logs = mongo.db.logs_collection
    output = logs.find()
    data = dumps(output)
    return jsonify({"Status": "OK", "data": data})

@app.route('/logs/insert', methods=['POST'])
def insert_log():
    logs = mongo.db.logs_collection
    log = {}
    result = json.loads(request.get_data(as_text=True))
    log['user']=result['user']
    log['message'] = result['message']
    log['timestamp'] = result['timestamp']
    output = logs.insert(log)
    data = dumps(output)
    return jsonify({"Status": "OK", "data": data})

@app.route('/logs/<log_id>', methods=['GET'])
def get_book_by_title(log_id):
    logs = mongo.db.logs_collection
    output = logs.find({'log_id':log_id})
    data = dumps(output)
    return jsonify({"Status": "OK", "id": log_id, "data": data})

@app.route('/logs/delete/<oid>', methods=['DELETE'])
def delete_book(oid):
    logs = mongo.db.logs_collection
    try:
        output = logs.delete({'_id': ObjectId(oid)})
        return jsonify({"Status": "OK"})
    except e:
        return jsonify({"Error":"404"})

if __name__ == '__main__':
    app.run(port=7000, debug=True)
