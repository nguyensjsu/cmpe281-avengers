import pymongo
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json
import bson
from bson.objectid import ObjectId
from bson import json_util
from pymongo import errors
from client import mongo_client

app = Flask(__name__)

client = mongo_client()

#The GET request returns all the logs in the database.
 
@app.route('/v1/logs', methods=['GET'])
def logs():
    logs = client.get_all()
    return logs

@app.route('/v1/logs/<oid>', methods=['GET','PUT'])
def log_by_id(oid):    
    if request.method =='PUT':
        log = client.put_one(oid)
    elif request.method == 'GET':
        log = client.get_one(oid)
    return log

if __name__ == '__main__':
    app.run(debug=True)
