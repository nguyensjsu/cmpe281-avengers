import csv
import json
import pymongo

connection = pymongo.MongoClient()
db = connection.test_db
collection = db.test_collection


with open('../new-books.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    rows = list(reader)

    with open('mapper.json', 'w') as json_file:
        for row in rows:
            json.dump(row, json_file)

for row in rows:
    collection.insert(row)

for items in collection.find():
    print(items) 
