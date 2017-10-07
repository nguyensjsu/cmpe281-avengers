### Installing mongodb (Ubuntu 16.04)

Importing the public key 
>> sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6 

Creating a list file for Mongodb
>> echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

reloading the package database
>> sudo apt-get update

installing latest version of mongoDB
>> sudo apt-get install -y mongodb-org

starting mongoDB service
>> sudo service mongod start
