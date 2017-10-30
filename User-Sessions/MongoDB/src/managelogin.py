from pymongo import MongoClient
import uuid
import os, base64

from pprint import pprint

client = MongoClient('mongodb://localhost:27017/')

# book-store is the database name
db = client['book-store']

# Collections
user_data = db['Users']
sessions_data = db['Sessions']

# Class for user details
class User:
    def __init__(self, first_name, last_name, email, password):
        self.id = generate_userid()
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password


# Generates a new session value
def generate_session():
    return base64.b64encode(os.urandom(16))


# Generates a new user ID
def generate_userid():
    return str(uuid.uuid4())


# Adds a session entry to the Sessions table
def add_session(userID):
    sessionvalue = generate_session()
    result = sessions_data.insert_one(
        {
            'userID': userID,
            'sessionID': sessionvalue
        }
    )
    print('session id : ' + str(sessionvalue))
    print('result : ' + str(result.inserted_id))
    return sessionvalue


# Adds user information to the Users table
def add_user(user):
    result = user_data.insert_one(
            {
                'ID': user.id,
                'First name': user.first_name,
                'Last name': user.last_name,
                'Email': user.email,
                'Password': user.password
            }
        )
    print('user id : ' + user.id)
    print('result : ' + str(result.inserted_id))


# Fetches user details based on user ID
def get_user(id):
    return user_data.find_one({'ID': id})


# Fetches session details based on user ID
def get_session(userID):
    return sessions_data.find_one({'userID': userID})



if __name__ == '__main__':
    new_user = User("Amita", "Kamat", "abc@gmail.com", "password")
    add_user(new_user)
    session_value = add_session(new_user.id)
    print ( 'User details: ' + str(get_user(new_user.id)))
    print ( 'Session details: ' + str(get_session(new_user.id)))