from pymongo import MongoClient
import uuid
import os, base64
import json

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


# Class for user session
class Session:
    def __init__(self, userID):
        self.userID = userID,
        self.sessionID = generate_session()


# Generates a new session value
def generate_session():
    return base64.b64encode(os.urandom(16))


# Generates a new user ID
def generate_userid():
    return str(uuid.uuid4())


#----------------------- BASIC CRUD METHODS FOR USER INFORMATION -----------------------------------#

# Creates a user
def create_user(first_name, last_name, email, password):
    new_user = User(first_name, last_name, email, password)
    return add_user(new_user)


# Adds user information to the Users table
def add_user(user):
    if verify_unique_email(user.email):
        try:
            user_data.insert_one(
                    {
                        'id': user.id,
                        'firstname': user.first_name,
                        'lastname': user.last_name,
                        'email': user.email,
                        'password': user.password
                    }
                )
            return user.id
        except:
            return None
    else:
        print("Email already exists. Log in or use a new email.")
        return 0


# Fetches user details based on user ID
def get_user(id):
    return user_data.find_one({'id': id})

# Verify the user credentials
def verify_user(email, password):
    result = user_data.find_one({'email': email, 'password' : password})
    if result is None:
        return False
    else:
        return True

# Verify the email for register is unique
def verify_unique_email(email):
    result =  user_data.find_one({'email': email})
    if result is None:
        return True
    else:
        return False

# Delete user based on user ID
def delete_user(id):
    user_data.delete_one({'id': id})


# Update user details
def update_user(user):
    user_data.update_one(
        {"id": user.id},
            {
            "$set": {
                'firstname': user.first_name,
                'lastname': user.last_name,
                'email': user.email,
                'password': user.password
            }
        }
    )

#----------------------- BASIC CRUD METHODS FOR SESSION INFORMATION -----------------------------------#
# Adds a session entry to the Sessions table
def add_session(session):
    result = sessions_data.insert_one(
        {
            'userid': session.userID,
            'sessionid': session.sessionID
        }
    )


# Fetches session details based on user ID
def get_session(userID):
    return sessions_data.find_one({'userid': userID})


# Delete session entry based on User ID
def delete_session(userID):
    return sessions_data.delete_one({'userid': userID})


# Update session value for a user
def update_session(session):
    sessions_data.update_one(
        {"userid": session.userID},
            {
                "$set": {
                    'sessionid': session.sessionID
                }
            }
    )

# Verify if the session for the user is valid
def verify_session(id, session_value):
    result = sessions_data.find_one({'userid': id, 'sessionid' : session_value})
    if result is None:
        return False
    else:
        return True

# Verify login and create session
def verify_login_create_session(id, email, password):
    if(verify_user(email, password)):
        # if valid create a session, store it and return session value to the client.
        delete_session(id)
        session = Session(id)
        add_session(session)
        return session.sessionID
    else:
        return 0


if __name__ == '__main__':

    ### Tests to test the above methods ###

    new_user = User("A", "B", "abc@gmail.com", "password")
    add_user(new_user)
    print("Test unique email: ")
    repeat_user = User("Amita", "Kamat", "abc@gmail.com", "password")
    add_user(repeat_user)

    print ( 'User details: ' + str(get_user(new_user.id)))

    print ("Test Invalid login : " + str(verify_login_create_session(new_user.id, new_user.email, 'password1')))
    print ("Test Valid login : " + str(verify_login_create_session(new_user.id, new_user.email, 'password')))

    new_user.first_name = "A"
    new_user.last_name = "K"
    update_user(new_user)
    print('User details after update: ' + str(get_user(new_user.id)))

    delete_session(new_user.id)
    session_id = verify_login_create_session(new_user.id, new_user.email, 'password')
    print ("Test Valid session : " + str(verify_session(new_user.id, session_id)))
    print ("Test Invalid session : " + str(verify_session(new_user.id, 'invalid-sessiond')))
    delete_user(new_user.id)
    delete_session(new_user.id)

    print('User details after delete: ' + str(get_user(new_user.id)))
    print('Session details after delete: ' + str(get_session(new_user.id)))

