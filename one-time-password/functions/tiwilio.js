const twilio = require('twilio');

const accountSid = 'ACdb2d702e482179de6e94214a21d46176';
const authToken = 'c89ec5edecd5891b15209f0c14ada8ac';

module.exports = new twilio.Twilio(accountSid, authToken);