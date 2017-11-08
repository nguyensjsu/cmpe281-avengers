from pymongo import MongoClient 

class mongo_client:
	def __init__(self):
		self.client = MongoClient()
		self.db = self.client.myorders
		self.collection = self.db.myorders_collection

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
