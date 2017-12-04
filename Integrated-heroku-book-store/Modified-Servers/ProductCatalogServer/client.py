from pymongo import MongoClient 
from bson.json_util import dumps
from bson.objectid import ObjectId
from pymongo import errors
from flask import jsonify
import json

'''Mongo Client object to do crud operations on MongoDB'''

class mongo_client:
    def __init__(self):
        error_message = ''
        try:
            self.client = MongoClient()
        except pymongo.errors.ConnectionFailure as e:
            error_message = json.dumps({"Status": "Error",\
                            "Message":"Connection lost with database server"})
        except pymongo.errors.ServerSelectionTimeoutError as e:
            error_message = json_dumps({"Status": "Error",\
                            "Message":"Could not connect to database server"})
        if error_message != '':
            raise Exception(error_message) 
        self.db = self.client.books
        self.collection = self.db.books_collection

   
    def get_all(self):
        try:
            output = self.collection.find()
            data = dumps(output)
        except Exception as e:
            return json.dumps({"Status":"Error"})
        #return json.dumps({"Status": "OK", "data": json.loads(data)})
        return jsonify({"Status": "OK", "data": data})

    def get_one(self,oid):
        try:
            output = self.collection.find_one({'_id': ObjectId(oid)})
            data = dumps(output)
        except Exception as e:
            return json.dumps({"Status":"Error"})
        # return json.dumps({"Status": "OK", "data": json.loads(data)})
        return jsonify({"Status": "OK", "data": data})

    def put_one(self,oid):
        try:
            output = books.update_one({'_id': ObjectId(oid)},\
                                      {'$inc':{\
                                               'Qty': -1\
                                              }},\
                                       safe=True)
            data = dumps(output)
        except Exception as e:
            return json.dumps({"Status":"Error"})
        # return json.dumps({"Status":"OK"})
        return jsonify({"Status": "OK", "data": data})

    def get_title(self,title):
        try:
            output = self.collection.find({'Title': title})
            data = dumps(output)
        except Exception as e:
            return json.dumps({"Status":"Error"})
        # return json.dumps({"Status": "OK", "data": json.loads(data)})
        return jsonify({"Status": "OK", "data": data})
    

    def get_author(self,author):
        try:
            output = self.collection.find({'Author': author})
            data = dumps(output)
        except Exception as e:
            return json.dumps({"Status":"Error"})
        # return json.dumps({"Status": "OK", "data": json.loads(data)})
        return jsonify({"Status": "OK", "data": data})

    def sort_hightolow(self):
        try:
            output = self.collection.find().sort("Price",-1)
            data = dumps(output)
        except Exception as e:
            return json.dumps({"Status":"Error"})
        # return json.dumps({"Status": "OK", "data": json.loads(data)})
        return jsonify({"Status": "OK", "data": data})

    def sort_lowtohigh(self):
        try:
            output = self.collection.find().sort("Price",1)
            data = dumps(output)
        except Exception as e:
            return json.dumps({"Status":"Error"})
        # return json.dumps({"Status": "OK", "data": json.loads(data)})
        return jsonify({"Status": "OK", "data": data})



if __name__ == "__main__":
    client = mongo_client()
    print(client.sort_hightolow())
