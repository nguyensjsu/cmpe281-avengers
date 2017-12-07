import csv
import json
import pymongo

connection = pymongo.MongoClient()
db = connection.books
collection = db.books_collection


with open('../new-books.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    rows = list(reader)

    with open('mapper.json', 'w') as json_file:
        for row in rows:
            row["Price"] = int(row["Price"])
            json.dump(row, json_file)
for row in rows:
    collection.insert(row)

for items in collection.find():
    print(items) 
