import csv
import json

with open('../new-books.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    rows = list(reader)
    with open('mapper.json', 'w') as json_file:
        for row in rows:
            json.dump(row, json_file)
