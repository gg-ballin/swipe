const admin           = require('firebase-admin');
const functions       = require('firebase-functions');
const createUser      = require('./create_user.js');
const serviceAccount  = require('./service_account.json');
const reqOneTimePass  = require ('./request_one_time_password');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://one-time-password-6844d.firebaseio.com"
});

exports.createUser = functions.https.onRequest(createUser);
exports.reqOneTimePass = functions.https.onRequest(reqOneTimePass);