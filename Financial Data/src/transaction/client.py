from pymongo import MongoClient 
class mongo_client:
    def __init__(self):
        try:
            self.client = MongoClient()
            self.db = self.client.books
            self.collection = self.db.books_collection
        except pymongo.errors.ConnectionFailure as e:
            return jsonify({"Status": "Error",\
                            "Message":"Connection lost with database server"})
        except pymongo.errors.ServerSelectionTimeoutError as e:
            return jsonify({"Status": "Error",\
                            "Message":"Could not connect to database server"})

   
    def get_all(self):
        try:
            output = self.collection.find()
            data = dumps(output)
        except Exception as e:
            return jsonify({"Status":"Error"})
        return jsonify({"Status": "OK", "data": json.loads(data)})

    def get_one(self,oid):
        try:
            output = self.find_one({'_id': ObjectId(oid)})
            data = dumps(output)
        except Exception as e:
            return jsonify({"Status":"Error"})
        return jsonify({"Status": "OK", "data": json.loads(data)})

    def put_one(self,oid):
        try:
            output = books.update_one({'_id': ObjectId(oid)},\
                                      {'$inc':{\
                                               'Qty': -1\
                                              }})
            data = dumps(output)
        except Exception as e:
            return jsonify({"Status":"Error"})
        return jsonify({"Status":"OK"})


	def insert_document(self,id,date,amount):
		
		myorder = {}  
		myorder["order-id"] = id  
		myorder["order-date"] = date  
		myorder["total-amount"] = amount 

		try:  
    			self.collection.insert_one(myorder).inserted_id
			print("Succesfully inserted the transaction")
			
		except:  
    			print("Transaction already exists")

		return



if __name__ == "__main__":
	client = mongo_client()
	client.insert_document("abcd1234","my date", 100)
