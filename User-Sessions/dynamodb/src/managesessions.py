import boto3
import uuid
import os, base64

dynamodb = boto3.resource('dynamodb', region_name='us-west-1')

session_table = dynamodb.Table('Sessions')
user_creds_table = dynamodb.Table('UserCreds')

class User:
    def __init__(self, first_name, last_name, email, password):
        self.id = generate_userid()
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password


def generate_session():
    return base64.b64encode(os.urandom(16))

def generate_userid():
    return str(uuid.uuid4())

def add_session(userID):
    sessionvalue = generate_session()
    session_table.put_item(
       Item={
            'userID': userID,
            'sessionID': sessionvalue
        }
)

def add_user(user):
    user_creds_table.put_item(
        Item={
            'ID': user.id,
            'First name': user.first_name,
            'Last name': user.last_name,
            'Email': user.email,
            'Password': user.password
        }
    )


if __name__ == '__main__':
    new_user = User("Amita", "Kamat", "abc@gmail.com", "password")
    add_user(new_user)
    add_session(new_user.id)
