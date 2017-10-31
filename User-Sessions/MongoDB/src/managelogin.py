from pymongo import MongoClient
import uuid
import os, base64

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


# Delete user based on user ID
def delete_user(id):
    user_data.delete_one({'ID': id})


# Update user details
def update_user(user):
    user_data.update_one(
        {"ID": user.id},
            {
            "$set": {
                'First name': user.first_name,
                'Last name': user.last_name,
                'Email': user.email,
                'Password': user.password
            }
        }
    )

#----------------------- BASIC CRUD METHODS FOR SESSION INFORMATION -----------------------------------#
# Adds a session entry to the Sessions table
def add_session(session):
    result = sessions_data.insert_one(
        {
            'userID': session.userID,
            'sessionID': session.sessionID
        }
    )
    print('session id : ' + str(session.sessionID))
    print('result : ' + str(result.inserted_id))


# Fetches session details based on user ID
def get_session(userID):
    return sessions_data.find_one({'userID': userID})


# Delete session entry based on User ID
def delete_session(userID):
    return sessions_data.delete_one({'userID': userID})


# Update session value for a user
def update_session(session):
    sessions_data.update_one(
        {"userID": session.userID},
            {
                "$set": {
                    'sessionID': session.sessionID
                }
            }
    )


if __name__ == '__main__':

    new_user = User("Amita", "Kamat", "abc@gmail.com", "password")
    add_user(new_user)

    new_session = Session(new_user.id)
    add_session(new_session)

    print ( 'User details: ' + str(get_user(new_user.id)))
    print ( 'Session details: ' + str(get_session(new_user.id)))

    new_user.first_name = "A"
    new_user.last_name = "K"
    update_user(new_user)
    print('User details after update: ' + str(get_user(new_user.id)))
    new_session.sessionID = generate_session()
    update_session(new_session)
    print ( 'Session details after update: ' + str(get_session(new_session.userID)))


    delete_session(new_user.id)
    delete_user(new_user.id)

    print('User details after delete: ' + str(get_user(new_user.id)))
    print('Session details after delete: ' + str(get_session(new_user.id)))
