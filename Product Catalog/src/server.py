import pymongo
from flask import Flask, request, jsonify,abort
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json
import bson
from bson.objectid import ObjectId
from bson import json_util
from pymongo import errors
from client import mongo_client
from logger import setup_logger

app = Flask(__name__)

logger = setup_logger()

app.logger.addHandler(logger)

app.logger.info("Getting Mongo Client handler")

try:
    client = mongo_client()
except Exception as e:
    data = json.loads(e.args[0])
    abort(500,data)

app.logger.info("Connected to Mongo Client")

    
#The GET request returns all the books in the database.

@app.route('/v1/books', methods=['GET'])
def get_books():
    app.logger.info("Recieved a GET all request")
    response = client.get_all()
    data = json.loads(response)

    ''' MongoDB returns non existant Document with response status 200.
        Therefore, we should manually throw a 404 Not found error,
        if the response data is empty '''

    if data["data"] is None:
        app.logger.info("Document Not Found")
        abort(404)
    return jsonify(data)

# The GET request with oid returns a particular document having that Id
# The PUT request decrements the quantity of the book in the inventory

@app.route('/v1/books/<oid>', methods=['GET','PUT'])
def book_by_id(oid):    
    if request.method =='PUT':
        app.logger.info("Recieved a PUT request")

        ''' Decrement one quantity from the inventory'''

        response = client.put_one(oid)
        data = json.loads(response)

        ''' Manually check if the query was successful.
            If not, Send an error response'''
 
        if data["Status"] == 'OK':
            return jsonify({"Status":"OK"})
        else:
            app.logger.info("Document Not Found")
            return jsonify({"Status":"Error",\
                            "Message":"Could not complete the request"})

    elif request.method == 'GET':
        app.logger.info("Recieved a GET One Request")
        ''' Retrieve the document by its _id'''

        response = client.get_one(oid)
        data = json.loads(response)
        
        ''' Check if the returned document is empty.
            If empty, return 404 status as the document is not found''' 
        
        if data["data"] is None:
             abort(404)
             app.logger.info("Document Not Found")
        return jsonify(data)


@app.errorhandler(404)
def not_found(e):
    return 'Not found'


@app.errorhandler(500)
def server_error(e):
    return jsonify({e})

'''
def get_mongo_client():
    global client
    app.logger.info("Getting Mongo Client handler")
    try:
        client = mongo_client()
    except Exception as e:
        data = json.loads(e.args[0])
        abort(500,data)

    app.logger.info("Connected to Mongo Client")

'''


if __name__ == '__main__':
    app.run(debug=True)
