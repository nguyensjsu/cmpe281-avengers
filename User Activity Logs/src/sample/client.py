from pymongo import MongoClient
import time

class mongo_client:
    def __init__(self):
        self.client = MongoClient()
        self.db = self.client.logs
        self.collection = self.db.logs_collection

    def insert_document(self, log_id, timestamp, message):

        log = {}
        log["log_id"] = log_id
        log["timestamp"] = timestamp
        log["message"] = message


        try:
            self.collection.insert_one(log).inserted_id
            print("Succesfully inserted the document")

        except:
            print("Document already exists")

        return


if __name__ == "__main__":
    client = mongo_client()
    ts = time.gmtime()
    client.insert_document(1, time.strftime("%Y-%m-%d %H:%M:%S", ts), "Sample User Activity Log Message")
