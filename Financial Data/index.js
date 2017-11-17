'use strict';

const app = require('express')();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/db',
    collection: 'sessions'
});

app.use(session({
  secret: 'secret session key',
  resave: false,
  saveUninitialized: true,
  store: store,
  unset: 'destroy',
  name: 'session cookie name'
}));

app.get('/', (req, res) => {
  if(!req.session.test) {
    req.session.test = 'OK';
    res.send('OK');
  }
});

app.get('/order', (req, res) => {
  res.send(req.session.test); // 'OK'
});