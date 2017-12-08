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
	try:
		data = request.json
		result = create_user(data["firstname"], data["lastname"], data["email"], data["password"])
		if result == 0:
		    return jsonify({"result": 0, "message":"Email already exists. Log in or use a new email."})
		if result == 1:
		    return jsonify({"result": 1, "message":"Created user. Error creating session. Please login again."})
		if result is None: 
		    return jsonify({"result": 2, "message":"Failed to add user. Please try again"})
		else:
		    return jsonify(result)
	except:
		return jsonify({"result": 3, "message":"Server Error!"})


@app.route("/v1/users/<id>", methods = ['GET', 'PUT'])
def get_user_details(id):
    if request.method == 'GET':
	try:
		result = get_user(str(id))
		if result is None: 
		    return jsonify({"result": 0, "message": "User does not exist"})
		else:
		    return jsonify({'firstname': result['firstname'], 'lastname': result['lastname'], 'email': result['email'],
		                    'password': result['password'], 'id' : result['id']})
	except:
		return jsonify({"result": 3, "message":"Server Error!"})		


    if request.method == 'PUT':
	try:
		data = request.json
		user = User(data["firstname"], data["lastname"], data["email"], data["password"], id)
		result = update_user(user)
		if result is None:
		    return "Error modifying user details. Please try again."
		else:
		    return "User details modified."
	except:
		return jsonify({"result": 3, "message":"Server Error!"})


@app.route("/v1/login", methods = ['POST', 'GET', 'DELETE'])
def login():
    if request.method == 'POST':
	try:
		data = request.json
		result = verify_login_create_session(data["email"], data["password"])
		if result is None:
		    return jsonify({"result": 2, "message":"Invalid credentials. Please try again."})
		if result == 0: 
		    return jsonify({"result": 0, "message":"User valid. Error creating session. Please try again."})
		if result == 1: 
		    return jsonify({"result": 1, "message":"User does not exist"})
		else:
		    return jsonify(result)
	except:
		return jsonify({"result": 3, "message":"Server Error!"})


    if request.method == 'GET':
	try:
		print("in get method")
		print(request)
		print(str(request.json))
		data = str(request.json)
		print(data)
		
		#id = request.args.get('id')
		#session = request.args.get('session')
		result = verify_session(data["id"], data["session"].encode('utf-8'))
		#result = verify_session(id, session.encode('utf-8'))
		if result:
		    return jsonify({"result": 0, "message":"Valid session"});
		else:
		    return jsonify({"result": 1, "message":"Invalid session"});
	except:
		return jsonify({"result": 3, "message":"Server Error!"})


    if request.method == 'DELETE':
	try:
		data = request.json
		result = delete_session(data["id"])
		if result is None:
		    return jsonify({"result": 1});
		    #return "Error deleting session."
		if result.deleted_count == 0:
		    return jsonify({"result": 2});
		    #return "Session does not exist for the user."
		else:
		    return jsonify({"result": 0});
	except:
		return jsonify({"result": 3, "message":"Server Error!"})


@app.route("/v1/verifySession", methods = ['POST'])
def verifySession():
    if request.method == 'POST':
	try:
		data = request.json        
		#id = request.args.get('id')
		#session = request.args.get('session')
		result = verify_session(data["id"], data["session"].encode('utf-8'))
		#result = verify_session(id, session.encode('utf-8'))
		if result:
		    return jsonify({"result": 0, "message":"Valid session"});
		else:
		    return jsonify({"result": 1, "message":"Invalid session"});
	except:
		return jsonify({"result": 3, "message":"Server Error!"})


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=9000)
