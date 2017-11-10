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
    data = client.get_all()
    return data

# The GET request with oid returns a particular document having that Id
# The PUT request decrements the quantity of the book in the inventory

@app.route('/v1/books/<oid>', methods=['GET','PUT'])
def book_by_id(oid):    
    if request.method =='PUT':
        data = client.put_one(oid)
    elif request.method == 'GET':
        data = client.get_one(oid)
    return data

if __name__ == '__main__':
    app.run(debug=True)
