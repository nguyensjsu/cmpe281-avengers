from flask import Flask, request, jsonify
from managelogin import create_user, update_user
from managelogin import verify_login_create_session
from managelogin import verify_session
from managelogin import delete_session
from managelogin import get_user
from managelogin import User
import json

app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello App!!"


@app.route("/v1/users", methods = ['POST'])
def manage_users():
    if request.method == 'POST':
        data = request.json
        result = create_user(data["firstname"], data["lastname"], data["email"], data["password"])
        if result == 0:
            return "Email already exists. Log in or use a new email."
        if result == 1:
            return "Created user. Error creating session. Please login again."
        if result is None:
            return "Failed to add user. Please try again"
        else:
            return jsonify(result)

    # TODO: Create appropriate http response


@app.route("/v1/users/<id>", methods = ['GET', 'PUT'])
def get_user_details(id):
    if request.method == 'GET':
        result = get_user(id)
        if result is None:
            return "User does not exist"
        else:
            return "User exists: " + str(result)

        # TODO: Create appropriate http response

    if request.method == 'PUT':
        data = request.json
        user = User(data["firstname"], data["lastname"], data["email"], data["password"], id)
        result = update_user(user)
        if result is None:
            return "Error modifying user details. Please try again."
        else:
            return "User details modified."


@app.route("/v1/login", methods = ['POST', 'GET', 'DELETE'])
def login():
    if request.method == 'POST':
        data = request.json
        result = verify_login_create_session(data["email"], data["password"])
        if result is None:
            return "Invalid credentials. Please try again."
        if result == 0:
            return "User valid. Error creating session. Please try again."
        else:
            return "Session created: " + result.decode("utf-8")

        # TODO: Create appropriate http response

    if request.method == 'GET':
        data = request.json
        result = verify_session(data["id"], data["session"].encode('utf-8'))
        if result:
            return "Valid session"
        else:
            return "Invalid session"

        # TODO: Create appropriate http response

    if request.method == 'DELETE':
        data = request.json
        result = delete_session(data["id"])
        if result is None:
            return "Error deleting session."
        if result.deleted_count == 0:
            return "Session does not exist for the user."
        else:
            return "Successfully signed out."

        # TODO: Create appropriate http response


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')