import redis
import os, base64

r = redis.StrictRedis(host='**enter endpoint-url**', port=6379, db=0)

def generate_session():
    return base64.b64encode(os.urandom(16))

def store_session():
    customerid = '1'
    session_entry = {
         "sessionid": generate_session()
    }
    r.set(customerid,session_entry)

    print(r.get(customerid))

if __name__ == '__main__':
    store_session()