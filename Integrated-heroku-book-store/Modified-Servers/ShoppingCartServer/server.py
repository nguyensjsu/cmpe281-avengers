"""
This file contains the basic crud operations required for
the shopping cart module

_id -> primary key of the collection (automatically generated by
mongoDB)
userId -> getFromUserSessions
productId -> getFromProductCatalog
productName -> getFromProductCatalog
price -> getFromProductCatalog
quantity -> get from user on GUI of shopping cart or add to cart page
"""
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import Flask,render_template,jsonify,json,request
from fabric.api import *
from pprint import pprint
from bson.json_util import dumps

app = Flask(__name__)

"""
mongo_cluster = ("mongodb://haroon:haroon@281-hackathon-shard-00-00-pjkz1.mongodb.net:27017,"
    "281-hackathon-shard-00-01-pjkz1.mongodb.net:27017,"
    "281-hackathon-shard-00-02-pjkz1.mongodb.net:27017"
    "/cmpe282?ssl=true&replicaSet=281-hackathon-shard-0&authSource=admin")
"""

#client = MongoClient(mongo_cluster)
client = MongoClient()
#Database name
db = client["cmpe282"]

#Collection name
myCart = db["shoppingCart"]

#productId = get from frontend

"""
addTocart: This method adds a product to the cart
adds duplicate items
"""
def addToCart1(productId, quantity):
    #dummy details
    #APICallToProductCatalog
    #productDetails = "curl http://localhost:5000/books/"+productId

    productDetails = {
    "_id": productId,
    "title": "cracking the coding interview",
    "price": 37.95,
    "productImage": "green book with a clock"
    }

    #document to insert
    item = {}

    #Check the schema for user database
    item['userId'] = userDetails['userName']
    item['productId'] = productDetails['_id']
    item['productName'] = productDetails['title']
    item['price'] = productDetails['price']

    #check the exact attribute name for the image
    item['productImage'] = productDetails['productImage']
    item['quantity'] = quantity
    cartId = myCart.insert_one(item).inserted_id
    #print(cartId)

"""
getCartDetails: display the contents of shopping cart for the given user
    userId: user whose cart content is to be displayed
"""
def getCartDetails(userId):
    items = myCart.find({"userId":userId})
    for item in items:
        pprint(item)

"""
findProduct : returns the details of a product for
              a given user from the database
    userId    : user id for whom product details are needed
    productId : product whose details are required
"""

@app.route("/v1/cart/",methods=['GET'])
def findProduct():
    """
    NOTE: If we want to project only select few columns
    then use additional arg to find_one
    e.g. to include only userId and productId use:
    myCart.find_one({"userId":userId, "productId" : productId},
    {userId:1, productId:1, _id:0})
    """
    try:
        result = json.loads(request.get_data(as_text=True))

        print(str(result))
        userId = result['userId']
        productId = result['productId']
        item = myCart.find_one({"userId":long(userId), "productId" : long(productId)})
        data = dumps(item)
        print(str(item))
        return jsonify({"Status" : "OK", "data" : data})
    except Exception, e:
        return jsonify(status='ERROR',message=str(e))


@app.route("/v1/shoppingCart/",methods=['GET'])
def getCartDetails():
    """
    Displays the complete shopping cart for the user
    """
    try:
        result = json.loads(request.get_data(as_text=True))
        userId = result['userId']
        items = myCart.find({"userId":long(userId)})
        data = dumps(items)
        print(str(items))
        return jsonify({"Status" : "OK", "data" : data})
    except Exception, e:
        return jsonify(status='ERROR',message=str(e))

"""
updateCart : This method updates an item in the cart
    userId:
    productId:
    newQty:

if newQty is 0 : call the delete method and remove this item from cart
"""
@app.route("/v1/cart",methods=['PUT'])
def updateCart():
    try:
        result = json.loads(request.get_data(as_text=True))
        userId = result['userId']
        productId = result['productId']
        quantity = result['quantity']
        #if quantity == 0 we need to delete the item from cart
        result = myCart.update_one({"userId":userId, "productId": productId},
        {"$set": {"quantity": quantity} })
        return jsonify({"Status" : "OK", "data" : data})
    except Exception, e:
        return jsonify(status='ERROR',message=str(e))


"""
deleteProduct: This method removes a product from the cart
    userId:
    productId:
"""
@app.route("/v1/cart",methods=['DELETE'])
def deleteProduct():
    try:
        userId = request.json['userId']
        productId = request.json['productId']
        result = myCart.delete_one({"userId":userId, "productId" : productId})
        #data = dumps(result)
        return jsonify({"Status" : "OK", "data" : data})
    except Exception, e:
        return jsonify(status='ERROR',message=str(e))


"""
insertOrUpdateItemInCart: This method updates the quantity
     of the product if it is available or else inserts the
     product in the shopping cart
"""
@app.route('/v1/cart', methods=['POST'])
def insertOrUpdateItemInCart():
    #APICallToProductCatalog
    #productDetails = "curl http://localhost:5000/books/"+productId
    #It is assumed that user Id is obtained from user db
    #ProductId and productName from productCatalog
    try:
        result = json.loads(request.get_data(as_text=True))
        userId = request.json['userId']
        productId = request.json['productId']
        title = request.json['title']
        author = request.json['author']
        price = request.json['price']
        imageUrl = request.json['imageUrl']
        
        output = myCart.update_one(
           {
            "userId":userId,
            "productId": productId,
            "title": title,
            "author": author,
            "price":price,
            "imageUrl": imageUrl
           },
           {
            "$inc": {"quantity":1}
           },
           upsert = True)
        #data = dumps(output)
        print("Post sucessful")
        print(result)
        return jsonify({"Status": "OK", "result" : result})
    except Exception, e:
        return jsonify(status='ERROR',message=str(e),result = result)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9999)


