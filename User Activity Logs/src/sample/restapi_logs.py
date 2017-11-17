from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json
import bson
from bson.objectid import ObjectId
from bson import json_util

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
    log['title']=result['log_id']
    log['author'] = result['timestamp']
    log['price']=result['message']
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
    app.run(debug=True)
