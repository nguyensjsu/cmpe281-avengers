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

#The GET request returns all the books in the database.
 
@app.route('/v1/books', methods=['GET'])
def books():
    response = client.get_all()
    data = json.loads(response)
    if data["data"] == 'null':
        abort(404)
    return jsonify(data)

# The GET request with oid returns a particular document having that Id
# The PUT request decrements the quantity of the book in the inventory

@app.route('/v1/books/<oid>', methods=['GET','PUT'])
def book_by_id(oid):    
    if request.method =='PUT':
        data = client.put_one(oid)
    elif request.method == 'GET':
        data = client.get_one(oid)
        data1 = json.loads(data)
        # TODO: Modify data1 here?
    return jsonify(data1)
    #return data



@app.errorhandler(404)
def not_found(e):
    return 'Not found'


if __name__ == '__main__':
    app.run(debug=True)
