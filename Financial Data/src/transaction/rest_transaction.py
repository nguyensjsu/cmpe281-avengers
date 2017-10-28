from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import json
import bson
from bson.objectid import ObjectId
from bson import json_util

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'myorders'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/myorders'

mongo = PyMongo(app)

@app.route('/myorders', methods=['GET',])
def books():
    books = mongo.db.myorders_collection
    output = myorders.find()
    data = dumps(output)
    return jsonify({"Status": "OK", "data": data})

@app.route('/myorders/insert/', methods=['POST'])
def insert_transaction():
    myorders = mongo.db.myorders_collection        
    myorder = {}
    result = json.loads(request.get_data(as_text=True))
    myorder['order-id']=result['order-id']
    myorder['order-date'] = result['order-date']
    myorder['total-amount']=result['total-amount']
    output = myorders.insert(myorder)
    data = dumps(output)
    return jsonify({"Status": "OK", "data": data})



if __name__ == '__main__':
    app.run(debug=True)
