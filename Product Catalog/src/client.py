from pymongo import MongoClient 

class mongo_client:
	def __init__(self):
		self.client = MongoClient()
		self.db = self.client.books
		self.collection = self.db.books_collection

	def insert_document(self,title,author,price):
		
		book = {}  
		book["title"] = title  
		book["author"] = author  
		book["price"] = price 

		try:  
    			self.collection.insert_one(book).inserted_id
			print("Succesfully inserted the document")
			
		except:  
    			print("Document already exists")

		return



if __name__ == "__main__":
	client = mongo_client()
	client.insert_document("Sample Book","Sample author", 10)
