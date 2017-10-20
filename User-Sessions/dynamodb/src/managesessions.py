import boto3
import os, base64

dynamodb = boto3.resource('dynamodb', region_name='us-west-1')

table = dynamodb.Table('Sessions')

def generate_session():
    return base64.b64encode(os.urandom(16))

def create_session_entry():
    sessionvalue = generate_session()
    table.put_item(
       Item={
            'customerID': '2',
            'sessionID': sessionvalue
        }
)


create_session_entry()
